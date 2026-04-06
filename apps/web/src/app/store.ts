import profileReducer from "@/features/account/slice/profileSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;