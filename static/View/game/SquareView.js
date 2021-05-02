import ViewHelpers from '../ViewHelpers.js'
import PieceView from './PieceView.js';

export default class SquareView {
    constructor(squareData, isPlayerMoveFunction, moveFunction, selectionCallbacks) {
        this.isPlayerMoveFunction = isPlayerMoveFunction
        this.state = squareData
        this.moveFunction = moveFunction
        this.selectionCallbacks = selectionCallbacks
        this.createSquareElement()
            // console.log(this.state);
            // console.log(this.squareContainer);
    }
    createSquareElement() {
        this.squareContainer = ViewHelpers.createElementWithClassName('div', 'square-container')
        this.squareContainer.classList.add(this.state.colour)

        this.squareContainer.ondragover = (ev) => {
                ev.preventDefault()
                if (!this.isPlayerMoveFunction()) {

                }
            }
            //this.squareContainer.appendChild(this.square)
        this.squareContainer.ondrop = (ev) => {
            ev.preventDefault()
            console.log("before");
            if (!this.isPlayerMoveFunction()) {
                return
            }
            console.log("after");
            var data = ev.dataTransfer.getData("text");
            data = JSON.parse(data)
            console.log(data);
            console.log(this.state);
            if (data.x === this.state.x && this.state.y === data.y) {
                return
            }
            console.log("after after");
            this.moveFunction(data, this.state)

        }

        this.squareContainer.onclick = () => {
            console.log(this.state);
            if (!this.isPlayerMoveFunction()) {
                return
            }
            let selected = this.selectionCallbacks.getSelection()
            if (selected != null && selected.moves.findIndex((e) => { return (this.state.y == e.y && this.state.x == e.x) }) != -1) {

                let source = selected.piece
                let target = this.state
                if (source.x === this.state.x && this.state.y === source.y) {
                    return
                }
                if (this.moveFunction(source, target)) {
                    this.selectionCallbacks.selectionUnHighlighting()
                    this.selectionCallbacks.selectionUpdate(null)
                }

            } else {
                this.selectionCallbacks.selectionUnHighlighting()
                this.selectionCallbacks.selectionUpdate(null)
                if (selected != null && selected.piece.x == this.state.x && selected.piece.y == this.state.y) {
                    console.log(selected);
                    return
                }
                let newSelection = {
                    y: this.state.y,
                    x: this.state.x,
                    src: this.piece.element.src
                }
                this.selectionCallbacks.selectionUpdate(newSelection)
                this.selectionCallbacks.selectionHighlighting()
            }
        }
    }

    updatePiece(pieceData, coord, check) {
        this.removePiece()
        this.setCheck(check)
        if (pieceData == null) {
            return
        }
        this.piece = new PieceView(pieceData, coord, this.isPlayerMoveFunction, this.selectionCallbacks)
        this.squareContainer.appendChild(this.piece.element)
    }
    setCheck(isCheck) {
        if (isCheck) {
            if (!this.squareContainer.classList.contains('check')) {
                this.squareContainer.classList.add('check')
            }
        } else {
            this.squareContainer.classList.remove('check')
        }
    }

    removePiece() {
        //console.log(this.squareContainer);
        this.piece = null
        this.squareContainer.textContent = ''
    }
    highlight(flags) {
        console.log(flags);
        console.log(this.squareContainer.classList);
        if (flags.includes('c') || flags.includes('e')) { // contains a piece or 
            console.log('c/e', this.squareContainer);
            this.squareContainer.classList.add('attacked')
        } else {
            console.log('else', this.squareContainer);
            this.squareContainer.classList.add('possible')
        }
        console.log(this.squareContainer.classList);
    }
    unHighlight() {
        this.squareContainer.classList.remove('possible')
        this.squareContainer.classList.remove('attacked')
    }
    select() {
        this.squareContainer.classList.add('selected')
    }
    deselect() {
        this.squareContainer.classList.remove('selected')
    }
}