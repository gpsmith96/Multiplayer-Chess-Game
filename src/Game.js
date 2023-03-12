import Board from './Board';
import React from 'react';
import './Board.css'
import { v4 as uuidv4 } from 'uuid';
import StartingPieces from './StartingPieces.js'

class Game extends React.Component {
  constructor() {
    super();
    var tempBoard = []
    for (let index = 0; index < 64; index++) {
      let coordX = (index % 8) + 1;
      let coordY = Math.floor(index / 8) + 1
      let piece = {};
      let tile = {
        id : uuidv4(),
        coordX : coordX,
        coordY : coordY,
        piece : {},
        color : (((Math.floor(index / 8) % 2) + index) % 2) == 1 ? '#c3c3ea' : "White",
        selected : ""
      };
      tempBoard.push(tile);
    }

    for (let i in StartingPieces){
      for (let j in StartingPieces[i].index)
      tempBoard[StartingPieces[i].index[j]].piece = {
        type : StartingPieces[i].type,
        owner : StartingPieces[i].owner,
        symbol : StartingPieces[i].symbol,
        firstMove : true
      }
    }
    this.state = {board : tempBoard, selectedPiece : {}, user : "", moveList : []}
    this.handleClickTile = this.handleClickTile.bind(this);
  }
  componentDidMount() {
    this.setState({user : this.props.color});

    this.props.socket.on("send_move_list", (data) => {
      let workingBoard = this.state.board.map(tile=>(tile));
      data.forEach((move, index) => {
        if (JSON.stringify(move) !== JSON.stringify(this.state.moveList[index])){

          const prevTile = workingBoard.filter(tile => (tile.coordX === move.prevX && tile.coordY === move.prevY))[0];
          const nextTile = workingBoard.filter(tile => (tile.coordX === move.nextX && tile.coordY === move.nextY))[0];

          this.MovePieces (prevTile, nextTile, workingBoard, false, move.player);
        }
      });

      this.setState({board : workingBoard});
    });
  }

  handleClickTile (id) {
    var selectedTile = this.state.board.filter((tile=>(tile.id === id)))[0];
    let workingBoard = this.state.board.map(tile=>(tile));

    if (!isEmpty(selectedTile.piece) && selectedTile.piece.owner === this.state.user) workingBoard = this.highlightPiece(selectedTile, workingBoard);
    else if (selectedTile.piece.owner !== this.state.user && !isEmpty(this.state.selectedPiece) && selectedTile.selected !== ""){
      workingBoard = this.MovePieces(this.state.selectedPiece, selectedTile, workingBoard, true, this.state.user);
    } else {
      this.setState({selectedPiece : {}});
      workingBoard = workingBoard.map(tile=>{
        tile.selected = "";
        return tile;});
    }
    this.setState({board : workingBoard});
  }

