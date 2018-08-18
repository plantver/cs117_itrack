const observableModule = require("data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function HomeViewModel(location = {room:"N/A",conf:"N/A"}) {
    SelectedPageService.getInstance().updateSelectedPage("Locate");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
        loc: {
            room: location.room,
            conf: location.conf
        }

        
    });

    return viewModel;
}

module.exports = HomeViewModel;
