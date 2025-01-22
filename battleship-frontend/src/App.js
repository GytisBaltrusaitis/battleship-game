import './App.css';
import React, { useState, useEffect } from 'react';


const Battleship = () => {

  const [ships, setShips] = useState([]);
  const [message, setMessage] = useState('');
  const [shots, setShots] = useState(25);
  const [missedCoordinates, setMissedCoordinates] = useState([]);
  const [destroyedShipCoordinates, setDestroyedShipCoordinates] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [gifState, setGifState] = useState({});

  useEffect(() => {
    if(sessionId){
      fetchShips();
    }
  }, [sessionId]);

  //console.log(sessionId);
  const startGame = async () => {
    const response = await fetch('http://localhost:5000/startGame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
    });
    const data = await response.json();
    setSessionId(data.sessionId);
    setShips(data.ships);
    setShots(25);
    setMessage("Try to destroy all ships!");
    setMissedCoordinates([]);
    setDestroyedShipCoordinates([]);
  }

  const fetchShips = async () => {
    const response = await fetch(`http://localhost:5000/ship/${sessionId}`);
    const data = await response.json();
    setShips(data);
    setShots(25);
    setMessage("Try to destroy all ships!");
    setMissedCoordinates([]);
    setDestroyedShipCoordinates([]);
  }
  
  const grid = Array.from({length: 10}, (_, x) =>
    Array.from({length: 10}, (_, y) => ({x, y}))
  );

  const deleteCoordinate = async (shipName, x, y) => {
    const response = await fetch(`http://localhost:5000/ship/${sessionId}/${shipName}/delete`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json'},
      body: JSON.stringify({x, y})
    });

    if(response.ok && shots > 0){
      const { message, ships:updatedShips } = await response.json();
      setShips(updatedShips);
      setDestroyedShipCoordinates((prev) => [...prev, {x, y}]);
      setMessage(message);
    }
  }


  const checkIfMissedCoordinate = (x, y) => {
    return missedCoordinates.some((coordinate) => coordinate.x === x 
                                && coordinate.y === y);
  }

  const checkIfDestroyedShipCoordinate = (x, y) => {
    return destroyedShipCoordinates.some((coordinate) => coordinate.x === x 
                                && coordinate.y === y);
  }

  const attack = (x, y) => {
    if(!checkIfMissedCoordinate(x, y) && !checkIfDestroyedShipCoordinate(x, y) 
      && shots > 0 && (sessionId !== null)){
    setMissedCoordinates((prev) => [...prev, {x, y}]);
    setShots((prevShots) => prevShots -1);
    setMessage("You missed");
    }
  }

  const isPartOfShips = (x, y, allShips) => {
    for(let shipName in allShips){
      const ship = allShips[shipName];
      if(ship && ship.coordinates){
        if(ship.coordinates.some((block) => block.x === x && block.y === y)){
          return shipName;
        }
      }
    }
    return null;
  }

  const handleClick = (x, y, shipName) => {
      if(sessionId !== null){
      setGifState((prevState) => ({
        ...prevState,
        [`${x}-${y}`]: 'gif'
      }))

      if(shipName){
        deleteCoordinate(shipName, x, y);
      } else{
        attack(x, y);
      }

      setTimeout(() => {
        setGifState((prevState) => ({
          ...prevState,
          [`${x}-${y}`]: 'image',
        }))
      }, 1000);
    }
  }


  //console.log(ships);

  return (
    <div className="App">
      <h1>Battleship Game</h1>
      <h2>Remaining shots : {shots}</h2>
      {!sessionId ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <button onClick={startGame}>Restart</button>
      )}
      <div className = 'Battleground' style={{display: 'grid', gridTemplateColumns: 'repeat(10, 70px)' }}>
        {grid.flat().map(({x, y}) => {
          const shipName = isPartOfShips(x, y, ships);
          const missed = checkIfMissedCoordinate(x, y);
          const hit = checkIfDestroyedShipCoordinate(x, y);

          const currentState = gifState[`${x}-${y}`];

          return (
          <button
            key={`${x}-${y}`}
            style={{
              width: 70,
              height: 70,
              backgroundColor: hit ? '#353633' : missed ? '#248cd180' : '#248cd1AA',
              backgroundImage: 
              currentState === 'gif'
              ? 'url("/droplet.gif")' : currentState === 'image' ?
              hit ? 'url("/explosion.png")' :
              missed ? 'url("/splash.png")' : 'none'
              : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            onClick={() => handleClick(x, y, shipName)}
            >
          </button>
          );
        })}
      </div>
      <p>{message}</p>
    </div>
  );
}

export default Battleship;
