import ClientView from "../View/ClientView.js"
import GameView from "../View/game/GameView.js"

export default class ClientController {
    constructor() {
        this.socket = io()
        this.clientView = new ClientView()
        this.joined()
        this.lobbyList()
        this.gameStarted()
        this.socket.emit('new player') // inform server player has joined
    }
    gameStarted() {
        this.socket.on('game started', (gameState) => {
            console.log("game started");
            this.clientView.gameStarted(gameState)
        })
        this.socket.on('updated board', (gameState) => {
            this.clientView.updateGame(gameState)
        })
    }
    lobbyList() {
        this.socket.on('lobby list', (players) => {
            if (this.clientView.lobbyView) {
                this.clientView.lobbyView.updateLobbyList(players)
                return
            }
        })
    }
    joined() {
        this.socket.on('joined', (player) => {
            console.log("joined");
            this.player = player
            let lobbyCallbacks = {
                joinLobby: (e) => { this.joinLobby(e) },
                challenge: (e) => { this.challenge(e) },
            }
            let gameCallbacks = {
                moveFunction: (source, target, promotion) => {
                    this.move(source, target, promotion)
                }
            }
            this.clientView.playerJoinedSuccessfully(player, lobbyCallbacks, gameCallbacks)
                //TODO: call update player name in client view


        })
    }

    joinLobby(prefs) {
        this.socket.emit('join lobby', prefs)
    }
    challenge(id) {
        console.log("challenge: ", id);
    }
    move(source, target, promotion) {
        console.log("move hit");
        this.socket.emit('move', { source: source, target: target, promotion: promotion })
    }



}