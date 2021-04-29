//helper funcs 
function isDigit(toTest) {
    return /^\d+$/.test(toTest)
}

function isUpperCase(toTest) {
    return toTest.toUpperCase() == toTest
}
const pieceMap = {
    "r": "Rook",
    "n": "Knight",
    "black": "Bishop",
    "q": "Queen",
    "k": "King",
    "p": "Pawn",
}
class Piece {

    constructor(type = "Empty", colour = "Empty") {
        this.colour = colour;
        this.type = pieceMap[type.toLowerCase()]

    }
}


class Chess {
    constructor(fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
        this.parseFenString(fen)
        this.turn = "white"
    }

    parseFenString(fenString) {
        //white uppercase
        //black lowercase
        let fenArray = fenString.split(" ")
        let board = fenArray[0].split("/")
        this.curColour = fenArray[1] == "white" ? "white" : "black"
        this.castling = fenArray[2]
        this.enPassant = fenArray[3]
        this.halfmoveClock = fenArray[4]
        this.fullmoveNumber = fenArray[5]
        board = board.map((e) => {

            e = e.split("");
            let newArray = []
            for (let x = 0; x < e.length; x++) {
                if (isDigit(e[x])) {
                    for (let y = 0; y < e[x]; y++) {
                        newArray.push(null)
                    }
                } else {
                    if (isUpperCase(e[x])) {
                        newArray.push(new Piece(e[x], "white"))
                    } else {
                        newArray.push(new Piece(e[x], "black"))
                    }
                }
            }
            return newArray;
        })
        this.board = board
    }
    validMoveGeneration() {
        //game.board = [8][8]
        //game.curColour = [8][8]
        let attacks = Array(8).fill(Array(8).fill(null))
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board.length; x++) {
                let curPiece = this.board[y][x]
                if (curPiece == null || curPiece.colour == this.curColour) {
                    continue
                }
                attacks[y][x] = this.pieceAttackGeneration(curPiece, y, x)
                    // "r": "Rook",
                    // "n": "Knight",
                    // "black": "Bishop",
                    // "q": "Queen",
                    // "k": "King",
                    // "p": "Pawn",



            }
        }
        return attacks

    }
    pieceAttackGeneration(curPiece, y, x) {
        let attacks = []
        switch (curPiece.type) {
            case "Rook":
                return this.straightAttacks(x, y)
                break;
            case "Knight":
                break;
            case "Bishop":
                return this.diagonalAttacks(x, y)
                break;
            case "Queen":
                return this.diagonalAttacks(x, y).concat(this.straightAttacks(x, y))
                break;
            case "King":
                break;
            case "Pawn":
                break;
            default:
                break;
        }
        return attacks
    }
    diagonalAttacks(x, y) {
        let attacks = []
        let origX = x
        let origY = y
        while (x > 0 && y > 0) {
            x--
            y--
            if (this.board[y][x] == null) {
                attacks.push({ x, y })
            } else {
                break;
            }
        }
        x = origX
        y = origY
        while (x < 7 && y < 7) {
            x++
            y++
            if (this.board[y][x] == null) {
                attacks.push({ x, y })
            } else {
                break;
            }
        }
        return attacks
    }
    straightAttacks(x, y) {
        let attacks = []
        let origX = x
        let origY = y
        while (x > 0) { // left
            x--
            if (this.board[y][x] == null) {
                attacks.push({ x, y })
            } else {
                break;
            }
        }
        x = origX
        while (x < 7) { //right
            x++
            if (this.board[y][x] == null) {
                attacks.push({ x, y })
            } else {
                break;
            }
        }

        x = origX

        //up/down

        while (y > 0) { // up
            y--
            if (this.board[y][x] == null) {
                attacks.push({ x, y })
            } else {
                break;
            }
        }
        y = origY

        while (y < 7) {
            y++
            if (this.board[y][x] == null) {
                attacks.push({ x, y })
            } else {
                break;
            }
        }
        if (attacks.length > 0) {
            // console.log(curPiece);
            console.log(origX, origY);
            console.log(attacks);
        }
        return attacks
    }
};

exports.Chess = Chess