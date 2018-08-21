const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray; 

const SelectedPageService = require("../shared/selected-page-service");

function HomeViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Locate");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
        loc: [],

        formatted_display: []
    });

    viewModel.set("formatted_display", new ObservableArray ([]));

    return viewModel;
}

module.exports = HomeViewModel;
