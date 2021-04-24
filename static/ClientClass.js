import LobbyView from "./View/lobby/LobbyView.js";
import ClientController from './Controller/ClientController.js'
import ClientView from "./View/ClientView.js";


export default class Client {
    constructor() {
        this.clientController = new ClientController()
    }
}