import {
  PayloadAction,
  Slice,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import Animation from "../../../shapes/animation";
import AnimationsState from "../../../shapes/animations-state";
import InputAnimation from "../../../shapes/input-animation";
import InputSearch from "../../../shapes/input-search";
import {
  queryAllAnimations,
  queryAnimationById,
  createAnimation,
  queryAnimationsByTitle,
} from "../../apollo/gql.apis";
import { AsyncThunkConfig } from "@reduxjs/toolkit/dist/createAsyncThunk";
import { animationsInitialState } from "../initial-states/animations-initial-state";

const createAppAsyncThunk = createAsyncThunk.withTypes<AsyncThunkConfig>();

export const fetchAnimations = createAsyncThunk(
  "graphql/animations",
  async () => {
    const response = await queryAllAnimations();
    return response;
  }
);

export const fetchAnimationById = createAppAsyncThunk(
  "graphql/animations/id",
  async (animationId: string) => {
    const response = await queryAnimationById(animationId);
    return response;
  }
);

export const addAnimation = createAppAsyncThunk(
  "graphql/animations/new",
  async (animation: InputAnimation) => {
    let response = await createAnimation(animation);
    return response.data.addAnimation as Animation;
  }
);

export const searchAnimations = createAppAsyncThunk(
  "graphql/animations/search",
  async (searchData: InputSearch) => {
    let response = await queryAnimationsByTitle(searchData.search);
    return response;
  }
);

const animationsSlice: Slice = createSlice({
  name: "animations" as string,
  initialState: animationsInitialState,
  reducers: {
    setNetworkStatus: (
      state: AnimationsState,
      action: PayloadAction<string>
    ) => {
      state.networkStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimations.pending, (state: AnimationsState) => {
        state.status = "loading";
      })
      .addCase(
        fetchAnimations.fulfilled,
        (state: AnimationsState, action: PayloadAction<Array<Animation>>) => {
          state.status = "succeeded";
          state.animations = action.payload;
        }
      )
      .addCase(fetchAnimations.rejected, (state: AnimationsState, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAnimationById.pending, (state: AnimationsState) => {
        state.status = "loading";
      })
      .addCase(
        fetchAnimationById.fulfilled,
        (state: AnimationsState, action: PayloadAction<Animation>) => {
          state.status = "succeeded";
          state.currentAnimation = action.payload;
        }
      )
      .addCase(
        fetchAnimationById.rejected,
        (state: AnimationsState, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      )
      .addCase(addAnimation.pending, (state: AnimationsState) => {
        state.status = "loading";
      })
      .addCase(
        addAnimation.fulfilled,
        (state: AnimationsState, action: PayloadAction<Animation>) => {
          state.status = "succeeded";
          state.animations.unshift(action.payload);
        }
      )
      .addCase(addAnimation.rejected, (state: AnimationsState, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(searchAnimations.pending, (state: AnimationsState) => {
        state.status = "loading";
      })
      .addCase(
        searchAnimations.fulfilled,
        (state: AnimationsState, action: PayloadAction<Array<Animation>>) => {
          state.status = "succeeded";
          state.animations = action.payload;
        }
      )
      .addCase(searchAnimations.rejected, (state: AnimationsState, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setNetworkStatus } = animationsSlice.actions;
export default animationsSlice.reducer;
