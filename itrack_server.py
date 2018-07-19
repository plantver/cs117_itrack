from flask import (Flask, request, g, json)
from pprint import pprint
import numpy as np
import h5py
import argparse

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

    return ('', 204)


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


@app.route('/locate', methods=['GET'])
def locate():
    data = request.get_json()
    db = get_db()

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
    args = parser.parse_args()

    app.run()