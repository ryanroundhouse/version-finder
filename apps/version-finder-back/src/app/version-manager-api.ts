import * as path from 'path';
import { VersionManager } from './VersionManager';
import { Dependency, Family } from '@version-finder/version-finder-lib';

export class VersionManagerApi {
  versionManager: VersionManager;
  constructor() {
    this.versionManager = new VersionManager([], []);
    this.versionManager.loadDependenciesFromFile(
      path.resolve(__dirname, 'assets/sampleDependencies.json')
    );
    this.versionManager.loadFamiliesFromFile(
      path.resolve(__dirname, 'assets/sampleFamilies.json')
    );
  }

  getAllFamilies(): Family[] {
    return this.versionManager.getFamilies();
  }

  getAllDependencies(): Dependency[] {
    return this.versionManager.getDependencies();
  }

  addFamily(newFamily: Family) {
    return this.versionManager.addFamily(newFamily);
  }

  updateFamily(newFamily: Family) {
    return this.versionManager.updateFamily(newFamily);
  }

  updateDependency(updatedDependency: Dependency) {
    return this.versionManager.updateDependency(updatedDependency);
  }
}
