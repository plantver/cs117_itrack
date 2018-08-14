const app = require("application");

const LocateViewModel = require("./locate-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new LocateeViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
