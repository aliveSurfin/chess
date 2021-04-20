try {
    var k = new Map();
    console.log("ES6 supported!!")
} catch (err) {
    console.log("ES6 not supported :(")
}
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
const PORT_NO = process.env.PORT || 5000
app.set('port', PORT_NO);
app.use('/static', express.static(__dirname + '/static'));



// Routing
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server.
server.listen(PORT_NO, function () {
    console.log('Starting server on port ' + PORT_NO);
});


const { Chess } = require('chess.js')

const { v4: uuidv4 } = require('uuid');
const state = {
    players: {},
    lobby: {},
    games: {}

}
io.on('connection', function (socket) {

    socket.on('new player', function () {
        state.players[socket.id] = {
            id: socket.id,
        };
        console.log("user connect", state.players);
        // io.emit('player list', state.players)
        io.to(socket.id).emit('lobby list', state.lobby)
        io.to(socket.id).emit('joined')
    });
    socket.on('disconnect', () => {
        console.log("user disconnect", socket.id);
        if (!(socket.id in state.players)) {
            console.log("error");
            //todo: error handling
            return
        }
        if ("game" in state.players[socket.id]) { // player is in game
            let game = state.games[state.players[socket.id].game]
            let otherPlayer = game.white == socket.id ? game.black : game.white
            io.to(otherPlayer).emit('opponent left')
            delete state.players[otherPlayer]["game"]
        }
        delete state.players[socket.id]
        delete state.lobby[socket.id]
        io.emit('lobby list', state.lobby)

    })
    socket.on('move', (move) => {
        console.log(move, socket.id);
        if (!("game" in state.players[socket.id])) {
            // player doesn't have game
            return
        }

        if (!(state.players[socket.id].game in state.games)) {
            //player has game but not in games
            return
        }
        //TODO: valid move checking
        let curGame = state.games[state.players[socket.id].game]
        // console.log(curGame);
        // console.log(Object.keys(curGame));
        // console.log(Object.values(curGame));
        // console.log(socket.id);
        // console.log(Object.values(curGame).indexOf(socket.id));
        let playerColour = Object.keys(curGame)[Object.values(curGame).indexOf(socket.id)]
        //console.log(playerColour);
        console.log(playerColour);
        console.log(curGame.curColour);
        if (playerColour != curGame.curColour) {
            //TODO: send state back to sender
            io.to(socket.id).emit('updated board', createGameState(state.games[state.players[socket.id].game]))
            return

        }
        console.log();
        let source = curGame.game.SQUARES[(move.source[0] * 8) + move.source[1]]
        let target = curGame.game.SQUARES[(move.target[0] * 8) + move.target[1]]
        let moveReturn = state.games[state.players[socket.id].game].game.move({ from: source, to: target })
        if (moveReturn == null) {
            console.log("invalid move");
            io.to(socket.id).emit('updated board', createGameState(state.games[state.players[socket.id].game], socket.id))
            return
        }
        //TODO valid move check
        console.log(source);
        console.log(target);

        let oppPlayer = (curGame.white == curGame[playerColour] ? curGame.black : curGame.white)
        state.games[state.players[socket.id].game].curColour = playerColour == "white" ? "black" : "white"
        io.to(oppPlayer).emit('updated board', createGameState(state.games[state.players[socket.id].game], oppPlayer))
        io.to(socket.id).emit('updated board', createGameState(state.games[state.players[socket.id].game], socket.id))


    })
    socket.on('join lobby', (prefs) => {
        //TODO: pref checking
        //TODO: check if player exists 
        //TODO: check if player is in game
        //TODO: check if player is in lobby
        console.log(prefs);
        prefs = { colour: prefs.colour || "any" }

        if (!Object.keys(state.lobby).length) {
            state.lobby[socket.id] = prefs
            io.emit("lobby list", state.lobby)
            return
        }
        //state.lobby[socket.id] = prefs
        let selectedOpponent = null
        if (prefs.colour == "any") {
            let keys = Object.keys(state.lobby);
            selectedOpponent = keys[keys.length * Math.random() << 0]
        } else {
            let possible = false
            for (pl in state.lobby) {
                if (state.lobby[pl].colour != prefs.colour) {
                    selectedOpponent = pl
                    console.log("aa");
                    possible = true
                    break;
                }
            }
            if (!possible) {
                state.lobby[socket.id] = prefs
                console.log("not possible");
                io.emit("lobby list", state.lobby)
                return
            }

        }
        let game = {
            white: "",
            black: "",
            game: new Chess(),//TODO: custom fen
            curColour: "white",
        }

        let oppPrefs = state.lobby[selectedOpponent]

        game.white = prefs.colour == "white" ? socket.id : oppPrefs.colour == "white" ? selectedOpponent : ""
        game.black = prefs.colour == "black" ? socket.id : oppPrefs.colour == "black" ? selectedOpponent : ""
        console.log(game.white);
        console.log(game.black);
        if (game.white == "" && game.black == "") {

            if (Math.round(Math.random()) == 1) {
                game.white = socket.id
                game.black = selectedOpponent
            } else {
                game.white = selectedOpponent
                game.black = socket.id
            }

        } else if (game.white == "") {
            game.white = game.black == socket.id ? selectedOpponent : socket.id
        } else if (game.black == "") {
            game.black = game.white == socket.id ? selectedOpponent : socket.id
        }
        console.log(game);
        // return
        // console.log(Object.keys(state.lobby))
        // //TODO: pref checking
        let uuid = uuidv4()
        while (uuid in state.games) {
            uuid = uuidv4() // should not be needed
        }
        //let selectedOpponent = state.lobby[Object.keys(state.lobby)[0]]
        state.players[selectedOpponent].game = uuid
        state.players[socket.id].game = uuid

        state.games[uuid] = game
        delete state.lobby[selectedOpponent]
        let fen = game.game.fen()
        io.to(socket.id).emit('game started', createGameState(game, socket.id))
        io.to(selectedOpponent).emit('game started', createGameState(game, selectedOpponent))

        console.log(game.curColour);
        io.emit("lobby list", state.lobby)

    })



})
function createGameState(game, player) {
    let board = game.game.board()
    for (let y = 0; y < board.length; y++) {
        board[y] = board[y].map((square, x) => {
            if (square == null) {
                return square
            }

            square.moves = game.game.moves({ square: game.game.SQUARES[(y * 8) + x], verbose: true })
            return square
        })
    }
    let gameState = { board: board, curColour: game.curColour, playerColour: game.white == player ? "white" : "black" }
    return gameState

}
