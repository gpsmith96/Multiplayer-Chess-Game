import React from 'react';
import './StartPage.css';

class StartPage extends React.Component {
  constructor() {
    super();
    this.state = {
        inputRoomID : "",
        message : "",
        inputUsername : "",
        playerCount : 0
      }
    this.handleJoin = this.handleJoin.bind(this);
    this.handleUser = this.handleUser.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }


  componentDidMount() {
    this.props.socket.on("ack", (room, num) => {
      this.props.setRoomID(room);
      this.setState({playerCount : num});
    });

    this.props.socket.on("join_success", () => {
      this.props.setRoomID(this.state.inputRoomID);
      this.setState({inputRoomID : ""});
    });

    this.props.socket.on("join_fail", () => {
      this.setState((prevState) => ({inputRoomID : ""}));
    });
  }
  handleJoin() {
    console.log("requesting to join room " + this.state.inputRoomID);
    this.props.socket.emit("join room", this.state.inputRoomID);
  }

  handleUser() {
    this.props.setUsername(this.state.inputUsername);
    this.setState({inputUsername : ""});
  }

  handleStart() {
    console.log("start game button pressed");
    this.props.socket.emit("start_game");
  }

  render(){
    return (
      <div className="StartPage">
        <div className="Heading">Chess game</div>
        <div className="Heading">Current room: {this.props.roomID} </div>
        <div>Username: {this.props.username}</div> 
        <div>Players in room: {this.state.playerCount}/2</div>
        Change Username: <input value={this.state.inputUsername} onChange={(e) => {this.setState({inputUsername : e.target.value})}}/>
        <button onClick={this.handleUser}>Set Username</button>
        Join a Room: <input value={this.state.inputRoomID} onChange={(e) => {this.setState({inputRoomID : e.target.value})}}/>
        <button onClick={this.handleJoin}>Join</button>
        {(this.state.playerCount == 2) ? <button className="StartButton" onClick={this.handleStart}>Start Game</button>:<></>}
      </div>
    );
  }
}

export default StartPage;
