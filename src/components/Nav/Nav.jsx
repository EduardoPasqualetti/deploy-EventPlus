import React, { useContext } from "react";

import logoMobile from "../../assets/images/logo-white.svg"; // Importa a imagem do logotipo para telas móveis
import logoDesktop from "../../assets/images/logo-pink.svg"; // Importa a imagem do logotipo para telas de desktop
import { Link } from "react-router-dom"; // Importa o componente Link do react-router-dom

import "./Nav.css"; // Importa o arquivo de estilos CSS para o componente Nav
import { UserContext } from "../../context/AuthContext";

const Nav = ({ exibeNavbar, setExibeNavbar }) => {
  const { userData } = useContext(UserContext);

  return (
    <nav className={`navbar ${exibeNavbar ? "exibeNavbar" : ""}`}>
      <span
        className="navbar__close"
        onClick={() => {
          setExibeNavbar(false);
        }}
      >
        x
      </span>

      <Link to="/" className="eventlogo">
        <img
          className="eventlogo__logo-image"
          src={window.innerWidth >= 992 ? logoDesktop : logoMobile}
          alt="Event Plus Logo"
        />
      </Link>

      <div className="navbar__items-box">
        <Link to="/" className="navbar__item">
          Home
        </Link>

        {userData.nome && userData.role === "Administrador" ? (
          <>
            <Link className="navbar__item" to="/tipo-eventos">
              Tipos de Evento
            </Link>
            <Link className="navbar__item" to="/eventos">
              Eventos
            </Link>
            <Link className="navbar__item" to="/instituicoes">
              Instituicoes
            </Link>
          </>
        ) : userData.nome && userData.role === "Comum" ? (
          <Link className="navbar__item" to="/eventosAluno">
            Eventos Aluno
          </Link>
        ) : null}

        
      </div>
    </nav>
  );
};

export default Nav; // Exporta o componente Nav para uso em outros lugares da aplicação
