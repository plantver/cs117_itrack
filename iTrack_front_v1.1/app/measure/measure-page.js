const app = require("application");

const MeasureViewModel = require("./measure-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new MeasureViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function onLocateTap(args){
    var results = android.net.getScanResults();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
