import 'dotenv/config';
import { getDirName, join } from './src/utils.js';
import http from 'http';

const PORT = process.env.PORT;

const moduleUrl = import.meta.url;
const __dirname = getDirName(moduleUrl);

const HOST = '127.0.0.1';
const PORT = process.env.PORT;
const CONTENT_TYPE = 'application/json';

const apiBaseUrl = '/api/users';
const storageFilePath = join(__dirname, 'src', 'storage.json');

const server = http.createServer(async (req, res) => {
  const method = req.method.toUpperCase();
  const address = req.url;
  const query = method + ' ' + address;
  const userId = address.slice((apiBaseUrl + '/').length);

  console.info('-----------');
  console.info(method);
  console.info(address);
  console.info(userId);

  try {
    res.setHeader('Content-Type', CONTENT_TYPE);

    switch (query) {
      case `GET /api/users`:
        break;
      case `GET /api/users/${userId}`:
        break;
      case `POST /api/users`:
        // POST api/users - add new user to database
        break;
      case `PUT /api/users/${userId}`:
        // PUT api/users/{userId} - update existing user
        break;
      case `DELETE /api/users/${userId}`:
        // DELETE api/users/${userId} - delete existing user from database
        break;
      default:
        res.writeHead(404);
        res.end(JSON.stringify([{message: `Sorry, this is wrong request url. Please, visit valid url.`}]));
        break;
    }
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify([{message: `Sorry, something went wrong. Please, try again.`}]));
  }
});

server.listen(PORT, HOST, () => {
  console.info('Listening to requests...');
});
