const app = require("application");

const BrowseViewModel = require("./measure-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new BrowseViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
