import ClientView from "../View/ClientView.js"

export default class ClientController {
    constructor() {
        this.socket = io()
        this.joined()

        this.socket.emit('new player') // inform server player has joined

    }
    lobbyList() {
        this.socket.on('lobby list', (players) => {
            this.clientView.lobbyView.updateLobbyList(players)

        })
    }
    joined() {
        this.socket.on('joined', (player) => {
            this.player = player
            this.clientView = new ClientView({
                    joinLobby: (e) => { this.joinLobby(e) },
                    challenge: (e) => { this.challenge(e) },
                    playerID: this.player.id
                })
                //TODO: call update player name in client view
            this.lobbyList()

        })
    }

    joinLobby(prefs) {
        this.socket.emit('join lobby', prefs)
    }
    challenge(id) {
        console.log("challenge: ", id);
    }



}