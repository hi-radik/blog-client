import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../../axios';

export const fetchUserData = createAsyncThunk('auth/fetchUser', async (params) => {
    const {data} = await axios.post('/auth/login', params)
    return data
})

const initialState = {
    data: null,
    status: 'Loading',

}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers:{
        [fetchUserData.pending]:(state) => {
            state.status = 'Loading';
            state.data = null;
        },

        [fetchUserData.fulfilled]:(state, action) => {
            state.status = 'Loaded';
            state.data = action.payload;
        },
        [fetchUserData.rejected]:(state) => {
            state.status = 'Error';
            state.data = null;
        },
    }
})

export const selectIsAuth = state => Boolean(state.auth.data)
export const authReducer = authSlice.reducer;

