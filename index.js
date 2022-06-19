import 'dotenv/config';
import { getDirName, join } from './src/utils.js';
import http from 'http';
import { loadDB } from './src/models/user-model.js';
import { handleAllUsersRequest, handleUserRequest } from './src/controllers/user-controller.js';

const moduleUrl = import.meta.url;
const __dirname = getDirName(moduleUrl);

const HOST = '127.0.0.1';
const PORT = process.env.PORT;
const CONTENT_TYPE = 'application/json';

const apiBaseUrl = '/api/users';
const storageFilePath = join(__dirname, 'src', 'storage.json');

await loadDB(storageFilePath);

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
        await handleAllUsersRequest(res);
        break;
      case `GET /api/users/${userId}`:
        await handleUserRequest('GET', req, res, userId);
        break;
      case `POST /api/users`:
        // POST api/users - add new user to database
        await handleUserRequest('POST', req, res);
        break;
      case `PUT /api/users/${userId}`:
        // PUT api/users/{userId} - update existing user
        await handleUserRequest('PUT', req, res, userId);
        break;
      case `DELETE /api/users/${userId}`:
        // DELETE api/users/${userId} - delete existing user from database
        await handleUserRequest('DELETE', req, res, userId);
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
