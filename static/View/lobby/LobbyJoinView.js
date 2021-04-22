import ViewHelpers from '../ViewHelpers.js'
console.log(ViewHelpers);
export default class LobbyJoinView {
    constructor(joinCallback) {
        return this.createLobbyJoinElement(joinCallback)
    }

    createLobbyJoinElement(callback) {
        let element = ViewHelpers.createElementWithClassName('div', 'lobby-join-container')
        let values = ['any', 'white', 'black']

        let select = ViewHelpers.createElementWithClassName('select', 'lobby-join-prefs-select')
        values.forEach((e) => {
            let option = ViewHelpers.createElementWithClassName('option', `lobby-join-prefs-option ${e}`)
            option.innerText = e
            option.value = e
            select.appendChild(option)
        })

        let joinButton = ViewHelpers.createElementWithClassName('div', 'lobby-join-button')
        joinButton.innerText = "Join"
        joinButton.onclick = () => { callback(select.value) }


        element.appendChild(select)
        element.appendChild(joinButton)


        return element



    }
}