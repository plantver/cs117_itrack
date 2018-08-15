const observableModule = require("data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function LocateViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Locate");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
    });
    console.log("LocateViewModel from locate-view-model.js");
    return viewModel;
}

module.exports = LocateViewModel;
