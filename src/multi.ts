import cluster from 'cluster';
import { cpus } from 'os';

const cpusNum = cpus().length;

const balanceLoad = async (fn: (workerPort: number) => Promise<void>, port: number) => {
  if (cluster.isPrimary) {
    console.info(`Primary process ${process.pid} started`);

    for (let i = 0; i < cpusNum - 1; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      console.info(`Worker ${worker.process.pid} died`);
    });
  } else {
    const workerId = cluster?.worker?.id || 1;
    const workerPort = port + workerId;

    if (fn) {
      await fn(workerPort);
    }

    console.info(`Worker ${process.pid} started on port ${workerPort}`);
  }
};

export default balanceLoad;
