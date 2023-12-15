import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { eventsResource } from '../../Services/Service';
import Main from '../../components/Main/MainContent';
import Container from '../../components/Container/Container';
import Titulo from '../../components/Titulo/Titulo';

const DetalhesEvento = () => {


    const [evento, setEvento] = useState([])
    const { idEvento } = useParams()

    useEffect(() => {
        getEvent()
    },[])

    async function getEvent() {
        try {
            const promisse = await api.get(`${eventsResource}/${idEvento}`)
            setEvento(promisse.data)
            console.log(promisse.data);
        } catch (error) {
            console.log("erro api");
        }
    }

    return (
        <Main>
            <Container>
                <Titulo
                 titleText={"Eventos Anteriores"}
                 additionalClass="custom-title"
                 color=""
                />
                <div>
                    <p>{evento.nomeEvento}</p>
                </div>
            </Container>
        </Main>
    );
};

export default DetalhesEvento;