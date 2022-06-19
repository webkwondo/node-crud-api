import 'dotenv/config';
import { getDirName, join } from './src/utils.js';

const PORT = process.env.PORT;

const moduleUrl = import.meta.url;
const __dirname = getDirName(moduleUrl);

const HOST = '127.0.0.1';
const PORT = process.env.PORT;
const CONTENT_TYPE = 'application/json';

const apiBaseUrl = '/api/users';
const storageFilePath = join(__dirname, 'src', 'storage.json');

