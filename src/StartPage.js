import React from 'react';
import './StartPage.css';

class StartPage extends React.Component {
  constructor() {
    super();
    this.state = {
        roomID : "",
        inputRoomID : "",
        message : ""
      }
    this.handleJoin = this.handleJoin.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }


  componentDidMount() {
    this.setState({roomID : this.props.socket.id});
  }
  handleJoin() {
    console.log("requesting to join room " + this.state.inputRoomID);
    this.props.socket.emit("join room", this.state.inputRoomID);
    this.setState((prevState) => ({roomID : prevState.inputRoomID, inputRoomID : ""}));
  }
  handleSend() {
    this.props.socket.emit("broadcast", this.state.roomID, this.state.message);
  }
  render(){
    return (
      <div className="StartPage">
        <h1>Chess game</h1>
        <div>Current room: {this.state.roomID}</div>
        Room to join: <input value={this.state.inputRoomID} onChange={(e) => {this.setState({inputRoomID : e.target.value})}}/>
        <button onClick={this.handleJoin}>Join</button>
        Message to send: <input value={this.state.message} onChange={(e) => {this.setState({message : e.target.value})}}/>
        <button onClick={this.handleSend}>Send</button>
        <button className="StartButton" onClick={this.props.startGame}>Start Game</button>
      </div>
    );
  }
}

export default StartPage;
