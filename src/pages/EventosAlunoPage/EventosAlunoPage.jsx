import React, { useContext, useEffect, useState } from "react";
import MainContent from "../../components/Main/MainContent";
import Title from "../../components/Titulo/Titulo";
import Table from "./TableEvA/TableEvA";
import Container from "../../components/Container/Container";
import { Select } from "../../components/FormComponents/FormComponents";
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/Modal";
import api, {
  eventsResource,
  myEventsResource,
  presencesEventResource,
  myComentaryEventResource,
  comentaryEventResource,
} from "../../Services/Service";
import Notification from "../../components/Notification/Notification";

import "./EventosAlunoPage.css";

// Contexto
import { UserContext } from "../../context/AuthContext";

const EventosAlunoPage = () => {
  // Estados
  const [exibeNavbar, setExibeNavbar] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [quaisEventos, setQuaisEventos] = useState([
    { value: 1, text: "Todos os eventos" },
    { value: 2, text: "Meus eventos" },
  ]);
  const [tipoEvento, setTipoEvento] = useState(""); // Código do tipo do Evento escolhido
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notifyUser, setNotifyUser] = useState({});

  // Recupera os dados globais do usuário
  const { userData, setUserData } = useContext(UserContext);
  const [idEvento, setIdEvento] = useState();
  const [idComentario,setIdComentario] = useState()
  const [comentario, setComentario] = useState("");

  // UseEffect para carregar os eventos baseado no tipo selecionado
  useEffect(() => {
    loadEventsType();
  }, [tipoEvento, userData.userId]);

  // Função para carregar os tipos de eventos ao montar a página
  async function loadEventsType() {
    setEventos([]);
    if (tipoEvento === "1") {
      try {
        const returnAllEvents = await api.get(eventsResource);

        const returnEvents = await api.get(
          `${myEventsResource}/${userData.userId}`
        );

        const markedEvents = verifyPresence(
          returnAllEvents.data,
          returnEvents.data
        );
        setEventos(markedEvents);

      } catch (error) {
        notifyError("Erro na API ");
      }
    } else if (tipoEvento === "2") {
      try {
        const returnEvents = await api.get(
          `${myEventsResource}/${userData.userId}`
        );
        console.clear();
 
        // Verifique a estrutura dos dados retornados para acessar corretamente os eventos
        const arrEvents = [];

        returnEvents.data.forEach((e) => {
          arrEvents.push({
            ...e.evento,
            situacao: e.situacao,
            idPresencaEvento: e.idPresencaEvento,
          });
        });
        setEventos(arrEvents);
      } catch (error) {
        notifyError("Erro na API");
      }
    } else {
      setEventos([]);
    }
  }

  // Função para verificar a presença de eventos do usuário em todos os eventos
  const verifyPresence = (arrAllEvents, eventsUser) => {
    // Itera sobre todos os eventos em arrAllEvents
    for (let x = 0; x < arrAllEvents.length; x++) {
      // Itera sobre todos os eventos em eventsUser
      for (let i = 0; i < eventsUser.length; i++) {
        // Verifica se o ID do evento em arrAllEvents é igual ao ID do evento em eventsUser
        if (arrAllEvents[x].idEvento === eventsUser[i].evento.idEvento) {
          // Se os IDs forem iguais, atualiza a situação do evento em arrAllEvents com a situação do evento em eventsUser
          arrAllEvents[x].situacao = true;
          arrAllEvents[x].idPresencaEvento = eventsUser[i].idPresencaEvento;
          break;
        }
      }
    }
    // Retorna todos os eventos Marcado com a presenca do Usuario
    return arrAllEvents;
  };

  // Função para alternar entre "Meus Eventos" e "Todos os Eventos"
  function myEvents(tpEvent) {
    setTipoEvento(tpEvent);
  }

  // Função para exibir ou esconder o modal
  const showHideModal = (idEvent) => {
    setShowModal(showModal ? false : true);

    setUserData({ ...userData, idEvento: idEvent });
  };

  // Função para carregar o comentário do usuário
  const loadMyCommentary = async (idUsuario, idEvento) => {
    const promise = await api.get(
      `${myComentaryEventResource}?idUser=${idUsuario}&idEvent=${idEvento}`
    );
    setComentario(promise.data.descricao);
    setIdComentario(promise.data.idComentarioEvento)
  };

  const postMyCommentary = async (descricao, idUsuario, idEvento) => {
    console.clear();

    try {
      const promise = await api.post(comentaryEventResource, {
        descricao: descricao,
        exibe: true,
        idUsuario: idUsuario,
        idEvento: idEvento,
      });

      if (promise.status === 201) {
        const promise = await api.get(
          `${myComentaryEventResource}?idUser=${idUsuario}&idEvent=${idEvento}`
        );

        setComentario(promise.data.descricao);
        notifySuccess("Comentario cadastrado!")
      }
    } catch (error) {
      notifyError(error)
    }
  };

  // Função para remover o comentário
  const commentaryRemove = async () => {
    try {
      const request = await api.delete(`${comentaryEventResource}/${idComentario}`)

      setComentario("")
      notifySuccess("Comentario Deletado!")

  } catch (error) {
    notifyError(error)
  }
  };

  // Função para conectar evento
  async function handleConnect(
    idEvent,
    whatTheFunction,
    idPresencaEvento = null,

  ) {
    // conecta o usuário e atualiza a tela
    if (whatTheFunction === "connect") {
      try {
        const promise = await api.post(presencesEventResource, {
          situacao: true,
          idUsuario: userData.userId,
          idEvento: idEvent
        });

        if (promise.status === 201) {
          loadEventsType();
          notifySuccess(`Presença Confirmada!`)
        }
      } catch (error) {
        notifyError(error)
      }
      return;
    }
    try {
      setComentario([])
      const unconnected = await api.delete(`${presencesEventResource}/${idPresencaEvento}`)

      if (unconnected.status === 204) {
        loadEventsType()
        notifySuccess("Desconectado com sucesso!")
      }
    } catch (error) {
      notifyError(error)
    }
  }

  const notifySuccess = (textNote) => {
    setNotifyUser({
      titleNote: "Sucesso",
      textNote,
      imgIcon: "success",
      imgAlt:
        "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
      showMessage: true,
    });
  };

  const notifyError = (textNote) => {
    setNotifyUser({
      titleNote: "Erro",
      textNote,
      imgIcon: "danger",
      imgAlt:
        "Imagem de ilustração de erro. Homem segurando um balão com símbolo de X.",
      showMessage: true,
    });
  };

  const notifyWarning = (textNote) => {
    setNotifyUser({
      titleNote: "Aviso",
      textNote,
      imgIcon: "warning",
      imgAlt:
        "Imagem de ilustração de aviso. Mulher em frente a um grande ponto de exclamação.",
      showMessage: true,
    });
  };

  return (
    <>
      {<Notification {...notifyUser} setNotifyUser={setNotifyUser} />}
      <MainContent>
        <Container>
          <Title titleText={"Eventos"} className="custom-title" />

          {/* Select para escolha entre "Meus Eventos" e "Todos os Eventos" */}
          <Select
            id="id-tipo-evento"
            name="tipo-evento"
            required={true}
            options={quaisEventos} // aqui o array dos tipos
            manipulationFunction={(e) => myEvents(e.target.value)} // aqui só a variável state
            defaultValue={tipoEvento}
            addtionalClass="select-tp-evento"
            title="Tipo Evento"
          />
          {/* Tabela de eventos */}
          <Table
            dados={eventos}
            fnConnect={handleConnect}
            fnShowModal={showHideModal}
          />
        </Container>
      </MainContent>

      {/* SPINNER - Feito com position */}
      {showSpinner ? <Spinner /> : null}

      {/* Modal para remoção de comentário */}
      {showModal ? (
        <Modal
          // userId={userData.userId}
          showHideModal={showHideModal}
          fnGet={loadMyCommentary}
          fnPost={postMyCommentary}
          fnDelete={commentaryRemove}
          comentaryText={comentario}
        />
      ) : null}
    </>
  );
};

export default EventosAlunoPage;
