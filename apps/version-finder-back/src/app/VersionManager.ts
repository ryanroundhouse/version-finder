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
      return dependency.family === family;
    });
  }

  addDependency(dependency: Dependency): boolean {
    let result = false;
    if (dependency.dependencies.includes(dependency.id)) {
      return false;
    }
    const matchingDependency = this.dependencies.find((dep) => {
      return (
        dep.family === dependency.family && dep.version === dependency.version
      );
    });
    if (!matchingDependency) {
      if (this.families.includes(dependency.family)) {
        this.dependencies.push(dependency);
        result = true;
      }
    }
    return result;
  }

  loadDependenciesFromFile(filePath: string) {
    fs.readFile(filePath, 'utf8', (err, jsonString) => {
      if (err) {
        console.log('File read failed:', err);
        return;
      }
      console.log('File data:', jsonString);
      this.dependencies = JSON.parse(jsonString);
    });
  }

  loadFamiliesFromFile(filePath: string) {
    fs.readFile(filePath, 'utf8', (err, jsonString) => {
      if (err) {
        console.log('File read failed:', err);
        return;
      }
      console.log('File data:', jsonString);
      this.families = JSON.parse(jsonString);
    });
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
