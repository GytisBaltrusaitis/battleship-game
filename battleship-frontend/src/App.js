import './App.css';
import React, { useState, useEffect } from 'react';


const Battleship = () => {

  const [ship, setShip] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/ship')
    .then((response) => response.json())
    .then((data) => setShip(data));
  }, []);
  
  console.log(ship);

  const grid = Array.from({length: 10}, (_, x) =>
    Array.from({length: 10}, (_, y) => ({x, y}))
  );

  const isPartOfShip = (x, y ) => ship.some((block) => block.x === x && block.y ===y);

  return (
    <div className="App">
      <h1>Battleship Game</h1>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 70px)' }}>
        {grid.flat().map(({x, y}) => (
          <button
            key={`${x}-${y}`}
            style={{
              width: 70,
              height: 70,
              backgroundColor: isPartOfShip(x, y) ? 'black' : 'white'
            }}
            //onClick={console.log(x, y)}
            >
          </button>
        ))}
      </div>
    </div>
  );
}

export default Battleship;
