import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from '../../axios';

//Создадим асинхронный экшен для постов
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ()=>{

    //Нужно вытащить data из axios запроса
    const {data} = await axios.get('/posts');
    return data

})

//Создадим асинхронный экшен для тегов
export const fetchTags = createAsyncThunk('posts/fetchTags', async ()=>{

    //Нужно вытащить data из axios запроса
    const {data} = await axios.get('/tags');
    return data

})
const initialState = {

    posts: {
        items: [],
        status: 'loading',
    },

    tags: {
        items: [],
        status: 'loading',
    }

}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    //Чтобы отловить состояние запроса
    extraReducers: {
        //Отлавливаем ожидание
        [fetchPosts.pending]: (state) => {
            state.posts.status = 'Loading';
        },
        //Отлавливаем завершение
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'Loaded';
        },
        //Отлавливаем загрузку
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },
        //Отлавливаем ожидание
        [fetchTags.pending]: (state) => {
            state.tags.status = 'Loading';
        },
        //Отлавливаем завершение
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'Loaded';
        },
        //Отлавливаем загрузку
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },

    },
})


export const postsReducer = postsSlice.reducer;