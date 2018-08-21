const observableModule = require("data/observable");
const ObservableArray = require("data/observable-array").ObservableArray; 

const SelectedPageService = require("../shared/selected-page-service");

function BrowseViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Measure");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
        roomName: "", //current room being measured
        measures:  [], //AP measures
        roomNames: [], //corresponding rooms for the measurements
        //formatted_display: ["t1"] //formatted string for ListView
        formatted_display: [],
        isLoading: false
    });

    viewModel.set("formatted_display", new ObservableArray ([]));
    //viewModel.measures = new ObservableArray([]);
    //viewModel.roomNames = new ObservableArray([]);
    return viewModel;
}

module.exports = BrowseViewModel;
