import ViewHelpers from "../ViewHelpers.js"
import ChessHelpers from './ChessHelpers.js'
export default class BoardLabelView {
    constructor(labelText) {
        this.text = labelText
        return this.createLabelViewElement()
    }

    createLabelViewElement() {
        let element = ViewHelpers.createElementWithClassName('div', 'board-label-container')
        let span = ViewHelpers.createElementWithClassName('span', 'board-label-span')
        span.innerText = this.text;
        element.appendChild(span)
        return element;
    }
}