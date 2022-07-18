import React from 'react';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
//Диспатч нужен, чтобы отправить асинхронный экшен
import {useDispatch, useSelector} from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useEffect } from 'react';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';



export const Home = () => {
  const dispatch = useDispatch();
  const {posts, tags} = useSelector(state => state.posts);

  const isPostsLoading = posts.status === 'Loading';
  const isTagsLoading = tags.status === 'Loading';
  //Запрос на бэк для получения статей
  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchTags())
  }, []);

  
  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>

          {/* Очень важная штука! */}
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) => isPostsLoading ? (
            <Post key={index} isLoading={true} />
          ):(
            <Post
              _id={obj._id}
              title={obj.title}
              imageUrl={obj.imageURL}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isEditable
            />
          ))}
        </Grid>
        <Grid xs={4} item>
          {isTagsLoading ? <TagsBlock items={['react', 'typescript', 'заметки']} isLoading={true} /> 
          : <TagsBlock items={tags.items} isLoading={false} />}
          
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
