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
        let source = curGame.game.SQUARES[(move.source.y * 8) + move.source.x]
        let target = curGame.game.SQUARES[(move.target.y * 8) + move.target.x]
        let moveObj = { from: source, to: target }
        if (move.promotion !== null) {
            moveObj.promotion = move.promotion
        }
        let moveReturn = state.games[state.players[socket.id].game].game.move(moveObj)
        if (moveReturn == null) {
            console.log("invalid move");
            io.to(socket.id).emit('updated board', createGameState(state.games[state.players[socket.id].game], socket.id, 'Invalid move made'), )
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

    function addToLobby(id, prefs) {

        let lobbyItem = {
            id,
            prefs,
            name: state.players[id].name
        }
        console.log(state.lobby);
        state.lobby[id] = lobbyItem
            //TODO: make class
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
        //TODO: pref checking
        //TODO: check if player exists 
        //TODO: check if player is in game
        //TODO: check if player is in lobby
        console.log(state.lobby);
        console.log(prefs);
        prefs = { colour: validatePrefs(prefs) }
        console.log(prefs);
        console.log("test");
        if (!Object.keys(state.lobby).length) {
            addToLobby(socket.id, prefs)
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
                if (state.lobby[pl].prefs.colour != prefs.colour) {
                    selectedOpponent = pl
                    console.log("aa");
                    possible = true
                    break;
                }
            }
            if (!possible) {
                addToLobby(socket.id, prefs)
                console.log("not possible");
                io.emit("lobby list", state.lobby)
                return
            }

        }
        let game = {
            white: "",
            black: "",
            game: new Chess(), //TODO: custom fen
            curColour: "white",
        }

        let oppPrefs = state.lobby[selectedOpponent].prefs
        console.log("oppPrefs", oppPrefs);

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
        gameOver: game.game.game_over(),
        inCheck: game.game.in_check(),
        inCheckmate: game.game.in_checkmate(),
        inDraw: game.game.in_draw(),



    }
    gameState.status = status == undefined ?
        (gameState.playerColour == gameState.curColour ? 'Your turn to make a move' : 'Wait for your turn') : status
    return gameState

}