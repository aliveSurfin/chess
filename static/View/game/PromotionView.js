import ViewHelpers from "../ViewHelpers.js"

const pieceDir = `/static/assets/images/pieces/`

export default class PromotionView {
    constructor(colour) {
        this.colour = colour
        this.createPromotionView()
    }

    createPromotionView() {
        this.promotionContainer = ViewHelpers.createElementWithClassName('div', 'promotion-container')
        let promotionRowContainer = ViewHelpers.createElementWithClassName('div', 'promotion-row-container')
        this.promotionContainer.onclick = () => {

        }
        let possible = ['q', 'n', 'b', 'r']
        this.pieces = possible.map((piece) => {
            let element = ViewHelpers.createElementWithClassName('img', 'promotion-piece')
            element.src = pieceDir + this.colour[0] + "_" + piece + ".png"
            element.value = piece
            promotionRowContainer.appendChild(element)
            return element

        })
        this.promotionContainer.value = false;
        let info = ViewHelpers.createElementWithClassName('span', 'promotion-label')
        info.innerText = "Choose a piece or click anywhere else to cancel."

        this.promotionContainer.appendChild(promotionRowContainer)
        this.promotionContainer.appendChild(info)
    }
    hide() {
        console.log("hiding");
        this.promotionContainer.style.display = "none"
    }
    show() {
        this.promotionContainer.style.display = "flex"
    }
    attatchListeners(listener) {
        console.log(this.pieces);
        this.pieces.forEach((piece) => {
            piece.onclick = listener
        })
        this.promotionContainer.onclick = listener
    }
}