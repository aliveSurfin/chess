import ViewHelpers from '../ViewHelpers.js'

export default class FooterView {
    constructor() {
        this.createFooterElement()
    }
    createFooterElement() {
        this.footerContainer = ViewHelpers.createElementWithClassName('div', 'footer-container')
            //this.footerContainer.innerText = "Footer"

        let assetCredit = ViewHelpers.createElementWithClassName('div', 'footer-credit-container')
        let assetSpan = ViewHelpers.createElementWithClassName('span', 'footer-credit-span')
        assetSpan.innerText = "Credit to "
        let assetTest = ViewHelpers.createElementWithClassName('a', '')
        assetTest.href = "https://commons.wikimedia.org/wiki/User_talk:Dbenbenn"
        assetTest.innerText = "David Benbennick"
        assetSpan.appendChild(assetTest)
        assetCredit.appendChild(assetSpan)


        let github = ViewHelpers.createElementWithClassName('div', 'footer-github-container')
        github.href = "https://github.com/aliveSurfin"

        this.footerContainer.appendChild(assetCredit)
        this.footerContainer.appendChild(github)
        assetCredit.innerHtml = `Credit to <a href="https://commons.wikimedia.org/wiki/User_talk:Dbenbenn">David Benbennick</a> for <a href="https://commons.wikimedia.org/w/index.php?search=Chess+tile&title=Special:MediaSearch&go=Go&type=image&haslicense=unrestricted&filemime=png"> assets used </a>`

        //
    }

}