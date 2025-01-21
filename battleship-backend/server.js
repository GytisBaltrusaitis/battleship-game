const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const generateShip = (size) => {
    const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    const startX = Math.ceil(Math.random() * (orientation === 'horizontal' ? 10-size : 9));
    const startY = Math.ceil(Math.random() * (orientation === 'vertical' ? 10-size : 9));

    const ship = [];
    for(let i = 0; i < size; i++){
        ship.push({x: orientation === 'horizontal' ? startX + i : startX,
                   y: orientation === 'vertical' ? startY +i : startY
        })
    }
    return ship;    
}

app.get('/ship', (req, res) => {
    const ships = {};
    const size = [5, 4, 3, 3, 2, 2, 2, 1, 1, 1];

    for(let i = 0; i < size.length; i++){
        ships[i] = {coordinates: generateShip(size[i])}
    }

    const ship = generateShip(3);
    res.json(ships);
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:5000');
})