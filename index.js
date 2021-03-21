import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

console.log(process.env.DB_PASS);

// const url = process.env.MONGODB_URI;
// const url = 'mongodb+srv://dusicazeravic:Gdle7RkRwfPpr9Ef@cluster0.tcnrl.mongodb.net/jobFinderDatabase?retryWrites=true&w=majority';
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tcnrl.mongodb.net/jobFinderDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(() => {
    console.log('Connected to Mongo!');
})
.catch((err) => {
    console.error('Error connecting to Mongo', err);
});;

const todoSchema = new mongoose.Schema({
    text: String,
    done: Boolean
});

const Todo = mongoose.model('Todo', todoSchema);

const userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    confirm_password: String
})

const User = mongoose.model('User', userSchema);

const defaultEndpoint = (_, res) => {
    res.status(404).send({ error: "Unknown path." });
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

const TODOS = '/todos';
const USERS = '/users';

app.get(USERS, (_, res) => {
    User.find({}).then(result => {
        res.json(result);
    })
})

app.get(`${USERS}/:id`, (req, res) => {
    const id = req.params.id;

    User.findById(id).then(result => {
        if(result) res.json(result)
        else res.status(404).end()
    })
    .catch(error => {
        console.log(error);
        res.status(500).end();
    })
})

app.post(USERS, (req, res) => {
    const newUser = new User({
        ...req.body
    })

    newUser.save().then(result => {
        res.json(result)
    })
})

app.get(TODOS, (_, res) => {
    Todo.find({}).then(result => {
        res.json(result);
    })
});

app.get(`${TODOS}/:id`, (req, res) => {
    const id = req.params.id;

    Todo.findById(id).then(result => {
        if (result) res.json(result)
        else res.status(404).end()
    })
        .catch(error => {
            res.status(500).end();
        })
});

app.post(TODOS, (req, res) => {
    const newItem = new Todo({
        ...req.body
    });
    
    newItem.save().then(result => {
        res.json(result);
    })
});

app.delete(`${TODOS}/:id`, (req, res) => {
    Todo.findOne({_id: req.params.id}, (error, todo) => {
        if(error) {
            console.log('nije obrisan')
        } else {
            console.log('deleted');
            todo.remove();
            res.json(todo);
        }
    })
})

app.use(defaultEndpoint);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
})