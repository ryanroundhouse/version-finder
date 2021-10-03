import { Dependency, Family } from '@version-finder/version-finder-lib';
import * as express from 'express';
import { VersionFinderApi } from './app/version-finder-api';
import * as cors from 'cors';
import { VersionManagerApi } from './app/version-manager-api';
import path = require('path');
import * as compression from 'compression';

const app = express();
const versionFinderApi = new VersionFinderApi();
const versionManagerApi = new VersionManagerApi();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(compression());

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

app.post('/families/add', (req, res) => {
  const newFamily: Family = JSON.parse(req.body.family);
  const result = versionManagerApi.addFamily(newFamily);
  res.send(result);
});

app.post('/dependencies/add', (req, res) => {
  const newRelease: Dependency = JSON.parse(req.body.dependency);
  const result = versionManagerApi.addRelease(newRelease);
  res.send(result);
});

app.post('/dependencies/delete', (req, res) => {
  const releaseToDelete: Dependency = JSON.parse(req.body.dependency);
  const result = versionManagerApi.deleteRelease(releaseToDelete);
  res.send(result);
});

app.post('/families/update', (req, res) => {
  const newFamily: Family = JSON.parse(req.body.family);
  const result = versionManagerApi.updateFamily(newFamily);
  res.send(result);
});

app.get('/families/get', (req, res) => {
  res.send(versionManagerApi.getAllFamilies());
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
    res.send(versionManagerApi.getAllDependencies());
  }
});

app.post('/dependencies/update', (req, res) => {
  const updatedDependency: Dependency = JSON.parse(req.body.dependency);
  const result = versionManagerApi.updateDependency(updatedDependency);
  res.send(result);
});

app.use(express.static(__dirname + '/front'));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

const port = process.env.port || 80;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
server.on('error', console.error);
