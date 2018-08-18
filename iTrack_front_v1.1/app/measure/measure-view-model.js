const observableModule = require("data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function BrowseViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Measure");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
        measurements: [
            { roomName: "Room Name", datetime: "Date and Time"}
        ], //not sure what measurements is to be used for
        roomName: "", //current room being measured
        measures: [], //AP measures
        roomNames: [] //corresponding rooms for the measurements

    });

    return viewModel;
}

module.exports = BrowseViewModel;
