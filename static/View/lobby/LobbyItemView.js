import ViewHelpers from '../ViewHelpers.js'
console.log(ViewHelpers);
export default class LobbyItemView {
    constructor(LobbyModel, challengeCallback, playerID) {
        console.log(LobbyModel);
        this.id = LobbyModel.id
        this.name = LobbyModel.name
        this.prefs = LobbyModel.prefs
        return this.createLobbyItemElement(challengeCallback, playerID)
    }

    createLobbyItemElement(callback, playerID) {
        let element = ViewHelpers.createElementWithClassName('div', 'lobby-item')

        let name = ViewHelpers.createElementWithClassName('div', 'lobby-name')
        name.innerText = this.name

        let prefs = ViewHelpers.createElementWithClassName('div', `lobby-prefs ${this.prefs.colour}`)


        let challengeButton = ViewHelpers.createElementWithClassName('div', 'lobby-challenge')
        challengeButton.innerText = "Challenge"
        challengeButton.onclick = () => { callback(this.id) }


        element.appendChild(name)
        element.appendChild(prefs)
        if (this.id !== playerID) {
            element.appendChild(challengeButton)
        } else {
            this.element.classList.add('own')
        }
        return element



    }
}