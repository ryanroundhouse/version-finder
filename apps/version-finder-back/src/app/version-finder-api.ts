import { Dependency, Family } from '@version-finder/version-finder-lib';
import VersionFinder from './VersionFinder';
import { VersionManager } from './VersionManager';
import * as path from 'path';
import { VersionLoaderFile } from './VersionLoaderFile';

export class VersionFinderApi {
  versionManager: VersionManager;
  versionFinder: VersionFinder;

  constructor() {
    const versionLoaderFile = new VersionLoaderFile(
      path.resolve(__dirname, 'assets/sampleFamilies.json'),
      path.resolve(__dirname, 'assets/sampleDependencies.json')
    );
    this.versionManager = new VersionManager(versionLoaderFile);
    this.versionFinder = new VersionFinder(this.versionManager);
  }

  getAllFamilies(): Family[] {
    return this.versionManager.getFamilies();
  }

  getAllDependencies(): Dependency[] {
    return this.versionManager.getDependencies();
  }

  getDependenciesForProductIdList(ids: number[]): Dependency[] {
    const dependencies: Dependency[] = [];
    ids.forEach((id) => {
      const dep = this.versionFinder.findDependencyById(id);
      if (dep) {
        dependencies.push(dep);
      } else {
        console.log(
          `Warning - getDependenciesForProductIdList contained an id that didnt exist.  It is being ignored.`
        );
      }
    });
    const result = this.versionFinder.findDependenciesFor(dependencies);
    return result;
  }
}
