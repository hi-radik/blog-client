import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import axios from "../../axios";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useState, useRef } from "react";

export const AddPost = () => {
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          console.log(data);
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(','));
        })
        .catch((err) => {
          console.warn(err);
          alert("Ошибка при обновлении статьи!");
        });
    }
  }, []);
  //Чтобы загрузить картинку
  //Нужен useRef
  const inputImageRef = useRef(null);
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const isEditing = Boolean(id);

  //Изменилось ли что-то в инпуте картинки?
  const handleChangeFile = async (event) => {
    console.log(event.target.files);
    try {
      //ФормДата - позволяет вшивать картинку и отправлять на бэк
      const formData = new FormData();
      //Картинку вытаскиваем из files по 0 индексу
      const file = event.target.files[0];
      //Вшиваем картинку в FormData
      formData.append("image", file);
      //Отправь на бэк formData
      //И скажи, шо там в ответ пришло
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);

      //Теперь нужно передать все эти штуки на бэк
    } catch (err) {
      console.log(err);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl(null);
  };

  //Use callback используем для SMDE editor
  const onChange = React.useCallback((text) => {
    setText(text);
  }, []);

  //Функция для отправки полей на сервак
  const onSubmit = async () => {
    try {
      console.log(tags)
      setIsLoading(true);
      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };
      if (!isEditing) {

        const { data } = await axios.post("/posts", fields);
        
        //Когда создаем статью, нужно понять
        //Вернулся ли нам id или нет
        //И если статья создана - нужно перевести пользователя внутрь статьи
        //Достали id из data
        const _id = data._id;
        //Перекидываемся на пост:id
        setIsLoading(false);
        navigate(`/posts/${_id}`);
      }
      else{
        const { data } = await axios.patch(`/posts/${id}`, fields);
        //Когда создаем статью, нужно понять
        //Вернулся ли нам id или нет
        //И если статья создана - нужно перевести пользователя внутрь статьи
        //Достали id из data
        //Перекидываемся на пост:id
        setIsLoading(false);
        navigate(`/`);
      }
    } catch (err) {
      console.warn(err);
      alert("Ошибка при создании статьи");
    }
  };

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (isAuth) {
    return (
      <Paper style={{ padding: 30 }}>
        {/* После того, как сделали ссылку, говорим: */}
        {/* Когда кликаем на кнопку - кликай на input */}
        <Button
          onClick={() => inputImageRef.current.click()}
          variant="outlined"
          size="large"
        >
          Загрузить превью
        </Button>
        {/* Сделали ссылки на скрытый input */}
        <input
          ref={inputImageRef}
          type="file"
          onChange={handleChangeFile}
          hidden
        />
        {imageUrl && (
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
            style={{ marginLeft: "10px" }}
          >
            Удалить
          </Button>
        )}
        {/* Если есть картинка рисует кнопку удалить картинку */}
        {imageUrl && (
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        )}
        <br />
        <br />
        <TextField
          classes={{ root: styles.title }}
          variant="standard"
          placeholder="Заголовок статьи..."
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          classes={{ root: styles.tags }}
          variant="standard"
          placeholder="Тэги"
          value={tags}
          fullWidth
          onChange={(e) => setTags(e.target.value)}
        />
        <SimpleMDE
          className={styles.editor}
          value={text}
          onChange={onChange}
          options={options}
        />
        <div className={styles.buttons}>
          <Button onClick={onSubmit} size="large" variant="contained">
            {isEditing ? "Сохранить изменения" : "Опубликовать"}
          </Button>
          <a href="/">
            <Button size="large">Отмена</Button>
          </a>
        </div>
      </Paper>
    );
  }
  return !window.localStorage.getItem("token") && <Navigate to="/" />;
};
