// import mongoose from 'mongoose';

// const url = 'mongodb+srv://dusicazeravic:Gdle7RkRwfPpr9Ef@cluster0.tcnrl.mongodb.net/jobFinderDatabase?retryWrites=true&w=majority';

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

// const todoSchema = new mongoose.Schema({
//     text: String,
//     done: Boolean
// });

// const Todo = mongoose.model('Todo', todoSchema);

// const todo = new Todo({
//     text: 'nesto sto ce se pojaviti u bazi',
//     done: true
// });

// todo.save().then(res => {
//     console.log('todo snimljen');
//     mongoose.connection.close();
// })

// Todo.find({}).then(res => {
//     console.log(res);
//     mongoose.connection.close();
// })

