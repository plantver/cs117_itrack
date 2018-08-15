const observableModule = require("data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function DisplayViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Display");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
        signalData: [
                {"wifi": "One", "signal": -10},
                {"wifi": "Two", "signal": -30},
                {"wifi": "Three", "signal": -25}
            ]
    });

    return viewModel;
}

module.exports = DisplayViewModel;
