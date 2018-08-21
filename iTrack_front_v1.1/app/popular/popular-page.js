const app = require("application");
const httpModule = require("http");
const PopularViewModel = require("./popular-view-model");

var page = null;

function onNavigatingTo(args) {
    page = args.object;

    page.bindingContext = new PopularViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function onPopularTap(args) {
    const button = args.object;
    console.log("tap");
    httpModule.request({
        url: 'http://13.57.182.179:5001/popular',
        method: 'GET',
        headers: {"Content-Type": "application/json"}
    }).then((response) => {
        console.log(response.content.toJSON(), response.statusCode);
        var res = response.content;
        if (response.statusCode == 200){
            page.bindingContext.formatted_display.splice(0);
            res.toJSON().forEach((e) => {
                page.bindingContext.formatted_display.push(
                    "Location: " + e.location + "   Popularity: " + e.popularity);
            });
        }
    }, (e) => {console.log(e);});

}

exports.onPopularTap = onPopularTap;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
