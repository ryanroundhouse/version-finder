import { Dependency, Family } from '@version-finder/version-finder-lib';

export interface VersionLoader {
  getDependencies(): Dependency[];
  getFamilies(): Family[];
}
