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
      let tile = {
        id : uuidv4(),
        coordX : coordX,
        coordY : coordY,
        piece : {},
        color : (((Math.floor(index / 8) % 2) + index) % 2) === 1 ? '#c3c3ea' : "White",
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
        firstMove : true,
        vectors : StartingPieces[i].vectors
      }
    }
    this.state = {board : tempBoard, 
    selectedPiece : {}, 
    user : "", 
    moveList : [], 
    activePlayer : "White",
    check : {"White" : false, "Black" : false},
    };
    this.handleClickTile = this.handleClickTile.bind(this);
    this.handleForfeit = this.handleForfeit.bind(this);
  }
  componentDidMount() {
    this.setState({user : this.props.color});

    this.props.socket.on("send_move_list", (data, activePlayer) => {
      let workingBoard = this.state.board.map(tile=>(tile));
      let workingMoveList = this.state.moveList.map(move=>(move));
      data.forEach((move, index) => {
        if (JSON.stringify(move) !== JSON.stringify(workingMoveList[index])){

          this.MovePieces(move, workingBoard);
          workingMoveList.push(move);
        }
      });
      const checkmate = this.isCheckmate(workingBoard)
      if(checkmate[this.state.user]){
        this.props.socket.emit("forfeit");
      }
      this.setState({
        board : workingBoard, 
        check : this.checkThreaten(workingBoard),
        activePlayer : activePlayer,
        moveList : workingMoveList
      });
    });
  }

  handleClickTile (id) {
    var selectedTile = this.state.board.filter((tile=>(tile.id === id)))[0];
    let workingBoard = this.state.board.map(tile=>(tile));

    if (!isEmpty(selectedTile.piece) && selectedTile.piece.owner === this.state.user) workingBoard = this.highlightPiece(selectedTile, workingBoard);
    else if (selectedTile.piece.owner !== this.state.user && !isEmpty(this.state.selectedPiece) && selectedTile.selected !== ""){
      const move = {
        prevX : this.state.selectedPiece.coordX,
        prevY : this.state.selectedPiece.coordY,
        nextX : selectedTile.coordX,
        nextY : selectedTile.coordY,
        piece : this.state.selectedPiece.piece.type
      };
      this.props.socket.emit("add_move", move);
      this.setState({selectedPiece : {}});
      workingBoard = workingBoard.map(tile=>{
        tile.selected = "";
        return tile;});
    } else {
      this.setState({selectedPiece : {}});
      workingBoard = workingBoard.map(tile=>{
        tile.selected = "";
        return tile;});
    }

    this.setState({
      board : workingBoard,
      check : this.checkThreaten(workingBoard)
    });
  }

  MovePieces (move, workingBoard) {
    const prevTile = workingBoard.filter(tile => (tile.coordX === move.prevX && tile.coordY === move.prevY))[0];
    const nextTile = workingBoard.filter(tile => (tile.coordX === move.nextX && tile.coordY === move.nextY))[0];
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
    return workingBoard;
  }

  checkThreaten(workingBoard) {
    var playersInCheck = {"White" : false, "Black" : false};
    workingBoard.forEach((tile) => {
      if(!isEmpty(tile.piece)) {
        let possibleMoves = [];
        let startingpoint = {X : tile.coordX, Y : tile.coordY};
        possibleMoves = possibleMoves.concat(this.calculateMoves(workingBoard, tile.piece.vectors, startingpoint, tile.piece.firstMove, tile.piece.owner));
        possibleMoves.forEach((move) => {
          if (!isEmpty(move.piece) && move.piece.type === "King" && move.piece.owner !== tile.piece.owner) {
            playersInCheck[move.piece.owner] = true;
          }
        });
      }
    });
    return playersInCheck;
  }

  isCheckmate(workingBoard){
    let checkmate = {White : false, Black : false};
    for (let player in checkmate) {
      let possibleMoves = [];
      workingBoard.forEach((tile) => {
        if(!isEmpty(tile.piece) && tile.piece.owner === player){
          let startingpoint = {X : tile.coordX, Y : tile.coordY};
          possibleMoves = possibleMoves.concat(
            this.calculateMoves(workingBoard, tile.piece.vectors, startingpoint, tile.piece.firstMove, player));
          possibleMoves = possibleMoves.filter((endTile) => {
            const move = {
              prevX : tile.coordX,
              prevY : tile.coordY,
              nextX : endTile.coordX,
              nextY : endTile.coordY,
              piece : tile.piece.type,
              player : tile.piece.owner
            };
            var duplicateBoard = JSON.parse(JSON.stringify(workingBoard));
            const checkAfterMove = this.checkThreaten(this.MovePieces(move, duplicateBoard));
            return !checkAfterMove[player];
          });
        }
      });
      checkmate[player] = (possibleMoves.length === 0);
    }
    return checkmate;
  }

  highlightPiece (selectedTile, workingBoard) {
    workingBoard = workingBoard.map(tile=>{
      tile.selected = "";
      return tile;});

    if (selectedTile.piece === {} || selectedTile.selected !== "") selectedTile.selected = ""
    else if (selectedTile.piece.owner === this.state.user) selectedTile.selected = "lightBlue" //TODO check user id against piece owner
    else selectedTile.selected = ""

    let possibleMoves = [];
    if (selectedTile.selected !== ""){ //Determine possible moves
      let startingpoint = {X : selectedTile.coordX, Y : selectedTile.coordY};
      possibleMoves = possibleMoves.concat(
        this.calculateMoves(workingBoard, selectedTile.piece.vectors, startingpoint, selectedTile.piece.firstMove, this.state.user));
      possibleMoves = possibleMoves.filter((endTile) => {
        const move = {
          prevX : selectedTile.coordX,
          prevY : selectedTile.coordY,
          nextX : endTile.coordX,
          nextY : endTile.coordY,
          piece : selectedTile.piece.type,
          player : this.state.user
        };
        var duplicateBoard = JSON.parse(JSON.stringify(workingBoard));
        const checkAfterMove = this.checkThreaten(this.MovePieces(move, duplicateBoard));
        return !checkAfterMove[this.state.user];
      });
    }

    for (let option in possibleMoves) {
      possibleMoves[option].selected = "#ffe6bf";
    }
  this.setState({selectedPiece : selectedTile});
  return workingBoard ;
  }

  calculateMoves(board, vectors, coords, firstMove, player) {
    let possibleMoves = [];
    for (let vector in vectors) {
      let testingCoords = {X : coords.X, Y : coords.Y};
      let dist = 0;
      const maxDist = (vectors[vector].hasOwnProperty('firstMove') & firstMove) ? vectors[vector].firstMove : vectors[vector].dist;
      testingCoords.X += vectors[vector].X;
      testingCoords.Y += vectors[vector].Y;
      while (dist < maxDist && testingCoords.X < 9 && testingCoords.Y < 9 && testingCoords.X > 0 && testingCoords.Y > 0) {
        if (!isEmpty(board[(testingCoords.X - 1) + (testingCoords.Y - 1) * 8].piece)) {
          if (board[(testingCoords.X - 1) + (testingCoords.Y - 1) * 8].piece.owner !== player && vectors[vector].canAttack !== "no")
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

  handleForfeit() {
    this.props.socket.emit("forfeit");
  }

  render() {
    return (
      <div className="Game">
        {(this.state.activePlayer === this.state.user) 
          ? "Your turn"
          : "Waiting for opponent"
        }
        {(this.state.check[this.state.user]) ? "You are in Check!" : ""}
        {(this.state.check[(this.state.user === "White") ? "Black" : "White"]) ? "Opponent in Check!" : ""}
        <Board user={this.state.user} handleClick={this.handleClickTile} tiles={this.state.board}/>
        <button onClick={this.handleForfeit}>Forfeit</button>
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
