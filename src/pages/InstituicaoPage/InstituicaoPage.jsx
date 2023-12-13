import React, { useEffect, useState } from "react";
import Title from "../../components/Titulo/Titulo";
import "./InstituicaoPage.css";
import MainContent from "../../components/Main/MainContent";
import Container from "../../components/Container/Container";
import ImageIlustrator from "../../components/ImageIlustrator/ImageIlustrator";
import instituicaoImage from "../../assets/images/tipo-evento.svg";
import { Input, Button } from "../../components/FormComponents/FormComponents";
import api, { InstituicaoResource, nextEventsResource } from "../../Services/Service";
import Table from "./TableI/TableI";
import Notification from "../../components/Notification/Notification";
import Spinner from "../../components/Spinner/Spinner";

const InstituicaoPage = () => {
  const [frmEdit, setFrmEdit] = useState(false);
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [idInstituicao, setIdInstituicao] = useState(null);
  const [Instituicoes, setInstituicoes] = useState([]);
  const [notifyUser, setNotifyUser] = useState();
  const [showSpinner, setShowSpinner] = useState(false);

useEffect(() => {
  async function loadInstituicoes() {
    setShowSpinner(true)
    setTimeout(() => { console.log("esperando");},2000)
    try {
      const retorno = await api.get(InstituicaoResource);
      setInstituicoes(retorno.data);
    } catch (error) {
      console.log("erro na api");
      console.log(error);
    }
    setShowSpinner(false)
  }
  loadInstituicoes();
},[])

  async function handleSubmit(e) {
    e.preventDefault();
    setShowSpinner(true)

    if (nome.trim().length < 3) {
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
      await api.post(InstituicaoResource, {
        cnpj: cnpj,
        endereco: endereco,
        nomeFantasia: nome
      });


      const buscaEventos = await api.get(InstituicaoResource);
      setInstituicoes(buscaEventos.data);
      

      setNotifyUser({
        titleNote: "Sucesso",
        textNote: `${nome} Cadastrado com sucesso`,
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
  async function handleUpdate(e) {
    e.preventDefault();
    setShowSpinner(true)

    try {
      const retorno = await api.put(InstituicaoResource + "/" + idInstituicao, {
        cnpj: cnpj,
        endereco: endereco,
        nomeFantasia: nome
      });

      if (retorno.status === 204) {


        setNotifyUser({
          titleNote: "Sucesso",
          textNote: `Atualizado com sucesso`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustracao de sucesso. Moca segurando um balao com simbolo de confirmacao ok",
          showMessage: true,
        });

        const retorno = await api.get(InstituicaoResource);
        setInstituicoes(retorno.data)

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
  async function showUpdateForm(idElement) {
    setFrmEdit(true);
    setIdInstituicao(idElement);
    setShowSpinner(true)
    try {
      const retorno = await api.get(`${InstituicaoResource}/${idElement}`);
      setNome(retorno.data.nomeFantasia);
      setCnpj(retorno.data.cnpj)
      setEndereco(retorno.data.endereco)
    } catch (error) {}
    setShowSpinner(false)
  }
  async function editActionAbort() {
    setFrmEdit(false);
    setNome("");
    setCnpj("")
    setEndereco("")
    setIdInstituicao(null);
  }
  async function handleDelete(idInstituicao, nome) {
    if (window.confirm("Deseja realmente excluir ?")) {
      setShowSpinner(true)
      try {
        const promisse = await api.delete(
          `${InstituicaoResource}/${idInstituicao}`
        );

        if (promisse.status === 204) {
          const buscaEventos = await api.get(InstituicaoResource);

          setInstituicoes(buscaEventos.data);

          setNotifyUser({
            titleNote: "Sucesso",
            textNote: `${nome} excluido com sucesso`,
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

      {showSpinner ? <Spinner /> : null}
      <MainContent>
        <section className="cadastro-evento-section">
          <Container>
            <div className="cadastro-evento__box">
              <Title titleText={"Cadastro de Instituicoes"} />

              <ImageIlustrator imageRender={instituicaoImage} />

              <form
               className="ftipo-evento"
               onSubmit={frmEdit ? handleUpdate : handleSubmit}
               >
              {!frmEdit ? (
                  // Cadastrar
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
                      id="Cnpj"
                      placeholder="Cnpj"
                      name={"cnpj"}
                      type={"number"}
                      required={"required"}
                      value={cnpj}
                      manipulationFunction={(e) => {
                        setCnpj(e.target.value);
                      }}
                    />
                    <Input
                      id="Endereco"
                      placeholder="Endereco"
                      name={"endereco"}
                      type={"text"}
                      required={"required"}
                      value={endereco}
                      manipulationFunction={(e) => {
                        setEndereco(e.target.value);
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
                      value={nome}
                      manipulationFunction={(e) => {
                        setNome(e.target.value);
                      }}
                    />
                    <Input
                      id="Cnpj"
                      placeholder="Cnpj"
                      name={"cnpj"}
                      type={"number"}
                      required={"required"}
                      value={cnpj}
                      manipulationFunction={(e) => {
                        setCnpj(e.target.value);
                      }}
                    />
                    <Input
                      id="Endereco"
                      placeholder="Endereco"
                      name={"endereco"}
                      type={"text"}
                      required={"required"}
                      value={endereco}
                      manipulationFunction={(e) => {
                        setEndereco(e.target.value);
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
            <Title titleText={"Instituicoes"} color="white" />
            <Table
              dados={Instituicoes}
              fnUpdate={showUpdateForm}
              fnDelete={handleDelete}
            />
          </Container>
        </section>
      </MainContent>
    </>
  );
};

export default InstituicaoPage;
