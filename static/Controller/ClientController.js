import ClientView from "../View/ClientView.js"

export default class ClientController {
    constructor() {
        this.socket = io()
        this.clientView = new ClientView()
        this.joined()
        this.lobbyList()
        this.gameStarted()
        this.gameListeners()
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
                joinExitLobby: (e) => { this.joinExitLobby(e) },
                challenge: (e) => { this.challenge(e) },
                lobbyRequest: () => { this.requestLobbyList() }
            }
            let gameCallbacks = {
                moveFunction: (source, target, promotion) => {
                    this.move(source, target, promotion)
                },
                resign: () => {
                    this.resign()
                },
                offerDraw: () => {
                    this.offerDraw()
                },
                acceptDraw: (result) => {
                    this.acceptDraw(result)
                }


            }
            this.clientView.playerJoinedSuccessfully(player, lobbyCallbacks, gameCallbacks)


        })
    }
    gameListeners() {
        this.socket.on('opponent left', () => {
            console.log(this.clientView);
            this.clientView.gameView.statusView.gameOver("Oponnent Left")
        })
        this.socket.on('opponent resign', () => {
            this.clientView.gameView.statusView.gameOver("Oponnent Resigned")
        })
        this.socket.on('draw offer', () => {
            this.clientView.gameView.statusView.drawOfferReceived('Would you like to accept a draw?')
        })
        this.socket.on('game draw', () => {
            console.log("got draw");
            this.clientView.gameView.statusView.gameOver('Game accepted as draw')
        })
    }
    joinExitLobby(prefs) {
        if (prefs === null) {
            this.socket.emit('exit lobby')
            return
        }
        this.socket.emit('join lobby', prefs)
    }
    challenge(id) {
        console.log("challenge: ", id);
        this.socket.emit('challenge', id)
    }
    requestLobbyList() {
        this.socket.emit('req lobby')
    }
    move(source, target, promotion) {
        this.socket.emit('move', { source: source, target: target, promotion: promotion })
    }
    resign() {
        this.socket.emit('resign')
        setTimeout(() => {
            this.clientView.gameView.statusView.gameOver('You have resigned')
        }, 200);

    }
    offerDraw() {
        this.socket.emit('offer draw')
    }
    acceptDraw(result) {
        this.socket.emit('accept draw', result)
    }





}