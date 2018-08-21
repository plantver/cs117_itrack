const app = require("application");
const httpModule = require("http");
const BrowseViewModel = require("./measure-view-model");
//const ActivityIndicator = require("tns-core-modules/ui/activity-indicator").ActivityIndicator;
//const Observable = require("tns-core-modules/data/observable").Observable;//new Observable();

var vm = new BrowseViewModel();
var page = null;
var context = android.content.Context;
var wifi_service = app.android.context.getSystemService(context.WIFI_SERVICE);


wifi_service.setWifiEnabled(true);

function onNavigatingTo(args) {
    //vm = new BrowseViewModel();

    vm.set("isLoading", true);
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
                var time_now = new Date();
                //console.log(time_now.getMonth() +"/"+time_now.getDate() +"/"+time_now.getFullYear() +"  "+time_now.getHours() + ":"+time_now.getMinutes());
                var formatted_time = time_now.getMonth() +"/"+time_now.getDate() +"/"+time_now.getFullYear() +"  "+time_now.getHours() + ":"+("00" + time_now.getMinutes()).substr(-2,2);
                page.bindingContext.formatted_display.push(
                    formatted_time + " at "+ page.bindingContext.roomName
                );
                vm.set("isLoading",false);
                //args.object.refresh(); //how does this even work
            });
    vm.set("isLoading",false);
    page.bindingContext = vm; //new BrowseViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function onMeasureTap(args)
{
    vm.set("isLoading",true);
    //const button = args.object;
    var rs = wifi_service.startScan();
    
}

function onUploadTap(args)
{
    //const button = args.object;
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
    page.bindingContext.formatted_display.splice(0);
}

function onReturnPress(args)
{
    console.log(args.object.text);
    page.bindingContext.roomName = args.object.text;
}

function onBlur(args) {
    // blur event will be triggered when the user leaves the TextField
    page.bindingContext.roomName = args.object.text;
    args.object.dismissSoftInput();
    console.log("onBlur event");
}

function onFocus(args) {
    // focus event will be triggered when the users enters the TextField
    console.log("onFocus event");
}

exports.onFocus = onFocus;
exports.onBlur = onBlur;
exports.onReturnPress = onReturnPress;
exports.onMeasureTap = onMeasureTap;
exports.onUploadTap = onUploadTap;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
