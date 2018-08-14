const observableModule = require("data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function MeasureViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Measure");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
    });

    return viewModel;
}

module.exports = MeasureViewModel;
