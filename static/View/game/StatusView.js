import ViewHelpers from '../ViewHelpers.js'
import ConfirmView from './ConfirmView.js'
import StatusMoveView from './StatusMoveView.js'

export default class StatusView {
    constructor(callbacks) {
        this.resign = callbacks.resign
        this.offerDraw = callbacks.offerDraw
        this.acceptDraw = callbacks.acceptDraw
        this.switchToLobby = callbacks.switchToLobby
        this.createStatusElement()
    }
    async createStatusElement() {
        this.statusContainer = ViewHelpers.createElementWithClassName('div', 'status-container')
        this.title = ViewHelpers.createElementWithClassName('span', 'status-title')
        this.title.innerText = "Status"

        this.description = ViewHelpers.createElementWithClassName('div', 'status-description')
        this.opponentName = ViewHelpers.createElementWithClassName('span', 'status-player-name')

        this.moveList = ViewHelpers.createElementWithClassName('div', 'status-move-list')
        this.statusContainer.appendChild(this.opponentName)
        this.statusContainer.appendChild(this.title)

        this.statusContainer.appendChild(this.description)
        this.statusContainer.appendChild(this.moveList)

        let resignDrawContainer = ViewHelpers.createElementWithClassName('div', 'status-resign-draw-container')

        this.resignButton = ViewHelpers.createElementWithClassName('div', 'status-resign-button')
        this.resignButton.innerText = "Resign"
        this.resignButton.onclick = async() => {
            let result = null
            await this.resignListener().then((e) => {
                result = e.target.value
            })
            if (result == "Yes") {
                this.resign()
            }
        }

        this.drawButton = ViewHelpers.createElementWithClassName('div', 'status-draw-button')
        this.drawButton.innerText = "Offer Draw"
        this.drawButton.onclick = async() => {
            let result = null
            await this.drawListener().then((e) => {
                result = e.target.value
            })
            if (result == "Yes") {
                this.offerDraw()
            }
        }

        resignDrawContainer.appendChild(this.resignButton)
        resignDrawContainer.appendChild(this.drawButton)
        this.statusContainer.appendChild(resignDrawContainer)

        this.confimView = new ConfirmView()
        this.statusContainer.appendChild(this.confimView.confirmContainer)
    }
    updateStatus(gameState) {
        this.state = gameState
        this.opponentName.innerText = gameState.opponentName

        this.updateDescription(gameState)
        this.updateMoveList(gameState.moveHistory)
    }
    updateDescription(gameState) {
        ViewHelpers.removeChildren(this.description)
        if (gameState.inCheckmate) {
            let state = (gameState.playerColour == gameState.curColour ? "Defeat" : "Victory")
            let checkmate = ViewHelpers.createElementWithClassName('span', `status-checkmate ${state}`)

            checkmate.innerText = "Checkmate " + state
            this.description.appendChild(checkmate)
        } else if (gameState.inDraw) {
            let draw = ViewHelpers.createElementWithClassName('span', 'status-draw')
            draw.innerText = "Draw"
            this.description.appendChild(draw)
        } else {
            let move = ViewHelpers.createElementWithClassName('span', 'status-move')
            move.innerText = (gameState.playerColour == gameState.curColour ? "Move a piece by dragging or clicking" : "Wait for opponent to move")
            if (gameState.inCheck) {
                move.innerText += (gameState.playerColour == gameState.curColour ? "\nMove your king out of check" : "\nOpponent in Check")
            }

            this.description.appendChild(move)

        }
    }
    updateMoveList(moveHistory) {
        ViewHelpers.removeChildren(this.moveList)
        moveHistory.forEach(element => {
            this.moveList.appendChild(new StatusMoveView(element))

        });
        this.moveList.scrollTop = this.moveList.scrollHeight;
    }

    async resignListener() {
        this.confimView.show()
        let that = this
        return new Promise(function(resolve, reject) {
            var listener = event => {
                resolve(event);
                that.confimView.hide()
            };
            that.confimView.attatchListeners(listener, "Are you sure you want to resign?")
        });
    }
    async drawListener() {
        this.confimView.show()
        let that = this
        return new Promise(function(resolve, reject) {
            var listener = event => {
                resolve(event);
                that.confimView.hide()
            };
            that.confimView.attatchListeners(listener, "Are you sure you want to offer a draw?")
        });
    }
    async drawOfferReceived(reason) {
        let result = null
        await this.drawAcceptListener(reason).then((e) => {
            result = e.target.value
        })
        if (result == "Yes") {
            this.acceptDraw(true)

        } else {
            this.acceptDraw(false)
        }
    }
    async drawAcceptListener() {
        this.confimView.show()
        let that = this
        return new Promise(function(resolve, reject) {
            var listener = event => {
                resolve(event);
                that.confimView.hide()
            };
            that.confimView.attatchListeners(listener, "Would you like to accept a draw?")
        });
    }
    async gameOver(reason) {
        let result = null
        await this.restartListener(reason).then((e) => {
            result = e.target.value
        })
        if (result == "Yes") {
            this.switchToLobby(this.state.playerColour || "any")
        } else {
            this.switchToLobby()
        }
    }
    async restartListener(reason) {
        this.confimView.show()
        let that = this
        return new Promise(function(resolve, reject) {
            var listener = event => {
                resolve(event);
                that.confimView.hide()
            };
            that.confimView.attatchListeners(listener, reason + "\nPlay Again?")
        });
    }
}