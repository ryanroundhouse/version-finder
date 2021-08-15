import { Dependency, Family } from '@version-finder/version-finder-lib';
import * as express from 'express';
import { VersionFinderApi } from './app/version-finder-api';

const app = express();
const versionFinderApi = new VersionFinderApi();

app.use(express.json());
app.use(express.urlencoded());

app.get('/api', (req, res) => {
  const deps: Dependency[] = [];
  deps.push(new Dependency(1, new Family(), '1.0', true, []));
  res.send(JSON.stringify(deps));
});

// [{"id":1,"family":{"id":0.5835383464402961},"version":"1.0","supported":true,"dependencies":[]}]

app.post('/supported-products', (req, res) => {
  console.log(req.body);
  const dependencies: Dependency[] = JSON.parse(req.body.dependencies);
  res.send(versionFinderApi.whatProductsCanIRunWithDependency(dependencies));
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(
    `Listening at http://localhost:${port}/api and http://localhost:${port}/supported-products`
  );
});
server.on('error', console.error);
