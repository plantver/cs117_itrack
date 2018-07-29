"use strict";
/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/
Object.defineProperty(exports, "__esModule", { value: true });
var home_view_model_1 = require("./home-view-model");
// Event handler for Page "pageLoaded" event attached in home-page.xml
function pageLoaded(args) {
    /*
    This gets a reference this page’s <StackLayout> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    var page = args.object;
    page.bindingContext = new home_view_model_1.HomeViewModel();
}
exports.pageLoaded = pageLoaded;
