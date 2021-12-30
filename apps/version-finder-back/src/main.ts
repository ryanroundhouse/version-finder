import { Release, Product } from '@version-finder/version-finder-lib';
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
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(compression());

app.post('/find-Releases', (req, res) => {
  console.log(`got a request to find Releases for ${req.body.Releases}`);
  const Releases: Release[] = JSON.parse(req.body.Releases);
  const result = versionFinderApi.versionFinder.findReleasesFor(Releases);
  console.log(`found the following Releases ${JSON.stringify(result)}`);
  res.send(result);
});

app.post('/Products/add', (req, res) => {
  const newProduct: Product = JSON.parse(req.body.Product);
  const result = versionManagerApi.addProduct(newProduct);
  res.send(result);
});

app.post('/Releases/add', (req, res) => {
  const newRelease: Release = JSON.parse(req.body.Release);
  const result = versionManagerApi.addRelease(newRelease);
  res.send(result);
});

app.post('/Releases/delete', (req, res) => {
  const releaseToDelete: Release = JSON.parse(req.body.Release);
  const result = versionManagerApi.deleteRelease(releaseToDelete);
  res.send(result);
});

app.post('/Products/delete', (req, res) => {
  const productToDelete: Product = JSON.parse(req.body.Product);
  const result = versionManagerApi.deleteProduct(productToDelete);
  res.send(result);
});

app.post('/Products/update', (req, res) => {
  const newProduct: Product = JSON.parse(req.body.Product);
  const result = versionManagerApi.updateProduct(newProduct);
  res.send(result);
});

app.get('/Products/get', (req, res) => {
  res.send(versionManagerApi.getAllProducts());
});

app.get('/Releases/get', (req, res) => {
  let ids: number[];
  if (req.query.id) {
    ids = req.query.id
      .toString()
      .split(',')
      .map((x) => +x);
  }
  if (ids) {
    res.send(versionFinderApi.getReleasesForProductIdList(ids));
  } else {
    res.send(versionManagerApi.getAllReleases());
  }
});

app.post('/Releases/update', (req, res) => {
  const updatedRelease: Release = JSON.parse(req.body.Release);
  const result = versionManagerApi.updateRelease(updatedRelease);
  res.send(result);
});

app.use(express.static(__dirname + '/front'));
app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
server.on('error', console.error);
