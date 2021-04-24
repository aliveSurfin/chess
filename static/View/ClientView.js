import LobbyView from "./lobby/LobbyView.js";

export default class ClientView {

    constructor(lobbyCallbacks) {
        this.lobbyView = new LobbyView(lobbyCallbacks.challenge, lobbyCallbacks.joinLobby)
        document.body.appendChild(this.lobbyView.lobbyContainer)
    }

}