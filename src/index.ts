import 'dotenv/config';
import { getDirName, join, checkEnv } from './utils';
import { makeServer } from './server';
import balanceLoad from './multi';

const moduleUrl = import.meta.url;
const __dirname = getDirName(moduleUrl);

const HOST = '127.0.0.1';
const PORT = parseInt((process.env.PORT ?? '8000'), 10);

const dbFilePath = join(__dirname, 'storage.json');

if (checkEnv('APP_LOAD_MODE', 'multi')) {
  await balanceLoad(async () => {
    const server = await makeServer(dbFilePath);

    server.listen(PORT, HOST);
  });
} else {
  const server = await makeServer(dbFilePath);

  server.listen(PORT, HOST, () => {
    console.info('Listening to requests...');
  });
}
