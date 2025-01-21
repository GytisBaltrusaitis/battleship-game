const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
app.use(cors());
app.use(bodyParser.json());

const isOccupied = (position, occupiedPositions) => 
    occupiedPositions.some((occupied) => occupied.x === position.x && occupied.y === position.y);


const unavailablePositions = (position, occupiedPositions) => {
    const surroundingPositions = [
        {x: position.x - 1, y: position.y - 1}, //topleft
        {x: position.x, y: position.y - 1}, //top
        {x: position.x + 1, y: position.y - 1}, //topright
        {x: position.x - 1, y: position.y}, //left
        {x: position.x + 1, y: position.y},// right
        {x: position.x - 1, y: position.y + 1},//bottom left
        {x: position.x + 1, y: position.y + 1},//bottom right
        {x: position.x, y: position.y + 1}//bottom
    ];

    surroundingPositions.forEach((surrounding) => {
        if(surrounding.x >= 0 && surrounding.x < 10 &&
            surrounding.y >= 0 && surrounding.y < 10 &&
            !isOccupied(surrounding, occupiedPositions)){
                occupiedPositions.push(surrounding);
        }
    });
};

const generateShip = (size, occupiedPositions) => {

    let ship = [];
    let validPosition = true;

    while(validPosition){
        const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const startX = Math.floor(Math.random() * (orientation === 'horizontal' ? 10-size : 10));
        const startY = Math.floor(Math.random() * (orientation === 'vertical' ? 10-size : 10));

        ship = [];
        for(let i = 0; i < size; i++){
            const newPosition = {
                x: orientation === 'horizontal' ? startX + i : startX,
                y: orientation === 'vertical' ? startY + i : startY
            }

            if(isOccupied(newPosition, occupiedPositions)){
                ship = [];
                break;
            }

            ship.push(newPosition);
        }
        if(ship.length === size){
            validPosition = false;
        }
    }
    ship.forEach((position) => {
        occupiedPositions.push(position); 
        unavailablePositions(position, occupiedPositions);
    });

    return ship;    
}

const generateAllShips = () =>{
    const ships = {};
    const occupiedPositions = [];
    const sizes = [5, 4, 3, 3, 2, 2, 2, 1, 1, 1];
    const names = [
        'firstFive', 'firstfour', 'firstThree', 'secondThree',
        'firstTwo', 'secondTwo', 'thirdTwo', 'firstOne', 'secondOne',
        'thirdOne',
    ]

    sizes.forEach((size, index) => {
        ships[names[index]] = {
            coordinates: generateShip(size, occupiedPositions)
        };
    });


    return ships;
}

let ships = generateAllShips();

app.get('/ship', (req, res) => {
    ships = generateAllShips();
    res.json(ships);
})

app.delete('/ship/:shipName/delete', (req, res) => {
    const {shipName} = req.params;
    const {x, y} = req.body;

    ships[shipName].coordinates = ships[shipName].coordinates.filter(
        (coordinate) => coordinate.x !== x || coordinate.y !== y
    );

    if(ships[shipName].coordinates.length === 0){
        return res.json({ message: `You drowned a: ${shipName}!`, ships});
    }

    res.json({message: 'You hit a ship', ships});
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:5000');
})