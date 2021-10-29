import * as path from 'path';
import { VersionManager } from './VersionManager';
import { Dependency, Family } from '@version-finder/version-finder-lib';
import { VersionLoaderFile } from './VersionLoaderFile';

export class VersionManagerApi {
  versionManager: VersionManager;
  constructor() {
    const versionLoaderFile = new VersionLoaderFile(
      path.resolve(__dirname, 'assets/sampleFamilies.json'),
      path.resolve(__dirname, 'assets/sampleDependencies.json')
    );
    this.versionManager = new VersionManager(versionLoaderFile);
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

  addRelease(newRelease: Dependency) {
    return this.versionManager.addDependency(newRelease);
  }

  deleteRelease(releaseToDelete: Dependency) {
    return this.versionManager.deleteDependency(releaseToDelete);
  }

  updateFamily(newFamily: Family) {
    return this.versionManager.updateFamily(newFamily);
  }

  updateDependency(updatedDependency: Dependency) {
    return this.versionManager.updateDependency(updatedDependency);
  }
}
