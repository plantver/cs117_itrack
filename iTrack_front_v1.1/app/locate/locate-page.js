const app = require("application");

const LocateViewModel = require("./locate-view-model");

console.log("t1");

var context = android.content.Context;
var wifi_service = app.android.context.getSystemService(context.WIFI_SERVICE);
wifi_service.setWifiEnabled(true);  

console.log("t2");

var rs = wifi_service.startScan();

console.log("foreground activity: ", app.android.foregroundActivity)
console.log("accesscoarse location: ", android.Manifest.permission.ACCESS_COARSE_LOCATION)

/*var hasPermission = android.os.Build.VERSION.SDK_INT < 23;
if (!hasPermission) {
    hasPermission = android.content.pm.PackageManager.PERMISSION_GRANTED ==
    android.support.v4.content.ContextCompat.checkSelfPermission(app.android.foregroundActivity, android.Manifest.permission.ACCESS_COARSE_LOCATION);
}

console.log("t3");
var ACCESS_COARSE_LOCATION_PERMISSION_REQUEST_CODE = 555;

if (!hasPermission) {
    android.support.v4.app.ActivityCompat.requestPermissions(
                    app.android.foregroundActivity,
                    [android.Manifest.permission.ACCESS_COARSE_LOCATION],
                    ACCESS_COARSE_LOCATION_PERMISSION_REQUEST_CODE);
}*/

// console.log("location code: ",  ACCESS_COARSE_LOCATION_PERMISSION_REQUEST_CODE)

console.log("t4");

app.android.registerBroadcastReceiver(
        android.net.wifi.WifiManager.SCAN_RESULTS_AVAILABLE_ACTION
        , function onReceiveCallback(context, intent) {    
            var tp = wifi_service.getScanResults();
            console.log(tp);
        });

function onNavigatingTo(args) {
    console.log("onNavigatingTo Locate");
    const page = args.object;
    page.bindingContext = new LocateViewModel();
   
}

function onDrawerButtonTap(args) {
    console.log("onDrawerButtonTap Locate");
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();

}



exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
