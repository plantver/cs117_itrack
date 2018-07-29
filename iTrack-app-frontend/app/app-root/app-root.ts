import * as app from "application";
import { EventData } from "data/observable";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

import { AppRootViewModel } from "./app-root-view-model";

export function onLoaded(args: EventData): void {
    const drawerComponent = <RadSideDrawer>args.object;
    drawerComponent.bindingContext = new AppRootViewModel();
}