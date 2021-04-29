export default class ChessHelpers {
    static notationToCoord(input) {
        let x = input.split('')[0].charCodeAt(0) - 97
        let y = parseInt(input.split('')[1])
        y = (8 + 1) - (y + 1)
        return { y, x }
    }
    static coordToNotation(x, y) {
        x = String.fromCharCode(x + 97)
        y = (8 + 1) - (y + 1)
        return { x, y }
    }
}