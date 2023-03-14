import './App.css';
import React from 'react';
import Game from './Game';
import StartPage from './StartPage';
import EndGame from './EndGame';
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
        winner : ""
      }
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  componentDidMount() {
    this.state.socket.on("connect", () => {
      this.state.socket.send(this.state.socket.id + " connected");
      this.forceUpdate();
    });
    this.state.socket.on("disconnect", () => {
      console.log("Disconnected from the server");
      this.forceUpdate();
    });

    this.state.socket.on("message", (source, data) => {
      console.log(source + ": " + data);
    });

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
      winner : winner
    });
  }

  render() {
    return (
      <div className="App">
        {
        !this.state.socket.connected 
          ? "connecting"
          : this.state.gameOver
            ? <EndGame winner={this.state.winner}/>
            : this.state.GameIsActive 
              ? <Game socket={this.state.socket} color={this.state.color}/>
              : <StartPage startGame={this.startGame} socket={this.state.socket}/>
        }
      </div>
    );
  }
}

export default App;
