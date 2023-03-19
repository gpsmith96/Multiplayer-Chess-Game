import React from 'react';
import './StartPage.css';
import { v4 as uuidv4 } from 'uuid';

class StartPage extends React.Component {
  constructor() {
    super();
    this.state = {
        roomID : "",
        inputRoomID : "",
        message : "",
        inputUsername : "",
        username : "Player",
        chatLog : "",
        playerCount : 0
      }
    this.handleJoin = this.handleJoin.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }


  componentDidMount() {
    this.props.socket.on("connect_ack", () => {
      this.props.socket.emit("registerUsername", this.state.username);
    });

    this.props.socket.on("message", (username, data) => {
      console.log(data);
      this.setState((prevState) => ({chatLog : prevState.chatLog + "\n" + username + ":    " + data}));
    });

    this.props.socket.on("ack", (room, num) => {
      this.setState((prevState) => ({roomID : room, playerCount : num}));
    });

    this.props.socket.on("start_game", (role) => {
      console.log("Start game as " + role);
      this.props.startGame(role);
    });

    this.props.socket.on("join_success", () => {
      this.setState((prevState) => ({roomID : prevState.inputRoomID, inputRoomID : ""}));
    });

    this.props.socket.on("join_fail", () => {
      this.setState((prevState) => ({inputRoomID : ""}));
    });
  }
  handleJoin() {
    console.log("requesting to join room " + this.state.inputRoomID);
    this.props.socket.emit("join room", this.state.inputRoomID);
  }
  handleSend() {
    this.props.socket.emit("broadcast", this.state.roomID, this.state.message);
    // this.setState((prevState) => ({message : "", chatLog : prevState.chatLog + "\n" + this.state.username + ":    " + this.state.message}));
    this.setState((prevState) => ({message : ""}));
  }

  handleUser() {
    this.props.socket.emit("registerUsername", this.state.inputUsername);
    this.setState((prevState) => ({username : prevState.inputUsername, inputUsername : ""}));
  }

  handleStart() {
    console.log("start game button pressed");
    this.props.socket.emit("start_game");
  }

  render(){
    return (
      <div className="StartPage">
        <h1>Chess game   {this.state.playerCount}/2</h1>
        Username: <input value={this.state.inputUsername} onChange={(e) => {this.setState({inputUsername : e.target.value})}}/>
        <button onClick={this.handleUser}>Set Username</button>
        <div>Username: {this.state.username} Current room: {this.state.roomID}</div>
        Room to join: <input value={this.state.inputRoomID} onChange={(e) => {this.setState({inputRoomID : e.target.value})}}/>
        <button onClick={this.handleJoin}>Join</button>
        Message to send: <input value={this.state.message} onChange={(e) => {this.setState({message : e.target.value})}}/>
        <button onClick={this.handleSend}>Send</button>
        {(this.state.playerCount == 2) ? <button className="StartButton" onClick={this.handleStart}>Start Game</button>:<></>}
        <div className="chatBox">
          <ul>{this.state.chatLog.split("\n").map((text) => (<li key={uuidv4()}>{text}</li>))}</ul>
        </div>
      </div>
    );
  }
}

export default StartPage;
