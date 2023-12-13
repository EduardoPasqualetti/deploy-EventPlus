import React, { useContext, useState } from "react";
import ImageIllustrator from "../../components/ImageIlustrator/ImageIlustrator";
import logo from "../../assets/images/logo-pink.svg";
import { Input, Button } from "../../components/FormComponents/FormComponents";
import loginImage from "../../assets/images/login.svg";
import api from "../../Services/Service";
import {loginResource} from "../../Services/Service";
import { UserContext, userDecodeToken } from "../../context/AuthContext"; 
import {useNavigate} from "react-router-dom"

import "./LoginPage.css"

const LoginPage = () => {
  const [user, setUser] = useState({email: "comum@comum", senha: "comum"})
  const { userData, setUserData } = useContext(UserContext)
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (user.email.length >= 3 && user.senha.length >= 3) {
        try {
            const promisse = await api.post(loginResource, {
                email: user.email,
                senha: user.senha
            })

            const userFullToken = userDecodeToken(promisse.data.token)
            setUserData(userFullToken);

            localStorage.setItem("token", JSON.stringify(userFullToken))
            navigate("/")
            console.log(userFullToken);
        } catch (error) {
            alert("Verifique os dados e a conexao com a internet")
            console.log("erro nos dados de login");
            console.log(error);
        }
    } else {
        alert("Preencha os dados corretamente")
    }

  }


  return (
    <div className="layout-grid-login">
      <div className="login">
        <div className="login__illustration">
          <div className="login__illustration-rotate"></div>
          <ImageIllustrator
            imageRender={loginImage}
            altText="Imagem de um homem em frente de uma porta de entrada"
            additionalClass="login-illustrator"
          />
        </div>

        <div className="frm-login">
          <img src={logo} className="frm-login__logo" alt="" />

          <form className="frm-login__formbox" onSubmit={handleSubmit}>
            <Input
              className="frm-login__entry"
              type="email"
              id="login"
              name="login"
              required={true}
              value={user.email}
              onChange={(e) => {}}
              manipulationFunction={(e) => {setUser({...user, email: e.target.value.trim()})}}
              placeholder="Email"
            />
            <Input
              additionalClass="frm-login__entry"
              type="password"
              id="senha"
              name="senha"
              required={true}
              value={user.senha}
              manipulationFunction={(e) => {setUser({...user, senha: e.target.value.trim()})}}
              placeholder="****"
            />

            <a href="" className="frm-login__link">
              Esqueceu a senha?
            </a>

            <Button
              textButton="Login"
              id="btn-login"
              name="btn-login"
              type="submit"
              additionalClass="frm-login__button"
              onClick={()=>{}}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
