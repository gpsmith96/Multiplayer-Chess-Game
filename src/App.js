import './App.css';
import React from 'react';
import Game from './Game';
import StartPage from './StartPage';
const io = require("socket.io-client");

class App extends React.Component {
  constructor() {
    super();
    this.state = {
        GameIsActive : false,
        // socket : io("https://chess-game-server.onrender.com", {
        socket : io("ws://localhost:8000", {
          transports : ['websocket', 'polling'],
          withCredentials : true
        }),
        connected : false,
        color: "White"
      }
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {

    this.state.socket.on("connect", () => {
      this.state.socket.send(this.state.socket.id + " connected");
      this.setState({connected : true})
    });

    this.state.socket.on("message", (source, data) => {
      console.log(source + ": " + data);
    });
  }

  startGame(role) {
    this.setState((prevState) => ({GameIsActive : !prevState.GameIsActive, color : role}));
  }

  render() {
    return (
      <div className="App">
      {this.state.color}
        {this.state.GameIsActive 
          ? <Game socket={this.state.socket} color={this.state.color}/>
          : this.state.connected ? <StartPage startGame={this.startGame} socket={this.state.socket}/>
          : "connecting"
      }
      </div>
    );
  }
}

export default App;
