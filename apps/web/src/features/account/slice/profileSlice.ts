import api from "@/lib/api";
import { userSchema, type User } from "@pixis/schemas";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

export const getMe = createAsyncThunk<User, void, { rejectValue: unknown }>(
  "profile/getMe",
  async function (_, thunkAPI) {
    try {
      const res = await api.get<User>("/auth/me");
      console.log(res.data);
      return res.data;
    } catch (e) {
      if (isAxiosError(e)) {
        return thunkAPI.rejectWithValue({
          status: e.response?.status,
          statusText: e.response?.statusText,
          data: e.response?.data,
        });
      }
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// ================== INITIAL STATE ==================
export interface ProfileState {
  user: User;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
}

export const initialState: ProfileState = {
  user: {
    id: 0,
    username: "",
    nickname: "",
    avatarPublicUrl: "",
    isPrivate: false,
    lastNicknameUpdate: new Date().toISOString(),
    lastUsernameUpdate: new Date().toISOString(),
    point: {
      id: 0,
      currentPoints: 0,
      highestPoints: 0,
      totalPoints: 0,
    },
    streak: {
      id: 0,
      currentStreak: 0,
      highestStreak: 0,
      totalStreak: 0,
      lastActionTimestamp: new Date().toISOString(),
    },
  },
  isFetching: true,
  isError: false,
  error: null,
};

// ================== SLICE ==================
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.user = initialState.user;
      state.isFetching = false;
      state.isError = false;
      state.error = null;
    },
    updateUserState: (state, action: PayloadAction<User>) => {
      console.log(action.payload);
      const { data, error } = userSchema.safeParse(action.payload);
      if (error) {
        return;
      }
      state.user = data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.isFetching = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
        state.isFetching = false;
        state.isError = false;
        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        console.log(action.payload);
        state.isFetching = false;
        state.isError = true;
        state.error = action.payload ?? action.error;
      });
  },
});

export const { resetProfile, updateUserState } = profileSlice.actions;
const profileReducer = profileSlice.reducer;
export default profileReducer;
