const app = require("application");

const PopularViewModel = require("./popular-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new PopularViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
