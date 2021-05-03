import LobbyItemView from './LobbyItemView.js'
import LobbyJoinView from './LobbyJoinView.js'
import ViewHelpers from '../ViewHelpers.js'

export default class LobbyView {
    constructor(lobbyRequest, challengeCallback, joinExitCallback, player, parent) {

        console.log(joinExitCallback);
        this.player = player
        this.challengeCallback = challengeCallback
        this.parent = parent
        this.joinExitCallback = joinExitCallback
        this.lobbyRequest = lobbyRequest
        console.log(parent);
        this.createLobbyElement()
    }
    show(prefs) {

        this.hide()
        this.createLobbyElement()
        this.lobbyRequest()
        this.parent.appendChild(this.lobbyContainer)
        if (prefs !== undefined) {
            this.joinExitCallback(prefs)
        }
    }
    hide() {
        this.parent.innerHTML = ''
    }
    createLobbyElement() {
        this.lobbyContainer = ViewHelpers.createElementWithClassName('div', 'lobby-container')


        let lobbyListContainer = ViewHelpers.createElementWithClassName('div', 'lobby-list-container')
        this.lobbyList = document.createElement('div', 'lobby-list')
        lobbyListContainer.appendChild(this.lobbyList)
        this.joinLobby = new LobbyJoinView(this.joinExitCallback)
        let joinLobbyContainer = this.joinLobby.element

        this.lobbyContainer.appendChild(lobbyListContainer)

        this.lobbyContainer.appendChild(joinLobbyContainer)
    }
    updateLobbyList(lobbyList) {
        console.log(lobbyList);
        this.lobbyList.innerHTML = ``
            //TODO: add empty case
        if (!Object.entries(lobbyList).length) {
            this.lobbyList.innerText = `No players in lobby...`
        } else {
            let legendContainer = ViewHelpers.createElementWithClassName('div', 'lobby-list-legend-container')
            let nameLabel = ViewHelpers.createElementWithClassName('span', 'lobby-list-legend-name')
            nameLabel.innerText = `Name`
            let colourLabel = ViewHelpers.createElementWithClassName('span', 'lobby-list-legend-colour')
            colourLabel.innerText = "Colour"
            legendContainer.appendChild(nameLabel)
            legendContainer.appendChild(colourLabel)
            this.lobbyList.appendChild(legendContainer)
        }
        for (let lobbyPlayer in lobbyList) {
            let element = lobbyList[lobbyPlayer]
            this.lobbyList.appendChild(new LobbyItemView(element, this.challengeCallback, this.player.id))
        }
        console.log();


    }
}