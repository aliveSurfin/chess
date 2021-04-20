

// 'n' - a non-capture
// 'b' - a pawn push of two squares
// 'e' - an en passant capture
// 'c' - a standard capture
// 'p' - a promotion
// 'k' - kingside castling
// 'q' - queenside castling

let socket = io()
let state = {
}
let selected = null
socket.emit('new player')
socket.on('joined', () => {
    console.log(socket.id);
    let h1 = document.createElement('h1')
    h1.innerText = socket.id
    document.body.appendChild(h1)
})

document.getElementById('join-lobby-submit-button').onclick = () => {
    let prefs = { colour: document.getElementById("join-lobby-colour-select")?.value }
    socket.emit('join lobby', prefs)
}
socket.on('game started', (gameState) => {
    state = gameState
    console.log("game");
    displayEmptyBoard()
    console.log(gameState);
    displayPieces()
})

function displayPieces() {
    let board = state.board
    let min = state.playerColour== "black" ? 7 : 0
    let max = state.playerColour== "black" ? -1 : 8
    let increment = state.playerColour== "black" ? -1 : 1
    for (let y = min; y != max; y+=increment) {
        for (let x = min; x != max; x+=increment) {
            let curSquare = document.getElementById(`${y}${x}`)
            curSquare.innerHTML = ``
            if (board[y][x] == null) {
                continue
            }
            //console.log(board[y][x]);
            let curPiece = document.createElement("img")
            let curPieceName = `${board[y][x].color}_${board[y][x].type}`
            curPiece.src = `/static/assets/images/pieces/${curPieceName}.png`

            curPiece.id = `${y}:${x}`
            curPiece.className = curPieceName
            curPiece.draggable = false
            if (state.curColour == state.playerColour && board[y][x].moves.length != 0) {
                console.log(board[y][x]);
                curPiece.draggable = true;
                curPiece.ondragstart = (ev) => {
                    selectionUnHighlighting()
                    selected = null
                    ev.dataTransfer.setData("text", ev.target.parentNode.id);
                    console.log(ev.target.width);
                    // let test = new Image(ev.target.width / 2, ev.target.width / 2)
                    // test.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
                    // test.src = `/static/assets/images/pieces/${curPieceName}.png`
                    // console.log(ev.target.src);
                    // console.log(ev.target.src);
                    // console.log(test);
                    // var div = document.createElement('div');
                    // div.id = "temp"
                    // div.appendChild(test);
                    // document.querySelector('body').appendChild(div);
                    // ev.dataTransfer.setDragImage(div, 0, 0)
                    //var elem = document. getElementById("temp"); elem. remove();
                    //console.log(ev);
                    curPiece.style.opacity = 0.5


                    if (board[y][x] != null) {
                        selected = {
                            piece: { y, x },
                            moves: []

                        }
                        selected.moves = board[y][x].moves.map((e) => {
                            return notationToCoord(e.to)
                        })

                        selectionHighlighting()
                    }
                }
                curPiece.ondragend = (ev) => {

                    curPiece.style.opacity = 1
                    selectionUnHighlighting()
                    selected = null
                }

            }
            curSquare.appendChild(curPiece)
        }
    }
}
function highlightSquare(target) {
    //console.log(target);

    //console.log(y, x);
    //console.log();
    let square = document.getElementById(`${target.y}${target.x}`)
    if (square.childNodes.length) {
        // let piece = square.childNodes[0]
        // piece.classList.add('attacked')
        square.classList.add('attacked')
    } else {
        square.classList.add('possible')
    }
    //return { y, x }

}
function unHighlightSquare(target) {
    console.log(target);
    let square = document.getElementById(`${target.y}${target.x}`)
    console.log(square);
    if (square.childNodes.length) {
        // let piece = square.childNodes[0]
        // piece.classList.remove('attacked')
        square.classList.remove('attacked')
    }
    square.classList.remove('possible')

}
function selectionHighlighting() {
    if (selected === null) {
        return
    }
    let square = document.getElementById(`${selected.piece.y}${selected.piece.x}`)
    square.classList.add('selected')
    selected.moves.forEach((e) => {
        highlightSquare(e)
    })

}
function selectionUnHighlighting() {
    if (selected === null) {
        return
    }
    let square = document.getElementById(`${selected.piece.y}${selected.piece.x}`)
    square.classList.remove('selected')
    selected.moves.forEach((e) => {
        unHighlightSquare(e)
    })
}
socket.on('opponent left', () => {
    console.log("player left game");
})
socket.on('lobby list', (players) => {

    let playerlist = document.getElementById("player-list")
    playerlist.innerHTML = ''
    for (let player in players) {
        console.log(player);

        let curPlayerItem = document.createElement('li')
        curPlayerItem.innerText = player
        curPlayerItem.style = player == socket.id ? "color:red" : ""
        playerlist.appendChild(curPlayerItem)
    }
})
socket.on('updated board', (updatedBoard) => {
    console.log("got move");
    console.log(state);
    console.log(updatedBoard);
    state = updatedBoard
    displayEmptyBoard()
    displayPieces()
})
socket.on('attacks', (attacks) => {
    console.log(attacks);
    state.attacks = attacks
    for (let y = 0; y < attacks.length; y++) {
        for (let x = 0; x < attacks.length; x++) {
            let curAtks = attacks[y][x]
            let atkSquare = document.getElementById(`${y}${x}`).childNodes[0]
            if (atkSquare == undefined) {
                return
            }
            atkSquare.onclick = () => {
                console.log("clicked");
                console.log(curAtks);
                for (let i = 0; i < curAtks.length; i++) {
                    let atk = curAtks[i]
                    let test = document.getElementById(`${atk.y}${atk.x}`)
                    console.log(test);
                    if (!test.classList.contains('attacked')) {
                        test.classList.add('attacked')
                    }
                }
            }
            // if (!atkSquare.classList.contains('attacked')) {
            //     atkSquare.classList.add('attacked')
            // }
        }
    }
})
function move(piece, source, target) {
    console.log(piece, source, target);
    let sourceARR = source.id.split("").map((e) => { return parseInt(e) })
    let targetARR = target.id.split("").map((e) => { return parseInt(e) })
    let targetSAN = `${String.fromCharCode(97 + targetARR[1])}${((8 + 1) - (targetARR[0] + 1))}`
    console.log(targetSAN);
    console.log()
    let moveIndex = state.board[sourceARR[0]][sourceARR[1]].moves.findIndex((e) => {
        return e.to == targetSAN
    })
    if (moveIndex == -1) {
        return false
    }

    if (target.childNodes.length) {
        target.innerHTML = ''
    }

    //TODO: flag checking for || castling (queenside ) (kingside)
    target.appendChild(piece)
    source.innerHTML = ''
    //console.log(target);
    state.curColour = state.curColour == "white" ? "black" : "white"
    socket.emit('move', { source: sourceARR, target: targetARR })
    return true
}
function displayEmptyBoard() {
    let boardDiv = document.getElementById("board")
    boardDiv.innerHTML = ``
    boardDiv.style.display = "grid"
    let min = state.playerColour== "black" ? 7 : 0
    let max = state.playerColour== "black" ? -1 : 8
    let increment = state.playerColour== "black" ? -1 : 1
    for (let y = min; y != max; y+= increment) {
        let row = document.createElement("div")
        row.className = "row"
        row.setAttribute('data-row', (8 + 1) - (y + 1))
        boardDiv.appendChild(row)
        let startColour = !(y % 2) ? "white" : "black"
        let notStartColour = (y % 2) ? "white" : "black"
        for (let x = min; x != max; x+= increment) {
            let curSquare = document.createElement("div")
            let colour = !(x % 2) ? startColour : notStartColour
            curSquare.className = `Square ${colour}`
            //curSquare.id = `${String.fromCharCode(97 + x)}${((8 + 1) - (y + 1))}`
            curSquare.id = `${y}${x}`
            curSquare.onclick = () => {
                if (state.curColour != state.playerColour) {
                    return
                }
                var msg = new SpeechSynthesisUtterance();
                msg.text = curSquare.id.split("").join(" ");
                //window.speechSynthesis.speak(msg);
                //TODO: ADD SPEACH FUNCTIONALITY
                console.log(msg.text);
            }
            // curPiece.innerText = board[y][x].type
            curSquare.ondragover = (e) => {
                if (state.curColour != state.playerColour) {
                    return
                }
                //console.log(e);
                //TODO: valid checking
                e.preventDefault()
            }
            curSquare.ondrop = (ev) => {
                if (state.curColour != state.playerColour) {
                    return
                }
                ev.preventDefault();
                console.log("drop");
                var data = ev.dataTransfer.getData("text");
                console.log(data);
                console.log(ev.target.tagName);
                let target = ev.target
                if (ev.target.tagName == "IMG") {
                    target = target.parentNode
                }
                let previous = document.getElementById(data)
                let movedPiece = previous.childNodes[0]
                movedPiece.style.display = "inline"
                if (previous.id == target.id) {
                    return
                }
                console.log(movedPiece, previous, target)
                move(movedPiece, previous, target)
                return
                console.log(previous);
                ev.target.appendChild(movedPiece);
                console.log(data);
                console.log(ev.target.parentElement);
                var msg = new SpeechSynthesisUtterance();
                msg.text = `${movedPiece.className.replace("_", " ")} ${previous.id} to ${ev.target.id}`;
                console.log(msg.text);
                socket.emit('move', { source: previous.id, target: ev.target.id })
                window.speechSynthesis.speak(msg);
            }
            curSquare.setAttribute('data-col', String.fromCharCode(97 + x))
            row.appendChild(curSquare)
            curSquare.onclick = () => {
                if (state.curColour != state.playerColour) {
                    return
                }
                let board = state.board
                console.log(state.board[y][x]);
                if (selected != null && selected.moves.findIndex((e) => { return (y == e.y && x == e.x) }) != -1) {
                    //TODO: make move
                    console.log("move condition");
                    let target = document.getElementById(`${y}${x}`)
                    let previous = document.getElementById(`${selected.piece.y}${selected.piece.x}`)
                    let movedPiece = previous.childNodes[0]
                    if (previous.id == target.id) {
                        return
                    }
                    if (move(movedPiece, previous, target)) {
                        selectionUnHighlighting()
                        selected = null
                    }
                    // console.log(previous);
                }
                else {
                    selectionUnHighlighting()
                    selected = null
                    console.log(board[y][x]);
                    console.log(state);
                    if (board[y][x] != null && board[y][x].color == state.playerColour[0]) {
                        selected = {
                            piece: { y, x },
                            moves: []

                        }
                        selected.moves = board[y][x].moves.map((e) => {
                            return notationToCoord(e.to)
                        })

                        selectionHighlighting()
                    }

                }
            }
        }
        //boardDiv.appendChild(curSquare)
        boardDiv.appendChild(row)
    }
}



// helper funcs 

function notationToCoord(input) {
    let x = input.split('')[0].charCodeAt(0) - 97
    let y = parseInt(input.split('')[1])
    y = (8 + 1) - (y + 1)
    return { y, x }
}