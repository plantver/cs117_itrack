const app = require("application");
const httpModule = require("http");
const DisplayViewModel = require("./display-view-model");

var vm = new DisplayViewModel();
var context = android.content.Context;
var wifi_service = app.android.context.getSystemService(context.WIFI_SERVICE);

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
                
                //linechart storage array set up
                var formatted_frequencies = [];
                for(var j=2408; j<=2466;j+=2){
                    temp_node = {
                        "frequency": j,
                        "signal_strength_0": 0,
                        "signal_strength_1": 0,
                        "signal_strength_2": 0,
                        "signal_strength_3": 0
                    };
                    formatted_frequencies.push(temp_node);
                }

                //linechart formatting
                let tp = java.util.List;
                tp = wifi_service.getScanResults();
                tp = tp.toArray();
                console.log(tp);
                var num_top_networks=4;
                if(tp.length < 4)
                {
                    num_top_networks=tp.length;
                }
                //var top_four = [];
                var curr_network=0;
                for (var i = 0; i < num_top_networks; i++){
                    var e = tp[i];
                    if(e.frequency>5000){
                        num_top_networks++;
                        console.log("read freq: ",e.frequency);
                    }
                    else{
                        var arr_pos = Math.round((e.frequency-2408)/2);
                        console.log("read freq: ",e.frequency);
                        console.log("array position: ",arr_pos);
                        switch(curr_network){
                            case 0:
                                formatted_frequencies[arr_pos-1].signal_strength_0=2*(e.level+100);
                                formatted_frequencies[arr_pos].signal_strength_0=2*(e.level+100);
                                formatted_frequencies[arr_pos+1].signal_strength_0=2*(e.level+100);
                                vm.set("top0_network", e.SSID.toString());
                            break;
                            case 1:
                                formatted_frequencies[arr_pos-1].signal_strength_1=2*(e.level+100);
                                formatted_frequencies[arr_pos].signal_strength_1=2*(e.level+100);
                                formatted_frequencies[arr_pos+1].signal_strength_1=2*(e.level+100);
                                vm.set("top1_network", e.SSID.toString());
                            break;
                            case 2:
                                formatted_frequencies[arr_pos-1].signal_strength_2=2*(e.level+100);
                                formatted_frequencies[arr_pos].signal_strength_2=2*(e.level+100);
                                formatted_frequencies[arr_pos+1].signal_strength_2=2*(e.level+100);
                                vm.set("top2_network", e.SSID.toString());
                            break;
                            case 3:
                                formatted_frequencies[arr_pos-1].signal_strength_3=2*(e.level+100);
                                formatted_frequencies[arr_pos].signal_strength_3=2*(e.level+100);
                                formatted_frequencies[arr_pos+1].signal_strength_3=2*(e.level+100);
                                vm.set("top3_network", e.SSID.toString());
                            break;
                            default:
                                console.log("Switch Statement fail in line graph setup");
                        }
                        curr_network++;
                        console.log(curr_network);
                    }
                    
                    /* info = {"SSID": e.SSID,
                            "BSSID": e.BSSID
                        };
                    top_four.push(info); */
                }
                console.log(formatted_frequencies);
                //console.log(top_four);
                vm.set("network_channels",formatted_frequencies);
                //vm.set("top_four_networks",top_four);
                //end line chart formatting

                vm.set("isLoading",false);
            });
    vm.set("isLoading",false);
    page.bindingContext = vm;//new DisplayViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function onDisplayTap(args) {
    vm.set("isLoading",true);
    console.log("tap Display");
    wifi_service.startScan();
}

exports.onDisplayTap = onDisplayTap;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
