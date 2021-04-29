import LobbyItemView from './LobbyItemView.js'
import LobbyJoinView from './LobbyJoinView.js'
import ViewHelpers from '../ViewHelpers.js'

export default class LobbyView {
    constructor(challengeCallback, joinCallback, player, parent) {


        this.player = player
        this.challengeCallback = challengeCallback
        this.parent = parent
        this.joinCallback = joinCallback
        console.log(parent);
        this.createLobbyElement()
    }
    show() {
        this.hide()
        this.parent.appendChild(this.lobbyContainer)
    }
    hide() {
        this.parent.innerHTML = ''
    }
    createLobbyElement() {
        this.lobbyContainer = ViewHelpers.createElementWithClassName('div', 'lobby-container')


        let lobbyListContainer = ViewHelpers.createElementWithClassName('div', 'lobby-list-container')
        this.lobbyList = document.createElement('div', 'lobby-list')
        lobbyListContainer.appendChild(this.lobbyList)

        let joinLobbyContainer = new LobbyJoinView(this.joinCallback)

        this.lobbyContainer.appendChild(lobbyListContainer)

        this.lobbyContainer.appendChild(joinLobbyContainer)
    }
    updateLobbyList(lobbyList) {
        console.log(lobbyList);
        this.lobbyList.innerHTML = ``
            //TODO: add empty case
        for (let lobbyPlayer in lobbyList) {
            let element = lobbyList[lobbyPlayer]
            this.lobbyList.appendChild(new LobbyItemView(element, this.challengeCallback, this.player.id))
        }

    }
}