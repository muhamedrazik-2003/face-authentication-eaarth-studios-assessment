import { configureStore } from "@reduxjs/toolkit";
import authSlice from './slices/AuthSlice';

const store = configureStore({
    reducer:{
        authSlice
    }
})

export default store;