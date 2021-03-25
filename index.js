import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

console.log(process.env.MONGODB_URI);

const url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(() => {
    console.log('Connected to Mongo!');
})
.catch((err) => {
    console.error('Error connecting to Mongo', err);
});;

const jobSchema = new mongoose.Schema({
    title: String,
    location: String,
    seniority: String,
    category: String,
    createdAt: Date,
    snippet: String,
    job_description: String,
    company_info: {
        name: String,
        general_info: String,
        location: String,
        number_of_employees: String,
        contact: Array,
        link: String
    }
});

const Job = mongoose.model('Job', jobSchema);

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

const JOBS = '/jobs';
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

app.get(JOBS, (_, res) => {
    Job.find({}).then(result => {
        res.json(result);
    })
});

app.get(`${JOBS}/:id`, (req, res) => {
    const id = req.params.id;

    Job.findById(id).then(result => {
        if (result) res.json(result)
        else res.status(404).end()
    })
        .catch(error => {
            res.status(500).end();
        })
});

app.post(JOBS, (req, res) => {
    const newItem = new Todo({
        ...req.body
    });
    
    newItem.save().then(result => {
        res.json(result);
    })
});

app.delete(`${JOBS}/:id`, (req, res) => {
    Job.findOne({_id: req.params.id}, (error, todo) => {
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