from flask import (Flask, request, g, json)
from pprint import pprint
import numpy as np
import h5py
import argparse
from datetime import datetime, timedelta
from collections import defaultdict


app = Flask(__name__)


@app.route("/")
def index():
    return ("itrack", 200)


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = h5py.File(args.profh5, 'a')
    return db


def update_ap_info(ap, d, is_new_ap=True):
    if is_new_ap:
        ap.create_dataset("SSID", data=d["SSID"])
        ap.create_dataset("n_samp", data=1)
        ap.create_dataset("mean_RSSI", data=d["RSSI"])
        ap.create_dataset("Ex2", data=d["RSSI"]**2)  
    else:
        if ap["SSID"][()] != d["SSID"]:
            ap["SSID"][()] = d["SSID"]

        n = ap["n_samp"][()]
        m = ap["mean_RSSI"][()]
        ex2 = ap["Ex2"][()]
        new_n = n + 1
        new_m = (n*m + d["RSSI"])/new_n
        new_ex2 = (n*ex2 + d["RSSI"]**2)/new_n
        ap["n_samp"][()] = new_n
        ap["mean_RSSI"][()] = new_m
        ap["Ex2"][()] = new_ex2


@app.route('/rec_room_prof', methods=['POST'])
def rec_room_prof():
    data = request.get_json()
    db = get_db()

    if data["loc_ID"] not in db:
        loc = db.create_group(data["loc_ID"])
    else:
        loc = db[data["loc_ID"]]

    for d in data["access_points"]:
        if d["BSSID"] in loc:
            ap = loc[d["BSSID"]]
            update_ap_info(ap, d, is_new_ap=False)
        else:
            ap = loc.create_group(d["BSSID"])
            update_ap_info(ap, d, is_new_ap=True)       

    # DEBUG
    # def print_attrs(name, obj):
    #     print(name, "====================")
    #     if type(obj) == h5py._hl.dataset.Dataset:
    #         print(obj[()])

    # db.visititems(print_attrs)

    print("RECORED! loc %s"%(data["loc_ID"]))

    return ('', 204)


@app.route('/rec_new_room_prof', methods=['POST'])
def rec_new_room_prof():
    data = request.get_json()
    db = get_db()

    if data["loc_ID"] in db:
        del db[data["loc_ID"]]
        print ("DELETED! loc %s"%(data["loc_ID"]))
    return rec_room_prof()


def gaussian_similarity(loc, data):
    l_probs = list()

    for d in data:
        if d["BSSID"] in loc:
            ap = loc[d["BSSID"]]
            m = ap["mean_RSSI"][()]
            v = ap["Ex2"][()] - m**2 + 1
            p = (1/np.sqrt(6.28*v)) * np.exp(-(d["RSSI"]-m)**2/v)
            l_probs.append(p)

    return sum(l_probs)


def make_loc_json_response(response):
    return app.response_class(
        response=json.dumps(response),
        status=200,
        mimetype='application/json'
    )


def get_popdb():
    if "_popdb" not in globals():
        globals()["_popdb"] = defaultdict(list)
    return globals()["_popdb"]


def rec_pop(loc_ID):
    popdb = get_popdb()
    popdb[loc_ID].append(datetime.now())
    print("recored pop", loc_ID, popdb[loc_ID])


@app.route('/popular', methods=['GET', 'POST'])
def popular():
    popdb = get_popdb()
    print(popdb)

    d = timedelta(minutes=10)
    l_pop = list()
    for loc_ID, l_t in popdb.items():
        print(filter(lambda x: datetime.now() - x < d, l_t))
        l_pop.append({
            "location": loc_ID, 
            "popularity": len(list(filter(lambda x: datetime.now() - x < d, l_t)))
            })

    l_pop = sorted(l_pop, key=lambda x: x["popularity"], reverse=True)
    return make_loc_json_response(l_pop)


@app.route('/locate_top4', methods=['GET', 'POST'])
def locate_top4():
    data = request.get_json()
    db = get_db()

    print("I got locate top4")
    l_loc_ID = list()
    l_probs = list()

    for loc_ID, loc in db.items():
        p = gaussian_similarity(loc, data)
        if p > 0:
            l_loc_ID.append(loc_ID)
            l_probs.append(p)

    tot_p = sum(l_probs)
    if tot_p > 0:
        l_probs = np.array(l_probs)/tot_p
        i_top4 = np.argsort(l_probs)[::-1]

        rec_pop(l_loc_ID[i_top4[0]])

        return make_loc_json_response([{
            "location": l_loc_ID[i],
            "relative_probability": l_probs[i]
            } for i in i_top4])
    else:
        return make_loc_json_response([{
            "location": "N/F",
            "relative_probability": 0
            }])


@app.route('/locate', methods=['GET', 'POST'])
def locate():
    data = request.get_json()
    db = get_db()

    print("I got locate")
    l_loc_ID = list()
    l_probs = list()

    for loc_ID, loc in db.items():
        p = gaussian_similarity(loc, data)
        if p > 0:
            l_loc_ID.append(loc_ID)
            l_probs.append(p)

    tot_p = sum(l_probs)
    if tot_p > 0:
        l_probs = np.array(l_probs)/tot_p
        i = np.argmax(l_probs)

        rec_pop(l_loc_ID[i])

        return make_loc_json_response({
            "location": l_loc_ID[i],
            "relative_probability": l_probs[i]
            })
    else:
        return make_loc_json_response({
            "location": "N/F",
            "relative_probability": 0
            })


@app.teardown_appcontext
def teardown_db(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--profh5', dest='profh5', 
                       help='simple hdf5 database containing room profiles')
    parser.add_argument('--host', dest='host', default="127.0.0.1") 
    parser.add_argument('--port', dest='port') 
    args = parser.parse_args()

    app.run(host=args.host, port=args.port, threaded=True)
