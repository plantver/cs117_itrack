const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray; 

const SelectedPageService = require("../shared/selected-page-service");

function PopularViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Popular");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
        formatted_display: [],
        isLoading: false
    });

    viewModel.set("formatted_display", new ObservableArray ([]));
    return viewModel;
}

module.exports = PopularViewModel;
