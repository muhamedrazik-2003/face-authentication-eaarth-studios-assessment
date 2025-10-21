import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosConfig } from "../../utils/utils";

const handleError = (error, defaultMessage) => ({
  message: error.response?.data?.message || defaultMessage,
});

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosConfig.post(`/register`, userData);
      return data;
    } catch (error) {
      return rejectWithValue(handleError(error, "Face Authentication failed"));
    }
  }
);

export const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosConfig.post(`/verify-user`, userData);
      return data;
    } catch (error) {
      return rejectWithValue(handleError(error, "Failed to verify user"));
    }
  }
);

export const loginUsingFaceAuth = createAsyncThunk(
  "auth/loginUsingFaceAuth",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosConfig.post(`/login-face-auth`, userData);
      return data;
    } catch (error) {
      return rejectWithValue(handleError(error, "Face Authentication failed"));
    }
  }
);

export const changeAccountStatus = createAsyncThunk(
  "auth/changeAccountStatus",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosConfig.patch(`/user/status`, userData);
      return data;
    } catch (error) {
      return rejectWithValue(handleError(error, "Failed to change status"));
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "auth/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosConfig.get(`/user/all`);
      console.log("all Users", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        handleError(error, "Failed to Retrieve all users")
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {
      fullName: "",
      email: "",
      password: "",
      status: "",
    },
    allUsers: [],
    isLoading: false,
    error: null,
    isRegistering: false,
    showFaceAuthentication: false,
    isAuthenticated: false,
    isUserVerified: false,
  },
  reducers: {
    updateUser: (state, action) => {
      const { field, value } = action.payload;
      state.user[field] = value;
    },
    clearError: (state) => {
      state.error = null;
    },
    setIsRegistering: (state, action) => {
      state.isRegistering = action.payload;
    },
  },
  extraReducers: (builder) => {
    const setPending = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    const setRejected = (state, action, defaultMessage) => {
      state.isLoading = false;
      state.error = action.payload?.message || defaultMessage;
    };

    builder
      // Register user
      .addCase(registerUser.pending, (state) => {
        setPending(state);
        state.isAuthenticated = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isUserVerified = true;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        setRejected(state, action, "Failed to register user");
        state.isAuthenticated = false;
      })

      // Verify user
      .addCase(verifyUser.pending, setPending)
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.user.email = action.payload.userEmail;
        state.isLoading = false;
        state.isUserVerified = true;
        state.error = null;
      })
      .addCase(verifyUser.rejected, (state, action) =>
        setRejected(state, action, "Failed to verify user")
      )

      // Login using face auth

      .addCase(loginUsingFaceAuth.pending, (state) => {
        setPending(state);
        state.isAuthenticated = false;
      })

      .addCase(loginUsingFaceAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.user.photoId = "";
        state.user.selfie = "";
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUsingFaceAuth.rejected, (state, action) => {
        setRejected(state, action, "Failed to verify user");
        state.isAuthenticated = false;
      })

      //   Change user account status
      .addCase(changeAccountStatus.pending, setPending)
      .addCase(changeAccountStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        state.allUsers = state.allUsers.map((user) => {
          if (user._id === action.payload.user._id) {
            return { ...user, status: action.payload.user.status };
          }
          return user;
        });

        state.message =
          action.payload?.message || "Status updated successfully";
      })
      .addCase(changeAccountStatus.rejected, (state, action) =>
        setRejected(state, action, "Failed to change account status")
      )

      //   get All Users
      .addCase(getAllUsers.pending, setPending)
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.allUsers = action.payload?.allUsers;
        state.message =
          action.payload?.message || "All Users retrieved successfully";
      })
      .addCase(getAllUsers.rejected, (state, action) =>
        setRejected(state, action, "Failed to retrieve all users")
      );
  },
});

export const { updateUser, clearError, setIsRegistering } = authSlice.actions;
export default authSlice.reducer;
