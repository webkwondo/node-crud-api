import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// url should be import.meta.url
const getDirName = (url) => {
  const __filename = fileURLToPath(url);
  const __dirname = dirname(__filename);
  return __dirname;
};

export { getDirName, join };
