const express = require('express');
const app = express();
const PORT = 3001;
const morgan = require('morgan');

morgan.token('body', req => {
    return JSON.stringify(req.body);
});

app.use(express.json());
app.use(morgan(':method :url :body'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

function generateId()  {
    return Math.floor(Math.random() *  1000);
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id ===  id);

    if (person){
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.get('/api/info', (request, response) => {
    const time = new Date();
    const numPersons = persons.length;

    response.send(`<p>Phonebook has info for ${numPersons} people.</p><p>${time.toString()}</p>`)
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const id = generateId();
    
    if(!request.body.name) {
        return response.status(400).json({
            error: 'name missing'
        });
    }

    if (!request.body.number) {
        return response.status(400).json({
            error: 'number missing'
        });
    }

    if (persons.find(person => person.name === request.body.name)) {
        return response.status(400).json({
            error: `${request.body.name} already exists in phonebook`
        });
    }
    
    const person = request.body;
    console.log(person);
    person.id = id;

    persons = persons.concat(person);

    response.json(person);
});

app.use(unknownEndpoint);


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});