import React, { useEffect, useState } from "react";
import "./HomePage.css";
import Banner from "../../components/Banner/Banner";
import MainContent from "../../components/Main/MainContent";
import VisionSection from "../../components/VisionSection/VisionSection";
import ContactSection from "../../components/ContactSection/ContactSection";
import NextEvent from "../../components/NextEvent/NextEvent";
import PastEvent from "../../components/PastEvent/PastEvents"
import Container from "../../components/Container/Container";
import Titulo from "../../components/Titulo/Titulo";
import api from "../../Services/Service";
import { nextEventsResource, LastEventsResource } from "../../Services/Service";
import Notification from "../../components/Notification/Notification";

const HomePage = () => {

  const [notifyUser, setNotifyUser] = useState();
  const [nextEvents, setNextEvents] = useState([]);
  const [lastEvents, setLastEvents] = useState([])
  
  useEffect(() => {
    async function getNextEvents() {
      try {
        const promisse = await api.get(nextEventsResource);
        const dados = await promisse.data;

        setNextEvents(dados);

        const retorno = await api.get(LastEventsResource)
        setLastEvents(retorno.data)
      } catch (error) {
        setNotifyUser({
          titleNote: "Erro",
          textNote: `Nao foi possivel carregar os proximos eventos`,
          imgIcon: "danger",
          imgAlt:
            "Imagem de ilustracao de erro. Rapaz segurando um balao com simbolo",
          showMessage: true,
        });
      }
    }
    getNextEvents();
  }, []);

  return (
    <div>
      {<Notification {...notifyUser} setNotifyUser={setNotifyUser} />}
      <MainContent>
        <Banner />

        <section className="proximos-eventos">
          <Container>
            <Titulo titleText={"Proximos Eventos"} />
            <div className="events-box">
              {nextEvents.map((e) => {
                return (
                  <NextEvent
                    key={e.idEvento}
                    title={e.nomeEvento}
                    description={e.descricao}
                    eventDate={e.dataEvento}
                    idEvento={e.idEvento}
                  />
                );
              })}
            </div>
            <Titulo titleText={"Eventos Passados"} />
            <div className="events-box">
              {lastEvents.map((e) => {
                return (
                  <PastEvent
                    key={e.idEvento}
                    title={e.nomeEvento}
                    description={e.descricao}
                    eventDate={e.dataEvento}
                    idEvento={e.idEvento}
                  />
                );
              })}
            </div>
          </Container>
        </section>

        <VisionSection />
        <ContactSection />
      </MainContent>
    </div>
  );
};

export default HomePage;
