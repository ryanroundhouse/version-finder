import { Dependency } from '@version-finder/version-finder-lib';
import VersionFinder from './VersionFinder';
import { VersionManager } from './VersionManager';
import * as path from 'path';

export class VersionFinderApi {
  versionFinder: VersionFinder;

  constructor() {
    const versionManager = new VersionManager([], []);
    versionManager.loadDependenciesFromFile(
      path.resolve(__dirname, 'assets/sampleDependencies.json')
    );
    versionManager.loadFamiliesFromFile(
      path.resolve(__dirname, 'assets/sampleFamilies.json')
    );
    this.versionFinder = new VersionFinder(versionManager);
  }
  whatProductsCanIRunWithDependency(dependencies: Dependency[]): Dependency[] {
    return this.versionFinder.whatProductsCanIRunWithDependency(dependencies);
  }
}
