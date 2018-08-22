const observableModule = require("data/observable");
const Observable = require("data/observable").Observable;
const ObservableArray = require("data/observable-array").ObservableArray;

const SelectedPageService = require("../shared/selected-page-service");

function DisplayViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Display");

    const viewModel = observableModule.fromObject({
        isLoading: false,
        network_channels: [],
        //top_four_networks: []
        top0_network: "",
        top1_network: "",
        top2_network: "",
        top3_network: ""
        
        /* Add your view model properties here */
    });

    viewModel.set("network_channels", new ObservableArray([]));
    viewModel.set("top0_network", new Observable());
    viewModel.set("top1_network", new Observable());
    viewModel.set("top2_network", new Observable());
    viewModel.set("top3_network", new Observable());
    return viewModel;
}

module.exports = DisplayViewModel;
