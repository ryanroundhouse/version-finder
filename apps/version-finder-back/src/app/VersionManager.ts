import { Dependency, Family } from '@version-finder/version-finder-lib';
import * as fs from 'fs';
import { VersionLoader } from './VersionLoader';

export class VersionManager {
  dependencies: Dependency[];
  families: Family[];
  versionLoader: VersionLoader;

  constructor(versionLoader: VersionLoader) {
    this.dependencies = versionLoader.getDependencies();
    this.families = versionLoader.getFamilies();
    this.versionLoader = versionLoader;
  }

  getFamilies(): Family[] {
    return this.families;
  }

  addFamily(newFamily: Family): boolean {
    if (!this.families.includes(newFamily)) {
      let lastId = 0;
      if (this.families.length > 0) {
        lastId = this.families[this.families.length - 1].id + 1;
      }
      newFamily.id = lastId;
      this.families.push(newFamily);
      this.versionLoader.addFamily(newFamily);
      return true;
    }
    return false;
  }

  deleteDependency(releaseToDelete: Dependency) {
    const indexOfRelease = this.dependencies.findIndex((rel) => {
      return rel.id === releaseToDelete.id;
    });
    if (indexOfRelease >= 0) {
      this.dependencies.splice(indexOfRelease, 1);
      return true;
    } else {
      return false;
    }
  }

  getDependencies(): Dependency[] {
    return this.dependencies;
  }

  getDependenciesByFamily(family: Family): Dependency[] {
    return this.dependencies.filter((dependency) => {
      return dependency.family === family.id;
    });
  }

  updateFamily(family: Family): boolean {
    const matchingFamily = this.families.find((fam) => {
      return fam.id === family.id;
    });
    if (matchingFamily) {
      matchingFamily.name = family.name;
      return true;
    } else {
      return false;
    }
  }

  updateDependency(updatedDependency: Dependency): boolean {
    const matchingDependency = this.dependencies.find((dep) => {
      return dep.id === updatedDependency.id;
    });
    if (matchingDependency) {
      matchingDependency.dependencies = updatedDependency.dependencies;
      matchingDependency.releaseDate = updatedDependency.releaseDate;
      matchingDependency.supported = updatedDependency.supported;
      matchingDependency.version = updatedDependency.version;
      return true;
    } else {
      return false;
    }
  }

  addDependency(dependency: Dependency): boolean {
    // can't depend on itself.
    if (dependency.dependencies.includes(dependency.id)) {
      return false;
    }
    // same family + dependency already exists
    const matchingDependency = this.dependencies.find((dep) => {
      return (
        dep.family === dependency.family && dep.version === dependency.version
      );
    });
    if (matchingDependency) {
      return false;
    }
    // family has to exist
    if (
      this.families.find((fam) => {
        return fam.id === dependency.family;
      })
    ) {
      const depWithMaxId = this.dependencies.reduce((p, c) => (p.id > c.id ? p : c));
      dependency.id = depWithMaxId.id + 1;
      this.dependencies.push(dependency);
      this.versionLoader.addDependency(dependency);
      return true;
    }
    return false;
  }
}
