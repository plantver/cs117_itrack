const app = require("application");

const BrowseViewModel = require("./measure-view-model");

function onNavigatingTo(args) {
    const page = args.object;

    var hasPermission = android.os.Build.VERSION.SDK_INT < 23;
    console.log("hasPermission: ", hasPermission)
    if (!hasPermission) {
        hasPermission = android.content.pm.PackageManager.PERMISSION_GRANTED ==
        android.support.v4.content.ContextCompat.checkSelfPermission(app.android.foregroundActivity, android.Manifest.permission.ACCESS_COARSE_LOCATION);
    }
    var ACCESS_COARSE_LOCATION_PERMISSION_REQUEST_CODE = 555;
    console.log("hasPermission: ", hasPermission)
    if (!hasPermission) {
        android.support.v4.app.ActivityCompat.requestPermissions(
                        app.android.foregroundActivity,
                        [android.Manifest.permission.ACCESS_COARSE_LOCATION],
                        ACCESS_COARSE_LOCATION_PERMISSION_REQUEST_CODE);
    }

    var context = android.content.Context;
    var wifi_service = app.android.context.getSystemService(context.WIFI_SERVICE);
    wifi_service.setWifiEnabled(true);  

    var rs = wifi_service.startScan();

    app.android.registerBroadcastReceiver(
            android.net.wifi.WifiManager.SCAN_RESULTS_AVAILABLE_ACTION
            , function onReceiveCallback(context, intent) {    
                var tp = wifi_service.getScanResults();
                console.log(tp);
            })

    page.bindingContext = new BrowseViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
