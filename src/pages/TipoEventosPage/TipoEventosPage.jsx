import React, { useEffect, useState } from "react";
import Title from "../../components/Titulo/Titulo";
import "./TipoEventosPage.css";
import MainContent from "../../components/Main/MainContent";
import Container from "../../components/Container/Container";
import ImageIlustrator from "../../components/ImageIlustrator/ImageIlustrator";
import tipoEventoImage from "../../assets/images/tipo-evento.svg";
import { Input, Button } from "../../components/FormComponents/FormComponents";
import api, { eventsTypeResource } from "../../Services/Service";
import Table from "./TableTp/TableTp";
import Notification from "../../components/Notification/Notification";
import Spinner from "../../components/Spinner/Spinner"

const TipoEventos = () => {
  const [frmEdit, setFrmEdit] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [idEvento, setIdEvento] = useState(null);
  const [tipoEventos, setTipoEventos] = useState([]);
  const [notifyUser, setNotifyUser] = useState();
  const [showSpinner, setShowSpinner] = useState(false)

  // LISTAR OS TIPOS DE EVENTO
  useEffect(() => {
    async function loadEventsType() {
      setShowSpinner(true)
      setTimeout(() => { console.log("esperando");},2000)
      try {
        const retorno = await api.get(eventsTypeResource);
        setTipoEventos(retorno.data);
      } catch (error) {
        console.log("erro na api");
        console.log(error);
      }
      setShowSpinner(false)
    }
    loadEventsType();
  }, []);

  // TELA DE CADASTRO
  async function handleSubmit(e) {
    e.preventDefault();
    setShowSpinner(true)

    if (titulo.trim().length < 3) {
      setNotifyUser({
        titleNote: "Aviso",
        textNote: `AVISO: O titulo deve conter pelo menos 3 caracteres`,
        imgIcon: "warning",
        imgAlt:
          "Imagem de ilustracao de aviso. Moca a frente do ponto de exclamacao",
        showMessage: true,
      });
    }

    else try {
      await api.post(eventsTypeResource, {
        titulo: titulo,
      });


      const buscaEventos = await api.get(eventsTypeResource);
      setTipoEventos(buscaEventos.data);
      

      setNotifyUser({
        titleNote: "Sucesso",
        textNote: `${titulo} Cadastrado com sucesso`,
        imgIcon: "success",
        imgAlt:
          "Imagem de ilustracao de sucesso. Moca segurando um balao com simbolo de confirmacao ok",
        showMessage: true,
      });

    } catch (error) {
      console.log(error);
      setNotifyUser({
        titleNote: "Erro",
        textNote: `erro no cadastrar ${error}`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustracao de erro. Rapaz segurando um balao com simbolo",
        showMessage: true,
      });
    }
    setShowSpinner(false)
  }

  // TELA DE ATUALIZAR
  async function handleUpdate(e) {
    e.preventDefault();
    setShowSpinner(true)

    try {
      const retorno = await api.put(eventsTypeResource + "/" + idEvento, {
        titulo: titulo,
      });

      if (retorno.status === 204) {
        // setTitulo=("")
        // setIdEvento(null)

        setNotifyUser({
          titleNote: "Sucesso",
          textNote: `Atualizado com sucesso`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustracao de sucesso. Moca segurando um balao com simbolo de confirmacao ok",
          showMessage: true,
        });

        const retorno = await api.get(eventsTypeResource);
        setTitulo(retorno.data.titulo);

        editActionAbort();
      }
    } catch (error) {
      setNotifyUser({
        titleNote: "Erro",
        textNote: `erro no atualizar`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustracao de erro. Rapaz segurando um balao com simbolo",
        showMessage: true,
      });
    }
    setShowSpinner(false)
  }

  // mostra o formulario de edicao
  async function showUpdateForm(idElement) {
    setFrmEdit(true);
    setIdEvento(idElement);
    setShowSpinner(true)
    try {
      const retorno = await api.get(`${eventsTypeResource}/${idElement}`);
      setTitulo(retorno.data.titulo);
      console.log(retorno.data);
    } catch (error) {}
    setShowSpinner(false)
  }

  // cancela a tela/acao de edicao (volta para o form de cadastro)
  function editActionAbort() {
    setFrmEdit(false);
    setTitulo("");
    setIdEvento(null);
  }

  // apaga o tipo de   evento na api
  async function handleDelete(idTipoEvento, titulo) {
    if (window.confirm("Deseja realmente excluir ?")) {
      setShowSpinner(true)
      try {
        const promisse = await api.delete(
          `${eventsTypeResource}/${idTipoEvento}`
        );

        if (promisse.status === 204) {
          const buscaEventos = await api.get(eventsTypeResource);

          setTipoEventos(buscaEventos.data);

          setNotifyUser({
            titleNote: "Sucesso",
            textNote: `${titulo} excluido com sucesso`,
            imgIcon: "success",
            imgAlt:
              "Imagem de ilustracao de sucesso. Moca segurando um balao com simbolo de confirmacao ok",
            showMessage: true,
          });
        }
      } catch (error) {
        console.log("Deu erro ai", error);
      }
      setShowSpinner(false)
    }
  }

  return (
    <>
      {<Notification {...notifyUser} setNotifyUser={setNotifyUser} />}

      {/*se o valor do showSpinner for true exibira o componente Spinner, se for false sera null e nao exibira */}
      {showSpinner ? < Spinner /> : null}

      <MainContent>
        <section className="cadastro-evento-section">
          <Container>
            <div className="cadastro-evento__box">
              <Title titleText={"Cadastro Tipo de Eventos"} />

              <ImageIlustrator imageRender={tipoEventoImage} />

              <form
                className="ftipo-evento"
                onSubmit={frmEdit ? handleUpdate : handleSubmit}
              >
                {!frmEdit ? (
                  // Cadastrar
                  <>
                    <Input
                      id="Titulo"
                      placeholder="Titulo"
                      name={"titulo"}
                      type={"text"}
                      required={"required"}
                      value={titulo}
                      manipulationFunction={(e) => {
                        setTitulo(e.target.value);
                      }}
                    />

                    <Button
                      textButton="Cadastrar"
                      id="Cadastrar"
                      name="Cadastrar"
                      type="submit"
                    />
                  </>
                ) : (
                  //Editar
                  <>
                    <Input
                      id="Titulo"
                      placeholder="Titulo"
                      name={"titulo"}
                      type={"text"}
                      required={"required"}
                      value={titulo}
                      manipulationFunction={(e) => {
                        setTitulo(e.target.value);
                      }}
                    />
                    <div className="buttons-editbox">
                      <Button
                        textButton="Atualizar"
                        id="Atualizar"
                        name="Atualizar"
                        type="submit"
                      />
                      <Button
                        textButton="Cancelar"
                        id="cancelar"
                        name="cancelar"
                        type="submit"
                        manipulationFunction={editActionAbort}
                      />
                    </div>
                  </>
                )}
              </form>
            </div>
          </Container>
        </section>
        <section className="lista-eventos-section">
          <Container>
            <Title titleText={"Lista tipo de eventos"} color="white" />
            <Table
              dados={tipoEventos}
              fnUpdate={showUpdateForm}
              fnDelete={handleDelete}
            />
          </Container>
        </section>
      </MainContent>
    </>
  );
};

export default TipoEventos;
