import { Dependency, Family } from '@version-finder/version-finder-lib';
import { VersionLoader } from './VersionLoader';

export class VersionLoaderMemory implements VersionLoader {
  dependencies: Dependency[];
  families: Family[];

  constructor(families: Family[], dependencies: Dependency[]) {
    this.dependencies = dependencies;
    this.families = families;
  }

  getDependencies(): Dependency[] {
    return this.dependencies;
  }

  getFamilies(): Family[] {
    return this.families;
  }

  addFamily(newFamily: Family): boolean {
    return true;
  }

  addDependency(newDependency: Dependency): boolean {
    return true;
  }
}
