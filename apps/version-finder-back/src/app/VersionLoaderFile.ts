import { Dependency, Family } from '@version-finder/version-finder-lib';
import * as fs from 'fs';
import { VersionLoader } from './VersionLoader';

export class VersionLoaderFile implements VersionLoader {
  dependencyFilePath: string;
  familyFilePath: string;

  constructor(familyFilePath: string, dependencyFilePath: string) {
    this.familyFilePath = familyFilePath;
    this.dependencyFilePath = dependencyFilePath;
  }

  getDependencies(): Dependency[] {
    return this.loadDependenciesFromFile(this.dependencyFilePath);
  }
  getFamilies(): Family[] {
    return this.loadFamiliesFromFile(this.familyFilePath);
  }
  addFamily(newFamily: Family): boolean {
    const families = this.getFamilies();
    families.push(newFamily);
    this.writeFamiliesToFile(this.familyFilePath, families);
    return true;
  }
  addDependency(newDependency: Dependency): boolean {
    const dependencies = this.getDependencies();
    dependencies.push(newDependency);
    this.writeDependenciesToFile(this.dependencyFilePath, dependencies);
    return true;
  }

  loadDependenciesFromFile(filePath: string): Dependency[] {
    const dependencies: Dependency[] = [];
    const buffer = fs.readFileSync(filePath);
    const dependencyObjects: Dependency[] = JSON.parse(buffer.toString());
    dependencyObjects.forEach((dependencyObject) => {
      dependencies.push(
        Object.assign(
          new Dependency(-1, null, '-1', true, []),
          dependencyObject
        )
      );
    });
    return dependencies;
  }

  loadFamiliesFromFile(filePath: string): Family[] {
    const families: Family[] = [];
    const buffer = fs.readFileSync(filePath);
    const familyObjects: Family[] = JSON.parse(buffer.toString());
    familyObjects.forEach((familyObject) => {
      families.push(Object.assign(new Family(-1, ''), familyObject));
    });
    return families;
  }

  writeFamiliesToFile(filePath: string, families: Family[]) {
    fs.writeFile(filePath, JSON.stringify(families), (err) => {
      if (err) {
        console.log('File write failed:', err);
        return;
      }
    });
  }

  writeDependenciesToFile(filePath: string, dependencies: Dependency[]) {
    fs.writeFile(filePath, JSON.stringify(dependencies), (err) => {
      if (err) {
        console.log('File write failed:', err);
        return;
      }
    });
  }
}
