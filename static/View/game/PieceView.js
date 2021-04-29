import ViewHelpers from "../ViewHelpers.js";
const pieceDir = `/static/assets/images/pieces/`
export default class PieceView {

    constructor(pieceData, coord, isPlayerMoveFunction, selectionCallbacks) {
        this.state = pieceData
        this.coord = coord
        this.selectionCallbacks = selectionCallbacks
        this.createPieceElement(isPlayerMoveFunction)
    }
    createPieceElement(isPlayerMoveFunction) {
        this.element = ViewHelpers.createElementWithClassName('img', 'piece')
        this.element.src = `${pieceDir}${this.state.color}_${this.state.type}.png`
        this.element.draggable = false
        if (isPlayerMoveFunction()) {
            this.element.draggable = true
            this.element.ondragstart = (ev) => {
                this.selectionCallbacks.selectionUnHighlighting()
                this.selectionCallbacks.selectionUpdate(null)
                ev.dataTransfer.setData("text", JSON.stringify({
                    y: this.coord.y,
                    x: this.coord.x,
                    piece: this.element.src
                }))
                this.element.style.opacity = 0.5
                this.selectionCallbacks.selectionUpdate({
                    y: this.coord.y,
                    x: this.coord.x,
                    piece: this.element.src
                })
                this.selectionCallbacks.selectionHighlighting()

            }
            this.element.ondragend = (ev) => {
                this.element.style.opacity = 1
                this.selectionCallbacks.selectionUnHighlighting()
                this.selectionCallbacks.selectionUpdate(null)
            }
        }

    }
}