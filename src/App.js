import './App.css';
import React from 'react';
import Game from './Game';
import StartPage from './StartPage';
import EndGame from './EndGame';
import { v4 as uuidv4 } from 'uuid';

const io = require("socket.io-client");

class App extends React.Component {
  constructor() {
    super();
    this.state = {
        GameIsActive : false,
        socket : io("https://chess-game-server.onrender.com", {
        // socket : io("ws://localhost:8000", {
          transports : ['websocket', 'polling'],
          withCredentials : true
        }),
        color: "White",
        gameOver : false,
        winner : "",
        roomID : "",
        message : "",
        chatLog : "",
        username : "Player",
      }
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.setRoomID = this.setRoomID.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  componentDidMount() {
    this.state.socket.on("connect", () => {
      this.state.socket.emit("registerUsername", this.state.username);
      this.forceUpdate();
    });
    this.state.socket.on("disconnect", () => {
      console.log("Disconnected from the server");
      this.forceUpdate();
    });

    this.state.socket.on("chat_message", (username, data) => {
      console.log(data);
      this.setState((prevState) => ({chatLog : prevState.chatLog + "\n" + username + ":    " + data}));
    });

    this.state.socket.on("start_game", (role) => {
      console.log("Start game as " + role);
      this.startGame(role);
    });

    // this.state.socket.on("message", (source, data) => {
    //   console.log(source + ": " + data);
    // });

    this.state.socket.on("end_game", (winner) => {
      console.log("End Game");
      this.endGame(winner);
    });
  }

  startGame(role) {
    this.setState((prevState) => ({GameIsActive : !prevState.GameIsActive, color : role}));
  }

  endGame(winner) {
    console.log("Game over, the winner is " + winner)
    this.setState({
      gameOver : true,
      winner : winner,
      GameIsActive : false
    });
  }

  resetGame() {
    this.setState({
      gameOver : false,
      winner : "",
      GameIsActive : false
    });
  }

  setRoomID(value) {
    this.setState({roomID : value});
  }

  setUsername(value) {
    this.state.socket.emit("registerUsername", value);
    this.setState({username : value});
  }
  handleSend() {
    this.state.socket.emit("broadcast", this.state.roomID, this.state.message);
    this.setState((prevState) => ({message : ""}));
  }

  render() {
    return (
      <div className="App">
        <div className="chatBox">
          <ul>{this.state.chatLog.split("\n").map((text) => (<li key={uuidv4()}>{text}</li>))}</ul>
          <input value={this.state.message} onChange={(e) => {this.setState({message : e.target.value})}}/>
          <button onClick={this.handleSend}>Send</button>
        </div>
        <div className="gameContainer">{
        !this.state.socket.connected 
          ? "connecting"
          : this.state.gameOver
            ? <EndGame winner={this.state.winner} resetGame={this.resetGame} color={this.state.color}/>
            : this.state.GameIsActive 
              ? <Game socket={this.state.socket} color={this.state.color}/>
              : <StartPage socket={this.state.socket} 
              setRoomID={this.setRoomID} roomID={this.state.roomID}
              setUsername={this.setUsername} username={this.state.username}
              chatLog={this.state.chatLog}/>
        }</div>
      </div>
    );
  }
}

export default App;
