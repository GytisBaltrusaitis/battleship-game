import './App.css';

function App() {

  const grid = Array.from({length: 10}, (_, x) =>
    Array.from({length: 10}, (_, y) => ({x, y}))
  );

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
              backgroundColor: 'white'
            }}
            >
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
