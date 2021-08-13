/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { VersionFinderApi } from './app/version-finder-api';

const app = express();
const versionFinderApi = new VersionFinderApi();

app.use(express.json());
app.use(express.urlencoded());

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to version-finder-back!' });
});

app.post('/supported-products', (req, res) => {
  console.log(req.body);
  res.send(versionFinderApi.whatProductsCanIRunWithDependency([]));
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(
    `Listening at http://localhost:${port}/api and http://localhost:${port}/supported-products`
  );
});
server.on('error', console.error);
