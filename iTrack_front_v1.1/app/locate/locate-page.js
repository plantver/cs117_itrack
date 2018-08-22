const app = require("application");
const httpModule = require("http");
const HomeViewModel = require("./locate-view-model");
//const Observable = require("tns-core-modules/data/observable").Observable;//new Observable();

var vm = new HomeViewModel();
var context = android.content.Context;
var wifi_service = app.android.context.getSystemService(context.WIFI_SERVICE);
wifi_service.setWifiEnabled(true);

function onNavigatingTo(args) {
    
    const page = args.object;
    
    vm.set("isLoading",true);
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

                //barchart formatting
                var num_top_networks=4;
                if(res.length < 4)
                {
                    num_top_networks=res.length;
                }
                var temp_array=[];
                for(var j=0;j<num_top_networks;j++)
                {
                    formatted_network={
                        "ID": res[j].SSID.toString(),// + "\r\n" + res[j].BSSID.toString(),
                        "SIG_STRENGTH": 2*(res[j].RSSI + 100)
                    };
                    console.log(formatted_network.ID);
                    temp_array.push(formatted_network);//res[j]);
                }
                console.log(temp_array);
                vm.set("top_networks",temp_array);
                //end barchart formatting

                httpModule.request({
                    url: 'http://13.57.182.179:5001/locate_top4',
                    method: 'POST',
                    headers: {"Content-Type": "application/json"},
                    content: JSON.stringify(res)
                }).then((response) => {
                    console.log(response.content, response.statusCode);
                    var res = response.content;
                    if (response.statusCode == 200){
                        page.bindingContext.loc = res.toJSON();
                        
                        page.bindingContext.formatted_display.splice(0);
                        res.toJSON().forEach((e) => {
                            page.bindingContext.formatted_display.push(
                                "Location: " + e.location + "   Confidence: " + e.relative_probability);
                        });
                    }
                }, (e) => {console.log(e);});
                vm.set("isLoading",false);
            });
    vm.set("isLoading",false);
    page.bindingContext = vm;// new HomeViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function onLocateTap(args) {
    vm.set("isLoading",true);
    const button = args.object;
    var rs = wifi_service.startScan();
    console.log("tap");
}

exports.onLocateTap = onLocateTap;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
