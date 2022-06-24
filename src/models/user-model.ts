import { readFile, writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { getDirName, join } from '../utils';

const moduleUrl = import.meta.url;
const __dirname = getDirName(moduleUrl);

type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};

type UserData = {
  username: string;
  age: number;
  hobbies: string[];
};

let db: User[] = [];
let storageFilePath = join(__dirname, '..', 'data.json');

const loadDB = async (jsonFilePath: string) => {
  try {
    if (jsonFilePath) {
      storageFilePath = jsonFilePath;
      const contents = await readFile(jsonFilePath, { encoding: 'utf-8' });
      db = (contents) ? await JSON.parse(contents) : [];
    } else {
      db = [];
      await writeFile(storageFilePath, JSON.stringify(db));
    }
  } catch (error) {
    console.error('Error processing the database');
  }
};

const writeDB = async (data: User[], filePath = storageFilePath) => {
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

const findUser = (uid: string) => {
  return db.find((user) => user.id === uid);
};

const validateUserFields = ({ username, age, hobbies }: UserData) => {
  // if (!username && !age && !hobbies) {
  //   return { message: `No fields to validate.`, is: false };
  // }

  if (username && typeof username !== 'string') {
    return { message: `Required field 'username' must be a string.`, is: false };
  }

  if (age && typeof age !== 'number') {
    return { message: `Required field 'age' must be a number.`, is: false };
  }

  const checkArrayOfStrings = (arr: string[]) => {
    return (Array.isArray(arr)) ? arr.every((i) => (typeof i === 'string')) : false;
  };

  if (hobbies && !checkArrayOfStrings(hobbies)) {
    return { message: `Required field 'hobbies' must be array of strings.`, is: false };
  }

  return { message: `The required fields are valid.`, is: true };
};

const addUser = async ({ username, age, hobbies }: UserData) => {

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

  const validity = validateUserFields({ username, age, hobbies });

  if (!validity.is) {
    return { message: validity.message, is: false };
  }

  const id = uuidv4();
  const userObj = { id, username, age, hobbies };

  db.push(userObj);

  await writeDB(db);

  return { message: `User added`, record: userObj, is: true };
};

const deleteUser = async (uid: string) => {
  const filtered = db.filter((user) => user.id !== uid);

  await writeDB(filtered);

  return { message: `User with id ${uid} deleted.` };
};

const updateUser = async (uid: string, { username, age, hobbies }: UserData) => {
  let updatedRecord: null | User = null;

  const mapped = db.map((user) => {
    if (user.id === uid) {
      user.username = username || user.username;
      user.age = age || user.age;
      user.hobbies = hobbies || user.hobbies;

      updatedRecord = {
        id: user.id,
        username: user.username,
        age: user.age,
        hobbies: user.hobbies
      };
    }

    return user;
  });

  await writeDB(mapped);

  return { message: `User with id ${uid} successfully updated.`, record: updatedRecord };
};

export { loadDB, writeDB, getAllUsers, findUser, addUser, deleteUser, updateUser, User };
