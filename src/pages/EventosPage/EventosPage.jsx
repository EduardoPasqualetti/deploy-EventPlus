import React, { useEffect, useState } from "react";
import Titulo from "../../components/Titulo/Titulo";
import "./EventosPage.css";
import eventoImage from "../../assets/images/evento.svg";
import MainContent from "../../components/Main/MainContent";
import Container from "../../components/Container/Container";
import ImageIlustrator from "../../components/ImageIlustrator/ImageIlustrator";
import {
  Input,
  Button,
  Select,
} from "../../components/FormComponents/FormComponents";
import api, {
  InstituicaoResource,
  eventsResource,
  eventsTypeResource
} from "../../Services/Service";
import Notification from "../../components/Notification/Notification";
import Table from "./TableE/TableE";
import Spinner from "../../components/Spinner/Spinner"

const EventosPage = () => {
  const [notifyUser, setNotifyUser] = useState();
  const [showSpinner, setShowSpinner] = useState(false)

  const [frmEdit, setFrmEdit] = useState(false);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");

  const [eventos, setEventos] = useState([]);
  const [idEvento, setIdEvento] = useState(null);

  const [idTipoEvento, setIdTipoEvento] = useState(null);
  const [tipoEvento, setTipoEvento] = useState([]);

  const [idInstituicao, setIdInstituicao] = useState(null)
  const [instituicoes, setInstituicoes] = useState([])

  useEffect(() => {
    async function loadEvents() {
      setShowSpinner(true)
      try {
       updateApi();
      } catch (error) {
        setNotifyUser({
          titleNote: "Erro",
          textNote: "Erro na operação. Verifique a conexão com a internet.",
          imgIcon: "danger",
          imgAlt:
            "Imagem de ilustração de erro. Rapaz segurando um balao com simbolo x.",
          showMessage: true,
        });
      }
      setShowSpinner(false)
    }
    loadEvents();
  }, []);

  useEffect(() => {
    async function loadEventsType() {
      setShowSpinner(true)
      try {
        const retorno = await api.get(eventsTypeResource);
        setTipoEvento(retorno.data)
      } catch (error) {
        setNotifyUser({
          titleNote: "Erro",
          textNote: "Erro na operação. Verifique a conexão com a internet.",
          imgIcon: "danger",
          imgAlt:
            "Imagem de ilustração de erro. Rapaz segurando um balao com simbolo x.",
          showMessage: true,
        });
      }
      setShowSpinner(false)
    }
      loadEventsType();
  },[])

  useEffect(() => {
    async function loadInstituicoes() {
      setShowSpinner(true)
      try {
        const promisse = await api.get(InstituicaoResource);
        setInstituicoes(promisse.data)
      } catch (error) {
        setNotifyUser({
          titleNote: "Erro",
          textNote: "Erro na operação. Verifique a conexão com a internet.",
          imgIcon: "danger",
          imgAlt:
            "Imagem de ilustração de erro. Rapaz segurando um balao com simbolo x.",
          showMessage: true,
        });
      }
      setShowSpinner(false)
    }
    loadInstituicoes()
  },[])

  function dePara(retornoApi) {
    let arrayOptions = [];
    retornoApi.forEach((e) => {
      arrayOptions.push({ value: e.idTipoEvento, text: e.titulo });
    });
    return arrayOptions;
  }
  function deParaI(retornoApi) {
    let arrayOptions = [];
    retornoApi.forEach((e) => {
      arrayOptions.push({ value: e.idInstituicao, text: e.nomeFantasia });
    });
    return arrayOptions;
  }


  async function updateApi() {
    const buscaEventos = await api.get(eventsResource);
    setEventos(buscaEventos.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setShowSpinner(true)

    try {
      await api.post(eventsResource, {
        nomeEvento: nome,
        dataEvento: data,
        descricao: descricao,
        idTipoEvento: idTipoEvento,
        idInstituicao: idInstituicao
      });
      setNome("");
      setDescricao("");
      setData("");
      setTipoEvento([])
      setInstituicoes([])


      updateApi();

      setNotifyUser({
        titleNote: "Sucesso",
        textNote: `Evento ${nome} Cadastrado com sucesso`,
        imgIcon: "success",
        imgAlt:
          "Imagem de ilustracao de sucesso. Moca segurando um balao com simbolo de confirmacao ok",
        showMessage: true,
      });
    } catch (error) {
      setNotifyUser({
        titleNote: "Erro",
        textNote: `erro ao tentar cadastrar`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustracao de erro. Rapaz segurando um balao com simbolo",
        showMessage: true,
      });
    }
    setShowSpinner(false)
  }
  async function handleUpdate(e) {
    e.preventDefault();
    setShowSpinner(true)

    try {
      const retorno = await api.put(eventsResource + "/" + idEvento, {
        nomeEvento: nome,
        dataEvento: data,
        descricao: descricao,
        idTipoEvento: idTipoEvento,
        idInstituicao: idInstituicao
      });

      if (retorno.status === 204) {
        setNotifyUser({
          titleNote: "Sucesso",
          textNote: `Evento ${nome} Atualizado com sucesso`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustracao de sucesso. Moca segurando um balao com simbolo de confirmacao ok",
          showMessage: true,
        });

        updateApi();

        editActionAbort();
      }
    } catch (error) {
      console.log(error);
      setNotifyUser({
        titleNote: "Erro",
        textNote: `erro ao tentar atualizar`,
        imgIcon: "danger",
        imgAlt:
          "Imagem de ilustracao de erro. Rapaz segurando um balao com simbolo",
        showMessage: true,
      });
    }
    setShowSpinner(false)
  }

  async function handleDelete(idEvento, nome) {
    setShowSpinner(true)
    if (window.confirm("Deseja realmente excluir ?")) {
      try {
        const promisse = await api.delete(`${eventsResource}/${idEvento}`);
        if (promisse.status === 204) {
          updateApi();

          setNotifyUser({
            titleNote: "Sucesso",
            textNote: `Evento ${nome} excluido com sucesso`,
            imgIcon: "success",
            imgAlt:
              "Imagem de ilustracao de sucesso. Moca segurando um balao com simbolo de confirmacao ok",
            showMessage: true,
          });
        }
      } catch (error) {
        console.log(error);
      }
    } 
    setShowSpinner(false)
  }

  async function showUpdateForm(idElement) {
    setFrmEdit(true);
    setIdEvento(idElement);
    setShowSpinner(true)

    try {
      const retorno = await api.get(`${eventsResource}/${idElement}`);
      setNome(retorno.data.nomeEvento);
      setDescricao(retorno.data.descricao);
      setData(retorno.data.dataEvento.slice(0,10));
      setIdTipoEvento(retorno.data.idTipoEvento)
      // setIdInstituicao(retorno.data.idInstituicao)
    } catch (error) {}
    setShowSpinner(false)
  }

  async function editActionAbort() {
    setFrmEdit(false);
    setNome("");
    setDescricao("");
    setData("");
  }


  return (
    <div>
      {<Notification {...notifyUser} setNotifyUser={setNotifyUser} />}
      {showSpinner ? < Spinner /> : null}
      <MainContent>
        <section className="cadastro-evento-section">
          <Container>
            <div className="cadastro-evento__box">
              <Titulo titleText={"Cadastro de Eventos"} className="margem_acima" />
              <ImageIlustrator imageRender={eventoImage} />
              <form
                className="ftipo-evento"
                onSubmit={frmEdit ? handleUpdate : handleSubmit}
              >
                {!frmEdit ? (
                  <>
                    <Input
                      id="Nome"
                      placeholder="Nome"
                      name={"nome"}
                      type={"text"}
                      required={"required"}
                      value={nome}
                      manipulationFunction={(e) => {
                        setNome(e.target.value);
                      }}
                    />
                    <Input
                      id="Descricao"
                      placeholder="Descricao"
                      name={"descricao"}
                      type={"text"}
                      required={"required"}
                      value={descricao}
                      manipulationFunction={(e) => {
                        setDescricao(e.target.value);
                      }}
                    />
                    <Select
                      id="TipoEvento"
                      name={"tipoEvento"}
                      required={"required"}
                      title={"Tipos de Evento"}
                      value={idTipoEvento}
                      options={dePara(tipoEvento)}
                      manipulationFunction={(e) => {
                        setIdTipoEvento(e.target.value);
                      }}
                    />
                    <Select
                      id="Instituicao"
                      name={"instituicao"}
                      required={"required"}
                      title={"Instituicoes"}
                      value={idInstituicao}
                      options={deParaI(instituicoes)}
                      manipulationFunction={(e) => {
                        setIdInstituicao(e.target.value);
                      }}
                    />
                    <Input
                      id="Data"
                      placeholder="Data"
                      name={"data"}
                      type={"Date"}
                      required={"required"}
                      value={data}
                      manipulationFunction={(e) => {
                        setData(e.target.value);
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
                  <>
                    <Input
                      id="Nome"
                      placeholder="Nome"
                      name={"nome"}
                      type={"text"}
                      required={"required"}
                      value={nome}
                      manipulationFunction={(e) => {
                        setNome(e.target.value);
                      }}
                    />
                    <Input
                      id="Descricao"
                      placeholder="Descricao"
                      name={"descricao"}
                      type={"text"}
                      required={"required"}
                      value={descricao}
                      manipulationFunction={(e) => {
                        setDescricao(e.target.value);
                      }}
                    />
                    <Select
                      id="TipoEvento"
                      name={"tipoEvento"}
                      required={"required"}
                      title={"Tipos de Evento"}
                      options={dePara(tipoEvento)}
                      value={idTipoEvento}
                      manipulationFunction={(e) => {
                        setIdTipoEvento(e.target.value);
                      }}
                    />
                    <Select
                      id="Instituicoes"
                      name={"instituicoes"}
                      required={"required"}
                      title={"Instituicoes"}
                      options={deParaI(instituicoes)}
                      value={idInstituicao}
                      manipulationFunction={(e) => {
                        setIdInstituicao(e.target.value);
                      }}
                    />
                    <Input
                      id="Data"
                      placeholder="Data"
                      name={"data"}
                      type={"Date"}
                      required={"required"}
                      value={data}
                      manipulationFunction={(e) => {
                        setData(e.target.value);
                      }}
                    />

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
                  </>
                )}
              </form>
            </div>
          </Container>
        </section>
        <section className="lista-eventos-section">
          <Container>
            <Titulo
              titleText={"Lista dos Eventos"}
              className="margem_acima"
              color="white"
            />
            <Table
              dados={eventos}
              fnDelete={handleDelete}
              fnUpdate={showUpdateForm}
            />
          </Container>
        </section>
      </MainContent>
    </div>
  );
};

export default EventosPage;
