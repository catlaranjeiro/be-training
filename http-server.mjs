// const { createServer } = require('node:http');
import { createServer } from 'node:http';

const hostname = '127.0.0.1';
const port = process.env.PORT;

const server = createServer((req, res) => {
  if (req.url === '/winter') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(JSON.stringify({ message: 'Winter is coming...' }));
    return;
  }
  if (req.url === '/spring') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Flowers are blossom!');
    res.end();
    return;
  }
  if (req.url === '/summer') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Summer is here!');
    res.end();
    return;
  }
  if (req.url === '/autumn') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Leaves are falling!');
    res.end();
    return;
  }
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain');
  res.end('Page not found');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
