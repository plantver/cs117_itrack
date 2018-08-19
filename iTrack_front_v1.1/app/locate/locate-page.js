const app = require("application");
const httpModule = require("http");
const HomeViewModel = require("./locate-view-model");

var context = android.content.Context;
var wifi_service = app.android.context.getSystemService(context.WIFI_SERVICE);
wifi_service.setWifiEnabled(true);

function onNavigatingTo(args) {
    const page = args.object;

    var hasPermission = android.os.Build.VERSION.SDK_INT < 23;
    console.log("hasPermission: ", hasPermission);
    if (!hasPermission) {
        hasPermission = android.content.pm.PackageManager.PERMISSION_GRANTED ==
        android.support.v4.content.ContextCompat.checkSelfPermission(app.android.foregroundActivity, android.Manifest.permission.ACCESS_COARSE_LOCATION);
    }
    var ACCESS_COARSE_LOCATION_PERMISSION_REQUEST_CODE = 555;
    console.log("hasPermission: ", hasPermission);
    if (!hasPermission) {
        android.support.v4.app.ActivityCompat.requestPermissions(
                        app.android.foregroundActivity,
                        [android.Manifest.permission.ACCESS_COARSE_LOCATION],
                        ACCESS_COARSE_LOCATION_PERMISSION_REQUEST_CODE);
    }

    app.android.unregisterBroadcastReceiver(android.net.wifi.WifiManager.SCAN_RESULTS_AVAILABLE_ACTION);
    app.android.registerBroadcastReceiver(
            android.net.wifi.WifiManager.SCAN_RESULTS_AVAILABLE_ACTION, 
            function onReceiveCallback(context, intent) {    
                let tp = java.util.List;
                tp = wifi_service.getScanResults();
                tp = tp.toArray();
                var res = [];
                for (var i = 0; i < tp.length; i++){
                    var e = tp[i];
                    info = {"SSID": e.SSID,
                            "BSSID": e.BSSID,
                            "RSSI": e.level};
                    res.push(info);
                }
                console.log(res);
                console.log('http://13.57.182.179:5001/locate');
                httpModule.request({
                    url: 'http://13.57.182.179:5001/locate',
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    content: JSON.stringify(res)
                }).then((response) => {
                    console.log(response.content);
                    var res = response.content.toJSON();
                    if (response.statusCode == 200){
                        page.bindingContext.loc = 
                            {room: res.location.toString(), 
                            conf: res.relative_probability.toString()};
                    }
                }, (e) => {console.log(e);});
            });


    page.bindingContext = new HomeViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function onLocateTap(args) {
    const button = args.object;
    var rs = wifi_service.startScan();
    console.log("tap");
}

exports.onLocateTap = onLocateTap;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
