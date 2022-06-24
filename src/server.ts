import http from 'http';
import { loadDB } from './models/user-model';
import { handleAllUsersRequest, handleUserRequest } from './controllers/user-controller';

const CONTENT_TYPE = 'application/json';
const apiBaseUrl = '/api/users';

const makeServer = async (storageFilePath: string) => {

  await loadDB(storageFilePath);

  const server = http.createServer(async (req, res) => {
    const method = req?.method?.toUpperCase() ?? '';
    const address = req.url;
    const query = method + ' ' + address;
    const userId = address?.slice((apiBaseUrl + '/').length) ?? '';

    console.info('-----------');
    console.info(method);
    console.info(address);
    if (userId) { console.info(userId) };

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

  return server;
};

const stopServer = async (server: http.Server) => {
  server.close();
};

export { makeServer, stopServer };
