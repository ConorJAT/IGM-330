const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/random-word', function(req, res){
    const words = ["Puppies", "Kittens", "Frogs", "Curry Chicker", "Snowman"];
})

console.log(`Listening on port: ${PORT}`);
app.listen(PORT);