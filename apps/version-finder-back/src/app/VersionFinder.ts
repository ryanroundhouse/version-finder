import { Dependency, Family } from '@version-finder/version-finder-lib';

import { VersionManager } from './VersionManager';

export class VersionFinder {
  versionManager: VersionManager;

  constructor(versionManager: VersionManager) {
    this.versionManager = versionManager;
  }

  findDependencyById(id: number) {
    return this.versionManager.dependencies.find((dep) => {
      return dep.id === id;
    });
  }

  whatProductsCanIRunWithDependency(
    productsToQuery: Dependency[]
  ): Dependency[] {
    const foundDependencies: Dependency[] = [];

    const allFamilies: Family[] = this.getFamiliesFromDependencies(
      this.versionManager.getDependencies()
    );
    const searchFamilies: Family[] =
      this.getFamiliesFromDependencies(productsToQuery);

    allFamilies.forEach((family) => {
      const familyReleases =
        this.versionManager.getDependenciesByFamily(family);
      familyReleases.forEach((familyRelease) => {
        if (
          familyRelease.dependencies.some((dependencyId) => {
            const dependency = this.findDependencyById(dependencyId);
            return (
              searchFamilies.find((family) => {
                return family.id === dependency.family;
              }) != null
            );
          })
        ) {
          if (
            familyRelease.supported &&
            !this.isTooNew(familyRelease, productsToQuery)
          ) {
            foundDependencies.push(familyRelease);
          }
        }
      });
    });

    const foundDependenciesWithLatestFromEachFamily: Dependency[] =
      this.removeEarlierDependenciesFromDuplicateFamilies(
        foundDependencies,
        allFamilies
      );

    return foundDependenciesWithLatestFromEachFamily;
  }

  isTooNew(familyRelease: Dependency, productsToQuery: Dependency[]): boolean {
    let isTooNew = false;
    familyRelease.dependencies.forEach((familyDependency) => {
      const resolvedDependency = this.findDependencyById(familyDependency);
      const productToQuery = productsToQuery.find((productToQuery) => {
        return resolvedDependency.family === productToQuery.family;
      });
      if (Dependency.isGreaterThan(productToQuery, resolvedDependency)) {
        isTooNew = true;
      }
    });
    return isTooNew;
  }

  findSubDependencies(
    dependencies: Dependency[],
    families: Family[]
  ): Dependency[] {
    dependencies.forEach((dependency) => {
      dependency.dependencies.forEach((subDependency) => {
        const resolvedDependency = this.findDependencyById(subDependency);
        if (resolvedDependency.supported) {
          dependencies.push(resolvedDependency);
        }
      });
    });
    const newFamilies = this.getFamiliesFromDependencies(dependencies);
    if (newFamilies > families) {
      return this.findSubDependencies(dependencies, newFamilies);
    } else {
      return dependencies;
    }
  }

  findDependenciesFor(searchDependencies: Dependency[]): Dependency[] {
    const searchDependencyFamilies =
      this.getFamiliesFromDependencies(searchDependencies);
    const foundDependencies = this.findSubDependencies(
      searchDependencies,
      searchDependencyFamilies
    );
    const foundFamilies: Family[] =
      this.getFamiliesFromDependencies(foundDependencies);
    const foundDependenciesWithLatestFromEachFamily: Dependency[] =
      this.removeEarlierDependenciesFromDuplicateFamilies(
        foundDependencies,
        foundFamilies
      );

    const result = [...new Set(foundDependenciesWithLatestFromEachFamily)];
    return result;
  }

  getFamiliesFromDependencies(foundDependencies: Dependency[]): Family[] {
    const familyIds = [
      ...new Set(
        foundDependencies.map((dependency) => {
          return dependency.family;
        })
      ),
    ];
    const families: Family[] = [];
    familyIds.forEach((familyId) => {
      families.push(
        this.versionManager.families.find((family) => family.id === familyId)
      );
    });
    return families;
  }

  removeEarlierDependenciesFromDuplicateFamilies(
    foundDependencies: Dependency[],
    foundFamilies: Family[]
  ): Dependency[] {
    foundDependencies.sort(Dependency.compare);

    foundFamilies.forEach((foundFamily) => {
      const dependenciesByFamily = foundDependencies.filter(
        (foundDependency) => {
          return foundDependency.family === foundFamily.id;
        }
      );
      if (dependenciesByFamily.length > 1) {
        let dontRemoveThisOne = true;
        dependenciesByFamily.forEach((dep) => {
          if (dontRemoveThisOne) {
            dontRemoveThisOne = false;
          } else {
            const dependencyIndexToRemove = foundDependencies.indexOf(dep);
            foundDependencies.splice(dependencyIndexToRemove, 1);
          }
        });
      }
    });
    return foundDependencies;
  }
}

export default VersionFinder;
