import ViewHelpers from '../ViewHelpers.js'

export default class FooterView {
    constructor() {
        this.createFooterElement()
    }
    createFooterElement() {
        this.footerContainer = ViewHelpers.createElementWithClassName('div', 'footer-container')
        this.footerContainer.innerText = "Footer"
    }

}