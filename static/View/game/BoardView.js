import ViewHelpers from '../ViewHelpers.js'
import SquareView from './SquareView.js'
import ChessHelpers from './ChessHelpers.js'
import BoardLabelView from './BoardLabelView.js'
import PromotionView from './PromotionView.js'
export default class BoardView {
    constructor(moveFunction) {
        this.moveFunction = moveFunction
        this.createBoardElement()
    }
    createBoardElement() {
        this.boardContainer = ViewHelpers.createElementWithClassName('div', 'board-container')
        this.board = ViewHelpers.createElementWithClassName('div', 'board')

        this.boardContainer.appendChild(this.board)
    }
    updateGameState(gameState) {
        this.state = gameState
        console.log(this.state);
        if (this.grid == undefined) {
            this.createGrid()
        }
        if (this.promotion == undefined) {
            this.promotion = new PromotionView(this.state.playerColour)
            this.boardContainer.appendChild(this.promotion.promotionContainer)
        }
        this.addPieces()
    }
    createGrid() {
        this.grid = [...Array(8)].map(x => Array(8).fill(null))

        let min = this.state.playerColour == "black" ? 7 : 0
        let max = this.state.playerColour == "black" ? -1 : 8
        let increment = this.state.playerColour == "black" ? -1 : 1

        let selectionCallbacks = {
            selectionUnHighlighting: () => {
                this.selectionUnHighlighting()
            },
            selectionHighlighting: () => {
                this.selectionHighlighting()
            },
            selectionUpdate: (newValue) => {
                this.selectionUpdate(newValue)
            },
            getSelection: () => {
                return this.selected
            }
        }

        this.board.appendChild(this.createHorizontalLabelRow(min, max, increment))
        for (let y = min; y != max; y += increment) {

            let row = ViewHelpers.createElementWithClassName('div', 'row')


            row.appendChild(new BoardLabelView((8 + 1) - (y + 1)))
            for (let x = min; x != max; x += increment) {

                let startColour = !(y % 2) ? "white" : "black"
                let notStartColour = (y % 2) ? "white" : "black"
                let colour = !(x % 2) ? startColour : notStartColour
                let curSquare = new SquareView({ colour: colour, y: y, x: x },
                    () => { return this.isPlayerMove() },
                    (source, target) => { return this.move(source, target) },
                    selectionCallbacks)
                row.appendChild(curSquare.squareContainer)
                // rowAR.push(curSquare)
                this.grid[y][x] = curSquare
            }
            row.appendChild(new BoardLabelView((8 + 1) - (y + 1)))
            this.board.appendChild(row)

        }
        this.board.appendChild(this.createHorizontalLabelRow(min, max, increment))
    }

    addPieces() {
        let min = this.state.playerColour == "black" ? 7 : 0
        let max = this.state.playerColour == "black" ? -1 : 8
        let increment = this.state.playerColour == "black" ? -1 : 1
        console.log("state", this.state);
        console.log(this.state.board);
        console.log(this.state.playerColour);
        for (let y = min; y != max; y += increment) {
            for (let x = min; x != max; x += increment) {
                // for (let y = 0; y < 8; y++) {
                //     for (let x = 0; x < 8; x++) {
                let isPiece = this.state.curColour[0] == this.state.board[y][x]?.color && this.state.board[y][x]?.type == "k"
                let isCheck = this.state.inCheck || this.state.inCheckMate
                this.grid[y][x].updatePiece(this.state.board[y][x], { y, x }, isCheck && isPiece ? true : false)
            }
        }
    }

    createHorizontalLabelRow(min, max, increment) {
        let row = ViewHelpers.createElementWithClassName('div', 'row')
        row.appendChild(new BoardLabelView(''))
        for (let x = min; x != max; x += increment) {
            row.appendChild(new BoardLabelView(ChessHelpers.coordToNotation(x, 0).x))
        }
        return row
    }
    isPlayerMove() {
        return (this.state.curColour == this.state.playerColour)
    }

    async move(source, target) {
        let targetSAN = ChessHelpers.coordToNotation(target.x, target.y)
        console.log(targetSAN);
        console.log(source);
        console.log(this.state.board[source.y][source.x]);
        let moveIndex = this.state.board[source.y][source.x].moves.findIndex((e) => {
            return e.to == targetSAN.x + targetSAN.y
        })
        if (moveIndex == -1) {
            return false
        }
        //TODO: check flags
        let flags = this.state.board[source.y][source.x].moves[moveIndex].flags
        console.log(flags);
        if (flags.length == 1 && flags[0] != 1) {

        }
        //TODO: if promotion add promise to display piece screen
        console.log("waiting");
        let result = null
        if (flags.includes('p')) {
            await this.promotionListener().then((e) => {
                result = e.target.value
            })
        }

        if (result === false) {
            return false
        }
        
        this.grid[source.y][source.x].removePiece()
        this.grid[target.y][target.x].updatePiece(
            this.state.board[source.y][source.x],
            source
        )
        this.state.curColour = "white" ? "black" : "white"
        console.log("move made");
        this.moveFunction(source, target, result)
        return true

    }
    async promotionListener(element, listenerName) {
        this.promotion.show()
        let that = this
        return new Promise(function (resolve, reject) {
            var listener = event => {
                // element.removeEventListener(listenerName, listener);
                resolve(event);
                that.promotion.hide()
            };
            // element.addEventListener(listenerName, listener);
            that.promotion.attatchListeners(listener)
        });
    }
    selectionUnHighlighting() {

        if (this.selected == null) {
            return
        }
        this.grid[this.selected.piece.y][this.selected.piece.x].deselect()
        this.selected.moves.forEach((e) => {
            this.grid[e.y][e.x].unHighlight()
        })
    }
    selectionHighlighting() {
        console.log(this.selected);
        console.log("highlighting");
        if (this.selected === null) {
            return
        }
        this.grid[this.selected.piece.y][this.selected.piece.x].select()
        this.selected.moves.forEach((e) => {
            this.grid[e.y][e.x].highlight(e.flags)
        })
    }
    selectionUpdate(newSelection) {
        if (newSelection == null) {
            this.selected = null
            return
        }
        console.log(newSelection);
        console.log(this.state.board);
        if (this.state.board[newSelection.y][newSelection.x] == null ||
            this.state.board[newSelection.y][newSelection.x].color != this.state.playerColour[0]) {
            console.log("hit");
            return
        }
        this.selected = {
            piece: {
                y: newSelection.y,
                x: newSelection.x,
                src: newSelection.src,
            },
            moves: []
        }
        this.selected.moves = this.state.board[newSelection.y][newSelection.x].moves.map((e) => {
            let move = ChessHelpers.notationToCoord(e.to)

            move.flags = [...e.flags.split('')]
            console.log('move generation', move.flags);
            return move
        })
    }
}