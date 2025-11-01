import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import animationsReducers from "../reducers/animations-slice";
import offlineAnimationsReducers from "../reducers/resilient-sync-slice";

/**
 * This module configures the root store. The shape of root store will look like:
 *
 * store: {
 *   animations: {
 *     status: <string>                   // represents server API call status
 *     error: <string | undefined>        // represents error received in server API call reponse
 *     animations: <[Animation]>          // represents the list of animations to display on board
 *     currentAnimation: <Animation>      // when user clicks on info icon to see animation metadata, this will be loaded
 *     networkStatus: <string>            // represents network connection status - offline or online.
 *   },
 *   offlineAnimations: {
 *     error: <string | undefined>        // represents error received in server API call reponse
 *     offlineAnimations: <[Animation]>   // represents the list of animations created when network is offline
 *     syncStatus: <string>               // represent synchronization operation status
 *   }
 * }
 *
 */

export const store = configureStore({
  reducer: {
    animations: animationsReducers,
    offlineAnimations: offlineAnimationsReducers,
  },
  middleware: () => [thunk],
  devTools: true,
});
