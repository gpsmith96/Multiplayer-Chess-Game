import './Tile.css';

function Tile(props) {
  const tileStyle = {
    backgroundColor: (props.selected == "") ? props.color : props.selected, 
    cursor : (props.piece) ? "grab" : "default",
    };
  return (
    <div className="Tile" onClick={() => props.handleClick(props.id)} style={tileStyle}>
    <p>{(props.piece) ? props.piece.symbol : ""}</p>
    </div>
  );
}

export default Tile;
