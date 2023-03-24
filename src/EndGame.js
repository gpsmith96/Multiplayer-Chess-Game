import React from 'react';
import './EndGame.css';

class EndGame extends React.Component {
  // constructor() {
  //   super();
  // }

  render(){
    return (
      <div className="endGame">
        <div className="Heading">{(this.props.winner === this.props.color)
        ? "You win!"
        : "You lost..."
      }</div>
        <button onClick={this.props.resetGame}>Return to Main Menu</button>
      </div>
    );
  }
}

export default EndGame;
