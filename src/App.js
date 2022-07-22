import Container from "@mui/material/Container";
import React, { Component } from "react";
import { Header } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { fetchAuthMe } from "./redux/slices/auth";
function App() {
  //Это нужно, чтобы оставаться в аккаунте при переходах по страницам
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAuthMe())
  }, [])
  return (
    <>
    
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/posts/:id" element={<FullPost />}/>
          <Route path="/posts/:id/edit" element={<AddPost />}/>
          <Route path="/add-post" element={<AddPost />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Registration />}/>
        </Routes>
      </Container>
    </>
  );
}

export default App;
