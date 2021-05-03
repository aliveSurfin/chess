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
        assetSpan.innerText = "Assets: "
        let assetAnchor = ViewHelpers.createElementWithClassName('a', '')
        assetAnchor.href = "https://commons.wikimedia.org/wiki/User_talk:Dbenbenn"
        assetAnchor.innerText = "David Benbennick"
        assetSpan.appendChild(assetAnchor)
        assetCredit.appendChild(assetSpan)

        let chessCredit = ViewHelpers.createElementWithClassName('div', 'footer-credit-container')
        let chessSpan = ViewHelpers.createElementWithClassName('span', 'footer-credit-span')
        chessSpan.innerText = "Chess Engine: "
        let chessAnchor = ViewHelpers.createElementWithClassName('a', '')
        chessAnchor.href = "https://github.com/jhlywa/chess.js/blob/master/README.md"
        chessAnchor.innerText = "chess.js"
        chessSpan.appendChild(chessAnchor)
        chessCredit.appendChild(chessSpan)

        let nameCredit = ViewHelpers.createElementWithClassName('div', 'footer-credit-container')
        let nameSpan = ViewHelpers.createElementWithClassName('span', 'footer-credit-span')
        nameSpan.innerText = "Name Generation: "
        let nameAnchor = ViewHelpers.createElementWithClassName('a', '')
        nameAnchor.href = "https://www.npmjs.com/package/unique-names-generator"
        nameAnchor.innerText = "unique-names-generator"
        nameSpan.appendChild(nameAnchor)
        nameCredit.appendChild(nameSpan)

        let github = ViewHelpers.createElementWithClassName('div', 'footer-github-container')
        github.onclick = () => { window.open("https://github.com/aliveSurfin", '_blank') }
        let githubImg = ViewHelpers.createElementWithClassName('img', 'footer-github-image')
        githubImg.src = 'static/assets/images/footer/GitHub_Logo_White.png'
        github.appendChild(githubImg)
        this.footerContainer.appendChild(assetCredit)
        this.footerContainer.appendChild(nameCredit)
        this.footerContainer.appendChild(chessCredit)
        this.footerContainer.appendChild(github)
            //
    }

}