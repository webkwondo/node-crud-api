import { validate as uuidValidate } from 'uuid';
import { getAllUsers, findUser, addUser, deleteUser, updateUser } from '../models/user-model';
import http from 'http';

const handleAllUsersRequest = async (res: http.ServerResponse) => {
  res.writeHead(200);
  res.end(JSON.stringify(getAllUsers()));
};

const handleUserRequest = async (method: string, req: http.IncomingMessage, res: http.ServerResponse, userId = '') => {

  const handleUser = async (uid: string, successCode = 200, action?: (id: string) => Promise<{}>) => {

    if (!uuidValidate(uid)) {
      res.writeHead(400);
      res.end(JSON.stringify([{message: `The user id ${uid} is invalid.`}]));
      return false;
    }

    let user = findUser(uid);
    // let msgObj: {message: string} | string;

    if (!user) {
      res.writeHead(404);
      res.end(JSON.stringify([{message: `The user with id ${uid} doesn't exist.`}]));
      return false;
    }

    try {
      if (action) {
        const msgObj = [ await action(uid) ];

        res.writeHead(successCode);
        res.end(JSON.stringify(msgObj));
        return true;
      }

      // res.writeHead(successCode);
    } catch (error) {
      throw error;
    }

    res.writeHead(successCode);
    res.end(JSON.stringify(user));
    return true;
  };

  const getReqBody = async () => {
    const buffer = [];

    for await (const chunk of req) {
      buffer.push(chunk);
    }

    const reqBody = Buffer.concat(buffer).toString();
    const parsedReqBody = JSON.parse(reqBody);

    return parsedReqBody;
  };

  let reqBodyData: {
    username: string;
    age: number;
    hobbies: string[];
  };

  switch (method) {
    case 'GET':
      await handleUser(userId);
      break;
    case 'POST':
      reqBodyData = await getReqBody();
      const result = await addUser(reqBodyData);
      const statusCode = (result.is) ? 201 : 400;
      const msg = (result.record) ? [{message: result.message, record: result.record}]
                                  : [{message: result.message}];

      res.writeHead(statusCode);
      res.end(JSON.stringify(msg));
      break;
    case 'PUT':
      reqBodyData = await getReqBody();

      await handleUser(userId, 200, async (uid: string) => {
        return await updateUser(uid, reqBodyData);
      });
      break;
    case 'DELETE':
      await handleUser(userId, 204, async (uid: string) => {
        return await deleteUser(uid);
      });
      break;
    default:
      break;
  }

};

export { handleAllUsersRequest, handleUserRequest };
