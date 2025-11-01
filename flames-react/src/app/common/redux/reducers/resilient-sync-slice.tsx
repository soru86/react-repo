import InputAnimation from "../../../shapes/input-animation";
import { syncAnimations } from "../../apollo/gql.apis";
import { Slice, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { offlineAnimationsInitialState } from "../initial-states/offline-animations-initial-state";
import OfflineAnimationsState from "../../../shapes/offline-animations-state";
import { AsyncThunkConfig } from "@reduxjs/toolkit/dist/createAsyncThunk";

const createAppAsyncThunk = createAsyncThunk.withTypes<AsyncThunkConfig>();

export const syncOfflineAnimations = createAppAsyncThunk(
  "graphql/animations/sync",
  async (animations: Array<InputAnimation>) => {
    let response = await syncAnimations(animations);
    return response;
  }
);

const offlineAnimationsSlice: Slice = createSlice({
  name: "offlineAnimations",
  initialState: offlineAnimationsInitialState,
  reducers: {
    addOfflineAnimation: (state, action) => {
      state.offlineAnimations.unshift(action.payload);
      state.syncStatus = "pending";
    },
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        syncOfflineAnimations.pending,
        (state: OfflineAnimationsState) => {
          state.syncStatus = "in-progress";
        }
      )
      .addCase(
        syncOfflineAnimations.fulfilled,
        (state: OfflineAnimationsState, action) => {
          if (state.syncStatus === "completed") {
            state["offlineAnimations"] = [];
          }
        }
      )
      .addCase(
        syncOfflineAnimations.rejected,
        (state: OfflineAnimationsState, action) => {
          state.syncStatus = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const { addOfflineAnimation, setSyncStatus } =
  offlineAnimationsSlice.actions;
export default offlineAnimationsSlice.reducer;
