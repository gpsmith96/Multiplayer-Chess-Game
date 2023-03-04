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
        socket : io("https://chess-game-server.onrender.com", {
          transports : ['websocket', 'polling'],
          withCredentials : true
        }),
        connected : false
      }
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {

    this.state.socket.on("connect", () => {
      this.state.socket.send(this.state.socket.id + " connected");
      this.setState({connected : true})
    });

    this.state.socket.on("message", data => {
      console.log(data);
    });

    this.state.socket.on("private message", (anotherSocketId, msg) => {
      console.log("Private message from " + anotherSocketId + ": " + msg);
    });
  }

  handleClick() {
    this.setState((prevState) => ({GameIsActive : !prevState.GameIsActive}));
  }

  render() {
    return (
      <div className="App">
        {this.state.GameIsActive 
          ? <Game socket={this.state.socket}/>
          : this.state.connected ? <StartPage startGame={this.handleClick} socket={this.state.socket}/>
          : "connecting"}
      </div>
    );
  }
}

export default App;
