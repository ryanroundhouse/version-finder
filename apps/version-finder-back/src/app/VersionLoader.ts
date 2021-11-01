import { Dependency, Family } from '@version-finder/version-finder-lib';

export interface VersionLoader {
  getDependencies(): Dependency[];
  getFamilies(): Family[];
  addFamily(newFamily: Family): boolean;
  addDependency(newDependency: Dependency): boolean;
}
