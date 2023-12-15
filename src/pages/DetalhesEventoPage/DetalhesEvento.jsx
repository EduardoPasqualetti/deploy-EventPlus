import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, {
  comentaryEventResource,
  eventsResource,
  myComentaryEventResource,
} from "../../Services/Service";
import Main from "../../components/Main/MainContent";
import Container from "../../components/Container/Container";
import Titulo from "../../components/Titulo/Titulo";
import { dateFormatDbToView } from "../../Utils/stringFunctions";
import { UserContext } from "../../context/AuthContext";

const DetalhesEvento = () => {
  const [evento, setEvento] = useState([]);
  const [comentario, setComentario] = useState([]);
  const { idEvento } = useParams();
  const { userData } = useContext(UserContext);

  useEffect(() => {
    getEvent();
    getCommentaries();
  }, []);

  async function getEvent() {
    try {
      const promisse = await api.get(`${eventsResource}/${idEvento}`);
      setEvento(promisse.data);
      console.log(promisse.data);
    } catch (error) {
      console.log("erro api");
    }
  }

  async function getCommentaries() {
    try {
      if (userData.role === "Administrador") {
        const prom = await api.get(comentaryEventResource);
        setComentario(prom.data);
      }
      const prom = await api.get(`${comentaryEventResource}/IA`);
      setComentario(prom.data);
    } catch (error) {
      console.log("erro na api");
    }
  }

  return (
    <Main>
      <section className="detalhes-evento-main">
        <Container>
          <Titulo
            titleText={"Eventos Anteriores"}
            additionalClass="custom-title"
            color=""
          />
          <div>
            <h2>Nome do evento: {evento.nomeEvento}</h2>
            <h2>Descricao do evento: {evento.descricao}</h2>
            <h2>
              Data do Evento: {new Date(evento.dataEvento).toLocaleDateString()}
            </h2>
          </div>
        </Container>
      </section>
      <section>
        <Container>
          <Titulo
            titleText={"Comentarios do Evento"}
            additionalClass="custom-title"
            color=""
          />
        </Container>
      </section>
    </Main>
  );
};

export default DetalhesEvento;
