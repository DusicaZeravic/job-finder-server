import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const defaultEndpoint = (_, res) => {
    res.status(404).send({ error: "Nepoznata putanja."});
}

const app = express();
app.use(express.json());
app.use(cors());

morgan.token('content', (req, _) => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

const NUMBERS = '/numbers';

let numbers = [
    {
        id: 1,
        name: 'Pera',
        number: '+381 7260380'
    },
    {
        id: 2,
        name: 'Mark',
        number: '+381 0397262'
    }
]


app.get(NUMBERS, (_, res) => {
    res.json(numbers);
});

app.get(`${NUMBERS}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const item = numbers.find(k => k.id == id);
    
    if(item) {
        res.json(item);
    } else {
        res.status(404).send('Not Found');
    }
});

app.post(NUMBERS, (req, res) => {
    const newItem = req.body;
    const id = Math.max(0, ...numbers.map(number => number.id)) + 1;
    newItem.id = id;

    numbers.push(newItem);
    res.json(newItem);
});

app.delete(`${NUMBERS}/:id`, (req, res) => {
    const id = Number(req.params.id);
    numbers = numbers.filter(n => n.id !== id);

    res.status(204).end();
})

app.use(defaultEndpoint);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})