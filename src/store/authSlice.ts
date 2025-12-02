import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, Tokens } from '@/src/types';
import axiosInstance, { tokenManager } from '../lib/axios';

const initialState: AuthState = {
  user: null,
  tokens: null,
  mobile: '',
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (mobile: string, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('mobile', mobile);

      const response = await axiosInstance.post('/auth/send-otp', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ mobile, otp }: { mobile: string; otp: string }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('mobile', mobile);
      formData.append('otp', otp);

      const response = await axiosInstance.post('/auth/verify-otp', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);

export const createProfile = createAsyncThunk(
  'auth/createProfile',
  async (
    {
      mobile,
      name,
      email,
      qualification,
      profile_image,
    }: {
      mobile: string;
      name: string;
      email: string;
      qualification: string;
      profile_image: File;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('mobile', mobile);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('qualification', qualification);
      formData.append('profile_image', profile_image);

      const response = await axiosInstance.post('/auth/create-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMobile: (state, action: PayloadAction<string>) => {
      state.mobile = action.payload;
    },
    setTokens: (state, action: PayloadAction<Tokens>) => {
      state.tokens = action.payload;
      state.isAuthenticated = true;
      tokenManager.setTokens(action.payload.access_token, action.payload.refresh_token);
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.mobile = '';
      tokenManager.clearTokens();
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const accessToken = tokenManager.getAccessToken();
      const refreshToken = tokenManager.getRefreshToken();
      
      if (accessToken && refreshToken) {
        state.tokens = {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: 'Bearer',
        };
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.login && action.payload.access_token) {
          state.tokens = {
            access_token: action.payload.access_token,
            refresh_token: action.payload.refresh_token,
            token_type: action.payload.token_type,
          };
          state.isAuthenticated = true;
          tokenManager.setTokens(
            action.payload.access_token,
            action.payload.refresh_token
          );
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = {
          access_token: action.payload.access_token,
          refresh_token: action.payload.refresh_token,
          token_type: 'Bearer',
        };
        state.isAuthenticated = true;
        tokenManager.setTokens(
          action.payload.access_token,
          action.payload.refresh_token
        );
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMobile, setTokens, setUser, logout, clearError, initializeAuth } =
  authSlice.actions;

export default authSlice.reducer;