import { readFile } from 'fs/promises';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

let db = [];
let storageFilePath = '';

const loadDB = async (jsonFilePath) => {
  try {
    storageFilePath = jsonFilePath;
    const contents = await readFile(jsonFilePath, { encoding: 'utf-8' });
    db = await JSON.parse(contents);
  } catch (error) {
    console.error('Error processing the database');
  }
};

const writeDB = async (data, filePath = storageFilePath) => {
  db = data;

  try {
    await writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    console.error('Error processing the database');
  }
};

const getAllUsers = () => {
  return db;
};

const findUser = (uid) => {
  return db.find((user) => user.id === uid);
};

const addUser = async ({ username, age, hobbies }) => {

  if (!username || !age || !hobbies) {
    const missingFields = [{ username }, { age }, { hobbies }].map((item) => {
      const [ key, value ] = Object.entries(item)[0];

      if (!value) {
        return key;
      }

      return false;
    }).filter((item) => item);

    return { message: `Required fields (${missingFields.join(', ')}) are missing.`, is: false };
  }

  const id = uuidv4();
  const userObj = { id, username, age, hobbies };

  db.push(userObj);

  await writeDB(db);

  return { message: `User added`, record: userObj, is: true };
};

const deleteUser = async (uid) => {
  const filtered = db.filter((user) => user.id !== uid);

  await writeDB(filtered);

  return { message: `User with id ${uid} deleted.` };
};

const updateUser = async (uid, { username, age, hobbies }) => {
  let updatedRecord = null;

  const mapped = db.map((user) => {
    if (user.id === uid) {
      user.username = username || user.username;
      user.age = age || user.age;
      user.hobbies = hobbies || user.hobbies;

      updatedRecord = {};
      updatedRecord.id = user.id;
      updatedRecord.username = user.username;
      updatedRecord.age = user.age;
      updatedRecord.hobbies = user.hobbies;
    }

    return user;
  });

  await writeDB(mapped);

  return { message: `User with id ${uid} successfully updated.`, record: updatedRecord };
};

export { loadDB, writeDB, getAllUsers, findUser, addUser, deleteUser, updateUser };