  MovePieces (prevTile, nextTile, workingBoard, emit, player) {
    const move = {
      prevX : prevTile.coordX,
      prevY : prevTile.coordY,
      nextX : nextTile.coordX,
      nextY : nextTile.coordY,
      piece : prevTile.piece.type
    };
    if (emit) this.props.socket.emit("add_move", move);
    workingBoard = workingBoard.map(tile=>{
      tile.selected = "";
      if (tile.id === nextTile.id) {
        tile.piece = JSON.parse(JSON.stringify(prevTile.piece));
        tile.piece.firstMove = false;
      }
      return tile;});
    workingBoard = workingBoard.map(tile=>{
      if (tile.id === prevTile.id) tile.piece = {};
      return tile;});
    move.player = player;
    this.setState((prevState) => {
      prevState.moveList.push(move);
      return {
        moveList : prevState.moveList,
        selectedPiece : {}
      }
    });
    return workingBoard;
  }
  highlightPiece (selectedTile, workingBoard) {
    workingBoard = workingBoard.map(tile=>{
      tile.selected = "";
      return tile;});

    if (selectedTile.piece == {} || selectedTile.selected !== "") selectedTile.selected = ""
    else if (selectedTile.piece.owner === this.state.user) selectedTile.selected = "lightBlue" //TODO check user id against piece owner
    else selectedTile.selected = ""

    let possibleMoves = [];
    if (selectedTile.selected !== ""){ //Determine possible moves
      let vectors = [];
      let startingpoint = {X : selectedTile.coordX, Y : selectedTile.coordY};
      switch(selectedTile.piece.type){
        case "Pawn" : //Forward 1 or 2, or attack diagonal forward 1
          vectors = [
              {X : 0, Y : (this.state.user === "White" ? -1 : 1), dist : (selectedTile.piece.firstMove ? 2 : 1), canAttack : "no"},
              {X : 1, Y : (this.state.user === "White" ? -1 : 1), dist : 1, canAttack : "only"},
              {X : -1, Y : (this.state.user === "White" ? -1 : 1), dist : 1, canAttack : "only"},
            ];
          break;
        case "Rook" : //Forward back right and left any number
          vectors = [
              {X : 1, Y : 0, dist : 8, canAttack : "yes"},
              {X : -1, Y : 0, dist : 8, canAttack : "yes"},
              {X : 0, Y : 1, dist : 8, canAttack : "yes"},
              {X : 0, Y : -1, dist : 8, canAttack : "yes"},
            ];
          break;
        case "Bishop" : //diagonal any number forward or back
          vectors = [
              {X : 1, Y : 1, dist : 8, canAttack : "yes"},
              {X : -1, Y : 1, dist : 8, canAttack : "yes"},
              {X : 1, Y : -1, dist : 8, canAttack : "yes"},
              {X : -1, Y : -1, dist : 8, canAttack : "yes"},
            ];
          break;
        case "Knight" : //L shaped, +/-2, then +/-1 perpindicular
          vectors = [
              {X : 2, Y : 1, dist : 1, canAttack : "yes"},
              {X : 2, Y : -1, dist : 1, canAttack : "yes"},
              {X : -2, Y : 1, dist : 1, canAttack : "yes"},
              {X : -2, Y : -1, dist : 1, canAttack : "yes"},
              {X : 1, Y : 2, dist : 1, canAttack : "yes"},
              {X : -1, Y : 2, dist : 1, canAttack : "yes"},
              {X : 1, Y : -2, dist : 1, canAttack : "yes"},
              {X : -1, Y : -2, dist : 1, canAttack : "yes"}
            ];
          break;
        case "King" : //Forward back right left or diagonal 1
          vectors = [
              {X : 1, Y : 1, dist : 1, canAttack : "yes"},
              {X : -1, Y : 1, dist : 1, canAttack : "yes"},
              {X : 1, Y : -1, dist : 1, canAttack : "yes"},
              {X : -1, Y : -1, dist : 1, canAttack : "yes"},
              {X : 1, Y : 0, dist : 1, canAttack : "yes"},
              {X : -1, Y : 0, dist : 1, canAttack : "yes"},
              {X : 0, Y : 1, dist : 1, canAttack : "yes"},
              {X : 0, Y : -1, dist : 1, canAttack : "yes"}
            ];
          break;
        case "Queen" : //Forward back right left or diagonal any number
          vectors = [
              {X : 1, Y : 1, dist : 8, canAttack : "yes"},
              {X : -1, Y : 1, dist : 8, canAttack : "yes"},
              {X : 1, Y : -1, dist : 8, canAttack : "yes"},
              {X : -1, Y : -1, dist : 8, canAttack : "yes"},
              {X : 1, Y : 0, dist : 8, canAttack : "yes"},
              {X : -1, Y : 0, dist : 8, canAttack : "yes"},
              {X : 0, Y : 1, dist : 8, canAttack : "yes"},
              {X : 0, Y : -1, dist : 8, canAttack : "yes"}
            ];
          break;
      }
      possibleMoves = possibleMoves.concat(this.calculateMoves(workingBoard, vectors, startingpoint));
    }

    for (let option in possibleMoves) {
      possibleMoves[option].selected = "#ffe6bf";
    }
  this.setState({selectedPiece : selectedTile});
  return workingBoard ;
  }

  calculateMoves(board, vectors, coords) {
    let possibleMoves = [];
    for (let vector in vectors) {
      let testingCoords = {X : coords.X, Y : coords.Y};
      let dist = 0;
      testingCoords.X += vectors[vector].X;
      testingCoords.Y += vectors[vector].Y;
      while (dist < vectors[vector].dist && testingCoords.X < 9 && testingCoords.Y < 9 && testingCoords.X > 0 && testingCoords.Y > 0) {
        if (!isEmpty(board[(testingCoords.X - 1) + (testingCoords.Y - 1) * 8].piece)) {
          if (board[(testingCoords.X - 1) + (testingCoords.Y - 1) * 8].piece.owner !== this.state.user && vectors[vector].canAttack !== "no")
            possibleMoves.push(board[(testingCoords.X - 1) + (testingCoords.Y - 1) * 8]);
          break;
        }
        else if (vectors[vector].canAttack !== "only") possibleMoves.push(board[(testingCoords.X - 1) + (testingCoords.Y - 1) * 8]);
        testingCoords.X += vectors[vector].X;
        testingCoords.Y += vectors[vector].Y;
        dist++;
      }
    }
    return possibleMoves;
  }

  render() {
    console.log(JSON.stringify(this.state.moveList));
    return (
      <div className="Game">
        <Board user={this.state.user} handleClick={this.handleClickTile} tiles={this.state.board}/>
        <button>Forfeit</button>
        <button onClick={() => (this.setState((prevState) => ({user : (prevState.user === "White" ? "Black" : "White")})))}>Swap Player</button>
      </div>
    );
  }
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}
export default Game;
