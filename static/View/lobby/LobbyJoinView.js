import ViewHelpers from '../ViewHelpers.js'
console.log(ViewHelpers);
export default class LobbyJoinView {
    constructor(joinCallback) {
        return this.createLobbyJoinElement(joinCallback)
    }

    createLobbyJoinElement(callback) {
        let element = ViewHelpers.createElementWithClassName('div', 'lobby-join-container')
        let values = ['any', 'white', 'black']
        this.valueElements = []
        this.selected = 'any'
        let select = ViewHelpers.createElementWithClassName('div', 'lobby-join-prefs-container')
        values.forEach((e) => {
            let option = ViewHelpers.createElementWithClassName('div', `lobby-join-prefs-option ${e}`)
            if (e == this.selected) {
                option.classList.add('selected')
            }
            let span = ViewHelpers.createElementWithClassName('span', 'lobby-join-prefs-option-label')
            span.innerText = e
            option.appendChild(span)
            option.value = e
            option.onclick = () => {
                this.selected = e
                this.valueElements.forEach((element) => {
                    element.classList.remove('selected')
                    if (element.value == e) {
                        element.classList.add('selected')
                    }
                })
            }
            select.appendChild(option)
            this.valueElements.push(option)
        })

        let joinButton = ViewHelpers.createElementWithClassName('div', 'lobby-join-button')
        joinButton.innerText = "Join"
        joinButton.onclick = () => { callback(this.selected) }


        element.appendChild(select)
        element.appendChild(joinButton)


        return element



    }
}