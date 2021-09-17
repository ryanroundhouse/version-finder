import { Dependency, Family } from '@version-finder/version-finder-lib';
import * as fs from 'fs';

export class VersionManager {
  dependencies: Dependency[];
  families: Family[];

  constructor(families: Family[], dependencies: Dependency[]) {
    this.dependencies = dependencies;
    this.families = families;
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
      return true;
    }
    return false;
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
      this.dependencies.push(dependency);
      return true;
    }
    return false;
  }

  loadDependenciesFromFile(filePath: string) {
    const buffer = fs.readFileSync(filePath);
    const dependencyObjects: Dependency[] = JSON.parse(buffer.toString());
    dependencyObjects.forEach((dependencyObject) => {
      this.dependencies.push(
        Object.assign(
          new Dependency(-1, null, '-1', true, []),
          dependencyObject
        )
      );
    });
  }

  loadFamiliesFromFile(filePath: string) {
    const buffer = fs.readFileSync(filePath);
    const familyObjects: Family[] = JSON.parse(buffer.toString());
    familyObjects.forEach((familyObject) => {
      this.families.push(Object.assign(new Family(-1, ''), familyObject));
    });
    // this.families = familyObjects;
  }

  writeDependenciesToFile(filePath: string) {
    fs.writeFile(filePath, JSON.stringify(this.dependencies), (err) => {
      if (err) {
        console.log('File write failed:', err);
        return;
      }
    });
  }

  writeFamiliesToFile(filePath: string) {
    fs.writeFile(filePath, JSON.stringify(this.families), (err) => {
      if (err) {
        console.log('File write failed:', err);
        return;
      }
    });
  }
}
