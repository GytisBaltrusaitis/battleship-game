const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const generateShip = (size, occupiedPositions) => {

    let ship = [];
    let validPosition = true;

    while(validPosition){
        const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const startX = Math.ceil(Math.random() * (orientation === 'horizontal' ? 10-size : 9));
        const startY = Math.ceil(Math.random() * (orientation === 'vertical' ? 10-size : 9));

        ship = [];
        for(let i = 0; i < size; i++){
            const newPosition = {
                x: orientation === 'horizontal' ? startX + i : startX,
                y: orientation === 'vertical' ? startY + i : startY
            }

            if(occupiedPositions.some((block) => block.x === newPosition.x && block.y === newPosition.y)){
                ship = [];
                break;
            }

            ship.push(newPosition);
        }
        if(ship.length === size){
            validPosition = false;
        }
    }
    ship.forEach(position => occupiedPositions.push(position));
    return ship;    
}

const generateAllShips = () =>{
    const ships = {};
    const size = [5, 4, 3, 3, 2, 2, 2, 1, 1, 1];
    const occupiedPositions = [];

    for(let i = 0; i < size.length; i++){
        ships[i] = {coordinates: generateShip(size[i], occupiedPositions)}
    }
    return ships;
}

app.get('/ship', (req, res) => {
    const allShips = generateAllShips();
    res.json(allShips);
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:5000');
})