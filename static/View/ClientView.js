import GameView from "./game/GameView.js";
import FooterView from "./general/FooterView.js";
import HeaderView from "./general/HeaderView.js";
import LobbyView from "./lobby/LobbyView.js";
import ViewHelpers from "./ViewHelpers.js"

export default class ClientView {

    constructor(gameCallbacks) {
        this.createClientView()

    }

    createClientView() {
        this.clientContainer = ViewHelpers.createElementWithClassName('div', 'client-container')
        this.header = new HeaderView()

        this.clientContainer.appendChild(this.header.headerContainer)

        this.mainContainer = ViewHelpers.createElementWithClassName('div', 'main-container')
        this.clientContainer.appendChild(this.mainContainer)

        this.footer = new FooterView()
        this.clientContainer.appendChild(this.footer.footerContainer)

        document.body.innerHTML = ``
        document.body.appendChild(this.clientContainer)
    }
    playerJoinedSuccessfully(player, lobbyCallbacks, gameCallbacks) {
        this.lobbyCallbacks = lobbyCallbacks
        this.gameCallbacks = gameCallbacks
        console.log(this.mainContainer);

        this.header.addPlayerName(player.name)
        this.lobbyView = new LobbyView(this.lobbyCallbacks.challenge, this.lobbyCallbacks.joinLobby, player, this.mainContainer)
        this.lobbyView.show()

        this.gameView = new GameView(this.mainContainer, this.gameCallbacks)
    }

    gameStarted(gameState) {
        this.gameView.startGame(gameState)
        this.gameView.show()
    }
    updateGame(gameState) {
        this.gameView.startGame(gameState)
    }




}