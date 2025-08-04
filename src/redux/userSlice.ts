import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserState = Record<string, any>;

const defaultState: UserState = {};

export const persistUser = createAsyncThunk<void, UserState>(
  'user/persistUser',
  async (data) => {
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify(data));
    } catch (e) {
      console.warn('Persist user failed:', e);
    }
  }
);

export const retrieveUser = createAsyncThunk<UserState>(
  'user/retrieveUser',
  async () => {
    try {
      const raw = await AsyncStorage.getItem('currentUser');
      return raw ? JSON.parse(raw) : defaultState;
    } catch (e) {
      console.warn('Retrieve user failed:', e);
      return defaultState;
    }
  }
);

const slice = createSlice({
  name: 'user',
  initialState: defaultState,
  reducers: {
    assignUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    modifyUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return defaultState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(retrieveUser.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
  },
});

export const { assignUser, modifyUser, clearUser } = slice.actions;
export { retrieveUser as loadUserData };
export default slice.reducer;
