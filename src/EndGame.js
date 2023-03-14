import React from 'react';

class EndGame extends React.Component {
  constructor() {
    super();
  }

  render(){
    return (
      <div className="endGame">
        {this.props.winner}
      </div>
    );
  }
}

export default EndGame;
