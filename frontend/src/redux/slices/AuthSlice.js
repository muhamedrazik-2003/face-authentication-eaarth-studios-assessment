import { createSlice } from "@reduxjs/toolkit";

const baseUrl = "http://localhost:8000/api"

const authSlice = createSlice({
    name: 'authSlice',
    initialState: {
        user: {
            fullName:'',
            email:'',
            password:'',
            photoId:'',
            selfie:''
        },
        isLoading:false,
        error: null,
        showFaceAuthentication:false,
        isAuthenticated:false,
    },
    reducers:{},
    extraReducers: (builder) => {

    }
})

export default authSlice.reducer;