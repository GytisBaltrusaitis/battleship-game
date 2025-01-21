const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const generateShip = () => {
    const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    const startX = Math.ceil(Math.random() * (orientation === 'horizontal' ? 5 : 9));
    const startY = Math.ceil(Math.random() * (orientation === 'vertical' ? 5 : 9));

    const ship = [];
    for(let i = 0; i < 5; i++){
        ship.push({x: orientation === 'horizontal' ? startX + i : startX,
                   y: orientation === 'vertical' ? startY +i : startY
        })
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