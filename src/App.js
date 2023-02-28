import './App.css';
import React from 'react';
import Game from './Game';
import StartPage from './StartPage';

class App extends React.Component {
  constructor() {
    super();
    this.state = {GameIsActive : false}
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((prevState) => ({GameIsActive : !prevState.GameIsActive}));
  }

  render() {
    return (
      <div className="App">
        {this.state.GameIsActive 
          ? <Game />
          : <StartPage startGame={this.handleClick}/>}
      </div>
    );
  }
}

export default App;
