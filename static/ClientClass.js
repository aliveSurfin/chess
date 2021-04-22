import LobbyView from "./View/lobby/LobbyView.js";



export default class Client {
    constructor() {
        let l = new LobbyView((e) => { console.log(`chal ${e}`); }, (e) => { console.log(`join ${e}`); })
        document.body.appendChild(l.lobbyContainer)
    }
}