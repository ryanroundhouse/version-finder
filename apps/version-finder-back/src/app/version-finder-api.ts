import { Release, Product } from '@version-finder/version-finder-lib';
import VersionFinder from './VersionFinder';
import { VersionManager } from './VersionManager';
import * as path from 'path';
import { VersionLoaderFile } from './VersionLoaderFile';

export class VersionFinderApi {
  versionManager: VersionManager;
  versionFinder: VersionFinder;

  constructor() {
    const versionLoaderFile = new VersionLoaderFile(
      path.resolve(__dirname, 'assets/sampleProducts.json'),
      path.resolve(__dirname, 'assets/sampleReleases.json')
    );
    this.versionManager = new VersionManager(versionLoaderFile);
    this.versionFinder = new VersionFinder(this.versionManager);
  }

  getAllProducts(): Product[] {
    return this.versionManager.getProducts();
  }

  getAllReleases(): Release[] {
    return this.versionManager.getReleases();
  }

  getReleasesForProductIdList(ids: number[]): Release[] {
    const Releases: Release[] = [];
    ids.forEach((id) => {
      const dep = this.versionFinder.findReleaseById(id);
      if (dep) {
        Releases.push(dep);
      } else {
        console.log(
          `Warning - getReleasesForProductIdList contained an id that didnt exist.  It is being ignored.`
        );
      }
    });
    const result = this.versionFinder.findReleasesFor(Releases);
    return result;
  }
}
