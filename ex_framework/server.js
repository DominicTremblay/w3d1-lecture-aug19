const express = require('express');
const todos = require('./todos');
const bodyParser = require('body-parser');
const { uid } = require('./util');
const port = process.env.PORT || 3001;
const app = express();

// Tell express that static resources are in the public folder

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.set('view engine', 'ejs');

const addTodo = (type, description) => {
  const id = uid();

  const newTodo = {
    id,
    type,
    description,
  };

  todos.push(newTodo);
};

app.get('/', (req, res) => {
  // send back the static index.html

  res.statusCode(200).render('index');
});

app.get('/todos', (req, res) => {
  res.render('todos', { todos });
});

app.post('/todos', (req, res) => {
  // extract info from the body
  const { type, description } = req.body;

  addTodo(type, description);

  res.redirect('/todos');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
