const app = require("application");
const httpModule = require("http");
const BrowseViewModel = require("./measure-view-model");

var page = null;
var context = android.content.Context;
var wifi_service = app.android.context.getSystemService(context.WIFI_SERVICE);
wifi_service.setWifiEnabled(true);

function onNavigatingTo(args) {

    page = args.object;

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
                page.bindingContext.measures.push(res);
                page.bindingContext.roomNames.push(page.bindingContext.roomName);
                page.bindingContext.formatted_display.push(
                    "datetimeplaceholder  -  " + page.bindingContext.roomName
                );
                //listView.refresh(); //how does this even work
            });

    page.bindingContext = new BrowseViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function onMeasureTap(args)
{
    const button = args.object;
    var rs = wifi_service.startScan();
}

function onUploadTap(args)
{
    const button = args.object;
    console.log(page.bindingContext.measures);
    page.bindingContext.measures.forEach((m, i) => {
        upload_content = {access_points: m, loc_ID: page.bindingContext.roomNames[i]};
        console.log(JSON.stringify(upload_content));
        httpModule.request({
            url: 'http://13.57.182.179:5001/rec_room_prof',
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            content: JSON.stringify(upload_content)
        }).then((response) => {
            //console.log(response, response.statusCode);
            if (response.statusCode == 204){
                console.log("upload success");
            }
        }, (e) => {console.log(e);});
    });
    page.bindingContext.measures = [];
    page.bindingContext.roomNames = [];
}

function onReturnPress(args)
{
    console.log(args.object.text);
    page.bindingContext.roomName = args.object.text;
}

exports.onReturnPress = onReturnPress;
exports.onMeasureTap = onMeasureTap;
exports.onUploadTap = onUploadTap;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
