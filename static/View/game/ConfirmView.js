import ViewHelpers from "../ViewHelpers.js"

export default class ConfirmView {
    constructor() {

        this.createConfirmView()
    }

    createConfirmView() {
        this.confirmContainer = ViewHelpers.createElementWithClassName('div', 'confirm-container')
        let confirmRowContainer = ViewHelpers.createElementWithClassName('div', 'confirm-row-container')
        this.confirmContainer.onclick = () => {

        }
        let possible = ['Yes', 'No']
        this.pieces = possible.map((piece) => {
            let element = ViewHelpers.createElementWithClassName('span', 'confirm-piece')
            element.value = piece
            element.innerText = piece
            confirmRowContainer.appendChild(element)
            return element

        })
        this.confirmContainer.value = "No";
        this.info = ViewHelpers.createElementWithClassName('span', 'confirm-label')

        this.confirmContainer.appendChild(confirmRowContainer)
        this.confirmContainer.appendChild(this.info)
    }
    hide() {
        console.log("hiding");
        this.confirmContainer.style.display = "none"
    }
    show() {
        this.confirmContainer.style.display = "flex"
    }
    attatchListeners(listener, question) {
        this.info.innerText = question
        console.log(this.pieces);
        this.pieces.forEach((piece) => {
            piece.onclick = listener
        })
        this.confirmContainer.onclick = listener
    }
}