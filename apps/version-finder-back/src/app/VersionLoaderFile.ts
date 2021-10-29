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
}
