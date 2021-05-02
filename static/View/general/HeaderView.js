import ViewHelpers from '../ViewHelpers.js'

export default class HeaderView {
    constructor() {
        this.createHeaderElement()
    }
    createHeaderElement() {
        this.headerContainer = ViewHelpers.createElementWithClassName('div', 'header-container')
        this.headerContainer.innerText = "Socket Chess"
        this.playerName = ViewHelpers.createElementWithClassName('div', 'header-player-name')
        this.headerContainer.appendChild(this.playerName)
    }
    addPlayerName(playerName) {
        this.playerName.innerText = playerName + ``
    }
}