import cluster from 'cluster';
import { cpus } from 'os';

const cpusNum = cpus().length;

const balanceLoad = async (fn: () => {}) => {
  if (cluster.isPrimary) {
    console.info(`Primary process ${process.pid} started`);

    for (let i = 0; i < cpusNum; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.info(`Worker ${worker.process.pid} died`);
    });
  } else {

    if (fn) {
      await fn();
    }

    console.info(`Worker ${process.pid} started`);
  }
};

export default balanceLoad;
