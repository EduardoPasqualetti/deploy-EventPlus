import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import EventosPage from "../pages/EventosPage/EventosPage";
import HomePage from "../pages/HomePage/HomePage";
import TipoEventos from "../pages/TipoEventosPage/TipoEventosPage";
import Login from "../pages/LoginPage/LoginPage";
import EventosAlunoPage from "../pages/EventosAlunoPage/EventosAlunoPage"
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import InstituicaoPage from "../pages/InstituicaoPage/InstituicaoPage";
import { PrivateRoute } from "./PrivateRoute";

const Rotas = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route element={<HomePage />} path={"/"} exact />

        <Route
          path={"/tipo-eventos"}
          element={
            <PrivateRoute redirectTo="/">
              <TipoEventos />
            </PrivateRoute>
          }
        />

        <Route
          path="/eventos"
          element={
            <PrivateRoute redirectTo="/">
              <EventosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/eventosAluno"
          element={
            <PrivateRoute redirectTo="/">
              <EventosAlunoPage />
            </PrivateRoute>
          }
        />

        <Route element={<InstituicaoPage />} path={"/instituicoes"} />
        
        <Route element={<Login />} path={"/login"} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default Rotas;
