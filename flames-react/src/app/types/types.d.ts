import { store } from "../common/redux/store/store";

export type RootState = ReturnType<typeof store.getState>;
export type AppAction = ReturnType<typeof store.dispatch>;
export type AppDispatch = typeof store.dispatch;
export type SliceType = unknown;
