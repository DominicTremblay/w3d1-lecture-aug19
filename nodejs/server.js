const http = require('http');
const fs = require('fs');
const todos = require('./todos');
const { uid } = require('./util');

const port = process.env.PORT || 3001;

// const requestListener = (req, res) => {
// extracting these from the req object
// const { url, method, headers, body } = req;

//Same as doing the following
// const url = req.url;
// const method = req.method;
// const headers = req.headers;

// console.log({ method }, { url });

// console.log(headers);

//   const { statusCode, write, end, setHeader } = res;

//   console.log(statusCode, write, end, setHeader);
// };

const renderIndex = (req, res) => {
  fs.readFile('./index.html', (err, content) => {
    if (err) {
      throw err;
    }

    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.write(content);
    res.end();
  });
};

const renderTodos = (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(todos));
  res.end();
};

const render404 = (req, res) => {
  fs.readFile('./404.html', (err, content) => {
    if (err) {
      throw err;
    }

    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 404;
    res.write(content);
    res.end();
  });
};

const getBody = (req, cb) => {
  let body = '';

  req.on('data', part => (body += part));

  req.on('error', err => cb(err));

  req.on('end', () => cb(null, body));
};

const addTodo = (req, res) => {
  // Extract the information from the body of the request
  getBody(req, (err, body) => {
    if (err) {
      throw err;
    }

    // Getting the type and description from the body
    const { type, description } = JSON.parse(body);

    // Create a newTodo object

    const id = uid();

    const newTodo = {
      id,
      type,
      description,
    };
    // Add the newTodo to the list of todos

    todos.push(newTodo);
    // Display the new list of todos
    renderTodos(req, res);
  });
};

// Creating an instance of an http server
const server = http.createServer((req, res) => {
  const { method, url, headers } = req;

  // if (method === 'GET') {
  //   if (url === '/') {
  //     renderIndex(req, res);
  //   } else if (url === '/todos') {
  //     renderTodos(req, res);
  //   }
  // }

  const routes = {
    'GET /': renderIndex,
    'GET /todos': renderTodos,
    'POST /todos': addTodo,
    '404': render404,
  };

  // 'GET / or GET /todos'
  const routePath = `${method} ${url}`;

  console.log({ routePath });

  let route = routes[routePath];

  // if route is undefined, fallback on the 404
  route = route || routes['404'];

  route(req, res);
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
