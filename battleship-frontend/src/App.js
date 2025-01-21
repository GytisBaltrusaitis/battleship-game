import './App.css';
import React, { useState, useEffect } from 'react';


const Battleship = () => {

  const [ships, setShips] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/ship')
    .then((response) => response.json())
    .then((data) => setShips(data));
  }, []);
  
  const grid = Array.from({length: 10}, (_, x) =>
    Array.from({length: 10}, (_, y) => ({x, y}))
  );

  const deleteCoordinate = async (shipName, x, y) => {
    const response = await fetch(`http://localhost:5000/ship/${shipName}/delete`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json'},
      body: JSON.stringify({x, y})
    });

    if(response.ok){
      const updatedShips = await response.json();
      setShips(updatedShips);
    }
  }

  const isPartOfShips = (x, y, allShips) => {
    for(let shipName in allShips){
      const ship = allShips[shipName].coordinates;
      if(ship.some((block) => block.x === x && block.y ===y)){
        return shipName;
      }
    }
    return null;
  }

  //console.log(ships);

  return (
    <div className="App">
      <h1>Battleship Game</h1>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(10, 70px)' }}>
        {grid.flat().map(({x, y}) => {
          const shipName = isPartOfShips(x, y, ships);
          return (
          <button
            key={`${x}-${y}`}
            style={{
              width: 70,
              height: 70,
              backgroundColor: shipName ? 'black' : 'white'
            }}
            onClick={() => {
              if(shipName){
                deleteCoordinate(shipName, x, y);
              }
            }}
            >
          </button>
          );
        })}
      </div>
    </div>
  );
}

export default Battleship;
