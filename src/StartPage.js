import './StartPage.css';

function StartPage(props) {
  return (
    <div className="StartPage">
      <h1>Chess game</h1>
      <button className="StartButton" onClick={props.startGame}>Start Game</button>
    </div>
  );
}

export default StartPage;
