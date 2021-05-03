try {
    var k = new Map();
    console.log("ES6 supported!!")
} catch (err) {
    console.log("ES6 not supported :(")
}
var express = require('express');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
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
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, '/static/index.html'));
});

// Starts the server.
server.listen(PORT_NO, function() {
    console.log('Starting server on port ' + PORT_NO);
});


const { Chess } = require('chess.js')

const { v4: uuidv4 } = require('uuid');
const state = {
    players: {},
    lobby: {},
    games: {}

}
io.on('connection', function(socket) {

    socket.on('new player', function() {
        let capitalizedName = uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            style: 'capital'
        }); // Red_Big_Donkey
        state.players[socket.id] = {
            id: socket.id,
            name: capitalizedName
        };
        console.log("user connect", state.players);
        // io.emit('player list', state.players)
        io.to(socket.id).emit('joined', state.players[socket.id])
        io.to(socket.id).emit('lobby list', state.lobby)

    });
    socket.on('disconnect', () => {
        console.log("user disconnect", socket.id);
        if (!(socket.id in state.players)) {
            console.log("error: player already disconnected");
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

        let curGame = state.games[state.players[socket.id].game]

        let playerColour = Object.keys(curGame)[Object.values(curGame).indexOf(socket.id)]

        console.log(playerColour);
        console.log(curGame.curColour);
        if (playerColour != curGame.curColour) {
            //TODO: send state back to sender
            io.to(socket.id).emit('updated board', createGameState(state.games[state.players[socket.id].game]))
            return

        }
        console.log();
        let source = curGame.game.SQUARES[(move.source.y * 8) + move.source.x]
        let target = curGame.game.SQUARES[(move.target.y * 8) + move.target.x]
        let moveObj = { from: source, to: target }
        if (move.promotion !== null) {
            moveObj.promotion = move.promotion
        }
        let moveReturn = state.games[state.players[socket.id].game].game.move(moveObj)
        if (moveReturn == null) {
            console.log("invalid move made by :", state.players[socket.id]);
            io.to(socket.id).emit('updated board', createGameState(state.games[state.players[socket.id].game], socket.id, 'Invalid move made'), )
            return
        }

        let oppPlayer = (curGame.white == curGame[playerColour] ? curGame.black : curGame.white)
        state.games[state.players[socket.id].game].curColour = playerColour == "white" ? "black" : "white"
        io.to(oppPlayer).emit('updated board', createGameState(state.games[state.players[socket.id].game], oppPlayer))
        io.to(socket.id).emit('updated board', createGameState(state.games[state.players[socket.id].game], socket.id))


    })

    function addToLobby(id, prefs) {

        let lobbyItem = {
            id,
            prefs,
            name: state.players[id].name
        }
        console.log(state.lobby);
        state.lobby[id] = lobbyItem
    }

    function removeFromLobby(id) {
        delete state.lobby[id]
    }

    function validatePrefs(prefs) {
        if (prefs) {
            if (prefs == "white") {
                return "white"
            }
            if (prefs == "black") {
                return "black"
            }

        }
        return "any"

    }
    socket.on('join lobby', (prefs) => {

        if (!socket.id in state.players) {
            console.log("player with id: ", socket.id, " does not exist ")
            return
        }
        if ("game" in state.players[socket.id]) {
            console.log("player ", state.players[socket.id], " is already in game")
            return
        }
        if (socket.id in state.lobby) {
            removeFromLobby(socket.id)
            console.log("player ", state.players[socket.id], " is already in lobby ... removing ")
        }

        prefs = { colour: validatePrefs(prefs) }


        if (!Object.keys(state.lobby).length) {
            addToLobby(socket.id, prefs)
            io.emit("lobby list", state.lobby)
            return
        }

        let selectedOpponent = null
        if (prefs.colour == "any") {
            let keys = Object.keys(state.lobby);
            selectedOpponent = keys[keys.length * Math.random() << 0]
        } else {
            let possible = false
            for (pl in state.lobby) {
                if (state.lobby[pl].prefs.colour != prefs.colour) {
                    selectedOpponent = pl
                    possible = true
                    break;
                }
            }
            if (!possible) {
                addToLobby(socket.id, prefs)
                io.emit("lobby list", state.lobby)
                return
            }

        }
        let oppPrefs = state.lobby[selectedOpponent].prefs
        let opponent = { id: selectedOpponent, prefs: oppPrefs }
        let player = { id: socket.id, prefs: prefs }
        createGame(player, opponent)

    })

    function createGame(player1, player2) {
        let game = {
            white: "",
            black: "",
            game: new Chess(), //TODO: custom fen
            curColour: "white",
        }

        game.white = player1.prefs.colour == "white" ? player1.id : player2.prefs.colour == "white" ? player2.id : ""
        game.black = player1.prefs.colour == "black" ? player1.id : player2.prefs.colour == "black" ? player2.id : ""
        if (game.white == "" && game.black == "") {

            if (Math.round(Math.random()) == 1) {
                game.white = player1.id
                game.black = player2.id
            } else {
                game.white = player2.id
                game.black = player1.id
            }

        } else if (game.white == "") {
            game.white = game.black == player1.id ? player2.id : player1.id
        } else if (game.black == "") {
            game.black = game.white == player1.id ? player2.id : player1.id
        }

        let uuid = uuidv4()
        while (uuid in state.games) {
            uuid = uuidv4() // should not be needed
        }

        state.players[player2.id].game = uuid
        state.players[player1.id].game = uuid

        state.games[uuid] = game

        io.to(player1.id).emit('game started', createGameState(game, player1.id))
        io.to(player2.id).emit('game started', createGameState(game, player2.id))
        removeFromLobby(player1.id)
        removeFromLobby(player2.id)
        console.log("Game Created for :", player1, player2);
        io.emit("lobby list", state.lobby)
    }
    socket.on('challenge', (playerChallenge) => {
        if (!playerChallenge in state.lobby) {
            console.log('Player with id ', playerChallenge, 'is not in lobby');
            io.to(socket.id).emit("lobby list", state.lobby)
            return
        }
        let player1 = { id: socket.id, prefs: { colour: "any" } }
        let player2 = { id: state.lobby[playerChallenge].id, prefs: state.lobby[playerChallenge].prefs }
        createGame(player1, player2)

    })
    socket.on('req lobby', () => {
        io.to(socket.id).emit("lobby list", state.lobby)
    })
    socket.on('exit lobby', () => {
        removeFromLobby(socket.id)
        io.emit("lobby list", state.lobby)

    })

    socket.on('resign', () => {
        //TODO: check if in game
        if (!socket.id in state.players) {
            console.log("player with id: ", socket.id, " does not exist ")
            return
        }
        if (!"game" in state.players[socket.id]) {
            console.log("player ", state.players[socket.id], " is not in a game")
            return
        }
        if (!state.players[socket.id].game in state.games) {
            console.log("game : ", state.players[socket.id].game, " does not exist ")
            return
        }
        console.log("resign from", state.players[socket.id]);
        let opponent = getOpponent(socket.id)

        io.to(opponent).emit("opponent resign")
        deleteGame(socket.id)

    })

    socket.on('offer draw', () => {
        if (!socket.id in state.players) {
            console.log("player with id: ", socket.id, " does not exist ")
            return
        }
        if (!"game" in state.players[socket.id]) {
            console.log("player ", state.players[socket.id], " is not in a game")
            return
        }
        if (!state.players[socket.id].game in state.games) {
            console.log("game : ", state.players[socket.id].game, " does not exist ")
            return
        }
        let opponent = getOpponent(socket.id)

        io.to(opponent).emit("draw offer")
    })

    socket.on('accept draw', (result) => {
        console.log('draw', result);
        if (!result) {
            return
        }
        if (!socket.id in state.players) {
            console.log("player with id: ", socket.id, " does not exist ")
            return
        }
        if (!"game" in state.players[socket.id]) {
            console.log("player ", state.players[socket.id], " is not in a game")
            return
        }
        if (!state.players[socket.id].game in state.games) {
            console.log("game : ", state.players[socket.id].game, " does not exist ")
            return
        }
        let opponent = getOpponent(socket.id)
        console.log("drawing", opponent, socket.id);
        deleteGame(socket.id)
        io.to(opponent).emit("game draw")
        io.to(socket.id).emit("game draw")
    })

})

function getOpponent(id) {
    return state.games[state.players[id].game].white == id ? state.games[state.players[id].game].black : state.games[state.players[id].game].white
}

function deleteGame(playerID) {
    if (!playerID in state.players) {
        return
    }
    if (!"game" in state.players[playerID]) {
        return
    }
    if (!state.players[playerID].game in state.games) {
        return
    }
    let game = state.games[state.players[playerID].game]
    let player1 = game.white
    let player2 = game.black

    delete state.games[state.players[playerID].game]
    delete state.players[player1]["game"]
    delete state.players[player2]["game"]
}

function createGameState(game, player, status) {
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
    let gameState = {
        board: board,
        curColour: game.curColour,
        playerColour: game.white == player ? "white" : "black",
        opponentName: game.white == player ? state.players[game.black].name : state.players[game.white].name,
        gameOver: game.game.game_over(),
        inCheck: game.game.in_check(),
        inCheckmate: game.game.in_checkmate(),
        inDraw: game.game.in_draw(),
        moveHistory: game.game.history({ verbose: true })



    }
    return gameState

}