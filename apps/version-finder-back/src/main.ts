import { Dependency } from '@version-finder/version-finder-lib';
import * as express from 'express';
import { VersionFinderApi } from './app/version-finder-api';
import * as cors from 'cors';

const app = express();
const versionFinderApi = new VersionFinderApi();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.get('/api', (req, res) => {
  const deps: Dependency[] = [];
  deps.push(new Dependency(-1, -1, '1.0', true, []));
  res.send(JSON.stringify(deps));
});

app.post('/find-dependencies', (req, res) => {
  console.log(
    `got a request to find dependencies for ${req.body.dependencies}`
  );
  const dependencies: Dependency[] = JSON.parse(req.body.dependencies);
  const result =
    versionFinderApi.versionFinder.findDependenciesFor(dependencies);
  console.log(`found the following dependencies ${JSON.stringify(result)}`);
  res.send(result);
});

app.get('/families/get', (req, res) => {
  res.send(versionFinderApi.getAllFamilies());
});

app.get('/dependencies/get', (req, res) => {
  let ids: number[];
  if (req.query.id) {
    ids = req.query.id
      .toString()
      .split(',')
      .map((x) => +x);
  }
  if (ids) {
    res.send(versionFinderApi.getDependenciesForProductIdList(ids));
  } else {
    res.send(versionFinderApi.getAllDependencies());
  }
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
