const observableModule = require("data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function PopularViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Popular");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
    });

    return viewModel;
}

module.exports = PopularViewModel;
