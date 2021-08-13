import { Dependency } from '@version-finder/version-finder-lib';
import VersionFinder from './VersionFinder';
import { VersionManager } from './VersionManager';

export class VersionFinderApi {
  versionFinder: VersionFinder;

  constructor() {
    this.versionFinder = new VersionFinder(new VersionManager([], []));
  }
  whatProductsCanIRunWithDependency(dependencies: Dependency[]): Dependency[] {
    return this.versionFinder.whatProductsCanIRunWithDependency(dependencies);
  }
}
