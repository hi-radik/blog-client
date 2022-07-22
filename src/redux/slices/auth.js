import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../../axios';

export const fetchUserData = createAsyncThunk('auth/fetchUser', async (params) => {
    const {data} = await axios.post('/auth/login', params)
    return data
})

export const fetchAuthMe = createAsyncThunk('auth/fetchMe', async () => {
    const {data} = await axios.get('/auth/me')
    return data
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const {data} = await axios.post('/auth/register', params)
    return data
})

const initialState = {
    data: null,
    status: 'Loading',

}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout: (state)=>{
            state.data = null;
        }
    },
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
        [fetchAuthMe.pending]:(state) => {
            state.status = 'Loading';
            state.data = null;
        },

        [fetchAuthMe.fulfilled]:(state, action) => {
            state.status = 'Loaded';
            state.data = action.payload;
        },
        [fetchAuthMe.rejected]:(state) => {
            state.status = 'Error';
            state.data = null;
        },
        [fetchRegister.pending]:(state) => {
            state.status = 'Loading';
            state.data = null;
        },

        [fetchRegister.fulfilled]:(state, action) => {
            state.status = 'Loaded';
            state.data = action.payload;
        },
        [fetchRegister.rejected]:(state) => {
            state.status = 'Error';
            state.data = null;
        },
    }
})

export const selectIsAuth = state => Boolean(state.auth.data)
export const authReducer = authSlice.reducer;
export const {logout} = authSlice.actions;
