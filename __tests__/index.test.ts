import request from 'supertest';
import { makeServer, stopServer } from '../src/server';
import { User } from '../src/models/user-model';
import { getDirName, join } from '../src/utils';
import { writeFile, unlink } from 'fs/promises';

const moduleUrl = import.meta.url;
const __dirname = getDirName(moduleUrl);

const dbFilePath = join(__dirname, 'storage.json');

const writeEmptyDbFile = async (filePath = dbFilePath) => {
  try {
    await writeFile(filePath, '');
  } catch (error) {
    console.error('Error creating database');
  }
};

const deleteDbFile = async (filePath = dbFilePath) => {
  try {
    await unlink(filePath);
  } catch (error) {
    console.error('Error deleting test database');
  }
};

await writeEmptyDbFile();
const server = await makeServer(dbFilePath);

describe('Scenario 1', () => {

  beforeAll(async () => {
    await writeEmptyDbFile();
  });

  afterAll(async () => {
    await writeEmptyDbFile();
  });

  let uid = '';
  let user: User;

  it('should get all records with a GET api/users request, an empty array is expected', async () => {
    const response = await request(server).get('/api/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create new user object by a POST api/users request, a response containing newly created record is expected', async () => {
    const response = await request(server).post('/api/users').send({
      username: 'john',
      age: 34,
      hobbies: ['Acting', 'Writing', 'Singing']
    });

    uid = response.body[0].record.id;
    user = response.body[0].record;

    expect(response.statusCode).toBe(201);
    expect(response.body[0].message).toEqual('User added');
    expect(response.body[0].record.username).toEqual('john');
    expect(response.body[0].record.age).toEqual(34);
    expect(response.body[0].record.hobbies).toEqual(['Acting', 'Writing', 'Singing']);
  });

  it('should get the created record by its id with GET api/user/{userId} request, the created record is expected', async () => {
    const response = await request(server).get(`/api/users/${uid}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(user);
  });

  it('should update the created record with a PUT api/users/{userId} request, a response containing an updated object with the same id is expected', async () => {
    const response = await request(server).put(`/api/users/${uid}`).send({username: 'jack'});

    user.username = response.body[0].record.username;

    expect(response.statusCode).toBe(200);
    expect(response.body[0].record.username).toEqual('jack');
    expect(response.body[0].record).toEqual(user);
  });

  it('should delete the created object by id with a DELETE api/users/{userId} request', async () => {
    const response = await request(server).delete(`/api/users/${uid}`);

    expect(response.statusCode).toBe(204);
  });

  it('should try to get a deleted object by id with a GET api/users/{userId} request, but the expected answer is that there is no such an object', async () => {
    const response = await request(server).get(`/api/users/${uid}`);
    expect(response.statusCode).toBe(404);
    expect(response.body[0].message).toEqual(`The user with id ${uid} doesn't exist.`);
  });

});

describe('Scenario 2', () => {

  beforeAll(async () => {
    await writeEmptyDbFile();
  });

  afterAll(async () => {
    await writeEmptyDbFile();
  });

  let uid = '';
  let user: User;

  it('should try to get all records with a wrong GET api/use request url, a response with a corresponding message about wrong adress is expected', async () => {
    const response = await request(server).get('/api/use');
    expect(response.statusCode).toBe(404);
    expect(response.body[0].message).toEqual('Sorry, this is wrong request url. Please, visit valid url.');
  });

  it('should try to add new user by a POST api/users request, but the required fields are missing, a response containing corresponding message is expected', async () => {
    const response = await request(server).post('/api/users').send({
      username: 'samantha',
      age: 29
    });

    expect(response.statusCode).toBe(400);
    expect(response.body[0].message).toEqual('Required fields (hobbies) are missing.');
  });

  it('should create new user object by a POST api/users request, a response containing newly created record is expected', async () => {
    const response = await request(server).post('/api/users').send({
      username: 'samantha',
      age: 29,
      hobbies: ['Psychology', 'Reading', 'Writing']
    });

    uid = response.body[0].record.id;
    user = response.body[0].record;

    expect(response.statusCode).toBe(201);
    expect(response.body[0].message).toEqual('User added');
    expect(response.body[0].record.username).toEqual('samantha');
    expect(response.body[0].record.age).toEqual(29);
    expect(response.body[0].record.hobbies).toEqual(['Psychology', 'Reading', 'Writing']);
  });

  it('should try to get the record by id with GET api/user/{userId} request, but the id is not uuid, a response containing corresponding message is expected', async () => {
    const response = await request(server).get(`/api/users/dhd64ujgjggjffj`);
    expect(response.statusCode).toBe(400);
    expect(response.body[0].message).toEqual('The user id dhd64ujgjggjffj is invalid.');
  });

  it('should try to update the record with a PUT api/users/{userId} request, but the id is not uuid, a response containing corresponding message is expected', async () => {
    const response = await request(server).put(`/api/users/ouj25344kgdkj`).send({username: 'lion'});

    expect(response.statusCode).toBe(400);
    expect(response.body[0].message).toEqual('The user id ouj25344kgdkj is invalid.');
  });

  it('should try to delete the user by id with a DELETE api/users/{userId} request, but the id is not uuid, a response containing corresponding message is expected', async () => {
    const response = await request(server).delete(`/api/users/q74woijkdfj`);

    expect(response.statusCode).toBe(400);
    expect(response.body[0].message).toEqual('The user id q74woijkdfj is invalid.');
  });

});

describe('Scenario 3', () => {

  beforeAll(async () => {
    await writeEmptyDbFile();
  });

  afterAll(async () => {
    await stopServer(server);
    await deleteDbFile();
  });

  let uid = '';
  let user: User;

  it('should add new user by a POST api/users request with unnecessary fields, a response newly created record without unnecessary fields is expected', async () => {
    const response = await request(server).post('/api/users').send({
      username: 'lucky',
      age: 41,
      hobbies: ['Hicking'],
      someotherfield: 'string',
      andanotherfield: []
    });

    uid = response.body[0].record.id;
    user = response.body[0].record;

    expect(response.statusCode).toBe(201);
    expect(response.body[0].message).toBe('User added');
    expect(response.body[0].record.username).toBe('lucky');
    expect(response.body[0].record.age).toBe(41);
    expect(response.body[0].record.hobbies).toEqual(['Hicking']);
    expect(response.body[0].record.someotherfield).toBeUndefined();
    expect(response.body[0].record.andanotherfield).toBeUndefined();
  });

  it('should try to add a new user by a POST api/users request, but the format of required fields is wrong, a response containing corresponding message is expected', async () => {
    const response = await request(server).post('/api/users').send({
      username: 'adam',
      age: '39',
      hobbies: ['Cars']
    });

    expect(response.statusCode).toBe(400);
    expect(response.body[0].message).toBe('Required field \'age\' must be a number.');
  });

  it('should get all records with a GET api/users request, a successful response is expected', async () => {
    const response = await request(server).get('/api/users');
    expect(response.statusCode).toBe(200);
  });

  it('should try to update the record with a PUT api/users/{userId} request, but the id doesn\'t exist, a response containing corresponding message is expected', async () => {
    const response = await request(server).put(`/api/users/d9d66c78-cc02-4200-94cd-18de4849acd3`).send({username: 'lion'});

    expect(response.statusCode).toBe(404);
    expect(response.body[0].message).toBe('The user with id d9d66c78-cc02-4200-94cd-18de4849acd3 doesn\'t exist.');
  });

  it('should try to delete the user by id with a DELETE api/users/{userId} request, but the id doesn\'t exist, a response containing corresponding message is expected', async () => {
    const response = await request(server).delete(`/api/users/20cbca90-db20-40ad-b213-9128cced3a4c`);

    expect(response.statusCode).toBe(404);
    expect(response.body[0].message).toBe('The user with id 20cbca90-db20-40ad-b213-9128cced3a4c doesn\'t exist.');
  });

});
