import {postsReducer} from './slices/posts'
import {authReducer} from './slices/auth'
import {configureStore} from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
    }
})

export default store