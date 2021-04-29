import ViewHelpers from '../ViewHelpers.js'

export default class StatusView {
    constructor() {
        this.createStatusElement()
    }
    createStatusElement() {
        this.statusContainer = ViewHelpers.createElementWithClassName('fieldset', 'status-container')
        this.title = ViewHelpers.createElementWithClassName('legend', 'status-title')
        this.title.innerText = "Status"

        this.description = ViewHelpers.createElementWithClassName('div', 'status-description')
        this.description.innerText = `desc`

        this.moveList = ViewHelpers.createElementWithClassName('div', 'move-list')

        this.statusContainer.appendChild(this.title)
        this.statusContainer.appendChild(this.description)
        this.statusContainer.appendChild(this.moveList)
    }
    updateStatus(status) {
        this.description.innerText = status;
    }
}