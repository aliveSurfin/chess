import ViewHelpers from '../ViewHelpers.js'
console.log(ViewHelpers);
export default class LobbyJoinView {
    constructor(joinExitCallback) {
        console.log(joinExitCallback);
        this.createLobbyJoinElement(joinExitCallback)
    }

    createLobbyJoinElement(joinExitCallback) {
        this.element = ViewHelpers.createElementWithClassName('div', 'lobby-join-container')
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

        let joinExitButton = ViewHelpers.createElementWithClassName('div', 'lobby-join-exit-button')
        joinExitButton.innerText = "Join Lobby"
        console.log(joinExitCallback);
        this.joinFunc = () => {
            joinExitCallback(this.selected)
            joinExitButton.innerText = "Leave Lobby"
            joinExitButton.onclick = this.exitFunc
        }
        this.exitFunc = () => {
            joinExitCallback(null)
            joinExitButton.innerText = "Join Lobby"
            joinExitButton.onclick = this.joinFunc
        }
        joinExitButton.onclick = this.joinFunc



        this.element.appendChild(select)
        this.element.appendChild(joinExitButton)
    }
}