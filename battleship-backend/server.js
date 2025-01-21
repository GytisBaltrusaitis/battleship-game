const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const generateShip = () => {
    const ship = [];
    for(let i = 0; i < 5; i++){
        ship.push({x: 1, y: i})
    }
    return ship;    
}

app.get('/ship', (req, res) => {
    const ship = generateShip();
    res.json(ship);
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:5000');
})