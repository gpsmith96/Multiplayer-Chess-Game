import React from 'react';
import Tile from './Tile';
import './Board.css';

class Board extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="Board-Container">
        <ul style = { {flexFlow : (this.props.user == "White") ? "row wrap" : "row-reverse wrap-reverse"}}>
          {this.props.tiles.map((element) => {
            const tileStyle = {
              borderColor : (element.selected == "#ffe6bf") ? "Black" : "#ddddf0",
              zIndex : (element.selected == "#ffe6bf") ? "1" : "0"
              };
            return <li className="Tile" style={tileStyle} key={element.id}><Tile handleClick={this.props.handleClick} {...element}/></li>
          })}
        </ul>
      </div>
    );
  }
}

export default Board;
