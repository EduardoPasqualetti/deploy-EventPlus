import axios from 'axios'

/** 
* Route for Events
*/
export const eventsResource = '/Evento'

/** 
* Route for my Presences Event
*/
export const myEventsResource = '/PresencasEvento/ListarMinhas';

/** 
* Route for Presences Event
*/
export const presencesEventResource = '/PresencasEvento'

export const comentaryEventResource = "/ComentariosEvento"

export const myComentaryEventResource = "/ComentariosEvento/BuscarPorIdUsuario"

/** 
* Route for the Next Events
*/
export const nextEventsResource = 'Evento/ListarProximos'

export const LastEventsResource = 'Evento/ListarAntigos'

/** 
* Route for Type of Event
*/
export const eventsTypeResource = '/TiposEvento'

/** 
* Route for Login
*/
export const loginResource = '/Login'

export const InstituicaoResource = '/Instituicao'


// const apiPort = '5000'
// const localApiUrl = `http://localhost:${apiPort}/api`
const externaApiUrl = "https://eventwebapi-eduardop.azurewebsites.net/api"

const api = axios.create({
    baseURL: externaApiUrl
})

export default api;