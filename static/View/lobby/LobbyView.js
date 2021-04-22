import LobbyItemView from './LobbyItemView.js'
import LobbyJoinView from './LobbyJoinView.js'
import ViewHelpers from '../ViewHelpers.js'

export default class LobbyView {
    constructor(challengeCallback,joinCallback,playerID) {

        
        this.playerID = playerID
        this.challengeCallback = challengeCallback
        
        this.joinCallback = joinCallback
        this.createLobbyElement()
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
        for (let player in lobbyList){
            let element = lobbyList[player]
            this.lobbyList.appendChild(new LobbyItemView(element,this.challengeCallback,this.playerID))
        }
        
    }
}