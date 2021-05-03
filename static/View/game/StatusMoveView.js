import ViewHelpers from "../ViewHelpers.js";
const pieceDir = `/static/assets/images/pieces/`
export default class StatusMoveView {
    constructor(moveData) {
        return this.createMoveElement(moveData)
    }

    createMoveElement(moveData) {
        let isCapture = 'captured' in moveData
        let move = ViewHelpers.createElementWithClassName('div', 'status-move-list-move')

        let fromContainer = ViewHelpers.createElementWithClassName('div', 'status-move-list-move-container')
        let pieceName = ViewHelpers.createElementWithClassName('span', 'status-move-list-move-label')
        pieceName.innerText = moveData.from
        let fromPiece = ViewHelpers.createElementWithClassName('img', 'status-piece')
        fromPiece.src = pieceDir + `${moveData.color}_${moveData.piece}.png`
        fromContainer.appendChild(fromPiece)
        fromContainer.appendChild(pieceName)


        move.appendChild(fromContainer)
        let descClass = isCapture ? "takes" : "moves"
        let desc = ViewHelpers.createElementWithClassName('span', `status-move-list-move-description ${descClass}`)
        desc.innerText = isCapture ? "\u274C" : "\u2192"
        move.appendChild(desc)


        let toContainer = ViewHelpers.createElementWithClassName('div', 'status-move-list-move-container')
        if (isCapture) {
            let toPiece = ViewHelpers.createElementWithClassName('img', 'status-piece')
            toPiece.src = pieceDir + `${moveData.color=="b" ? "w" : "b"}_${moveData.captured}.png`
            toContainer.appendChild(toPiece)
        }
        let toName = ViewHelpers.createElementWithClassName('span', 'status-move-list-move-label')
        toName.innerText = moveData.to
        toContainer.appendChild(toName)


        move.appendChild(toContainer)

        return move

    }
}