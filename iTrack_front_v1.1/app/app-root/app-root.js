const application = require("application");
const frameModule = require("ui/frame");

const AppRootViewModel = require("./app-root-view-model");

function onLoaded(args) {
    console.log("onLoaded root");
    const drawerComponent = args.object;
    drawerComponent.bindingContext = new AppRootViewModel();
    
}

function onNavigationItemTap(args) {
    console.log("onNavigationItemTap root", args);
    const component = args.object;
    const componentRoute = component.route;
    const componentTitle = component.title;
    const bindingContext = component.bindingContext;

    bindingContext.set("selectedPage", componentTitle);
    
    frameModule.topmost().navigate({
        moduleName: componentRoute,
        transition: {
            name: "fade"
        }
    });
    console.log("t5");
    const drawerComponent = application.getRootView();
    drawerComponent.closeDrawer();
}

exports.onLoaded = onLoaded;
exports.onNavigationItemTap = onNavigationItemTap;
