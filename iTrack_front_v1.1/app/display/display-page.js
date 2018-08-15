const app = require("application");

const DisplayViewModel = require("./display-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new DisplayViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
