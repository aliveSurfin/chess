import ViewHelpers from '../ViewHelpers.js'
import StatusView from './StatusView.js'
import BoardView from './BoardView.js'
export default class GameView {
    constructor(parent, gameCallbacks) {
        this.gameCallbacks = gameCallbacks

        this.parent = parent
        this.createGameElement()
    }
    createGameElement() {
        this.gameContainer = ViewHelpers.createElementWithClassName('div', 'game-container')
        this.statusView = new StatusView()
        this.boardView = new BoardView(this.gameCallbacks.moveFunction)
        this.gameContainer.appendChild(this.boardView.boardContainer)
        this.gameContainer.appendChild(this.statusView.statusContainer)
    }
    show() {
        this.hide()
        this.parent.appendChild(this.gameContainer)
    }
    hide() {
        this.parent.innerHTML = ''
    }
    startGame(gameState) {
        this.boardView.updateGameState(gameState)
        this.statusView.updateStatus(gameState.status)
    }
}