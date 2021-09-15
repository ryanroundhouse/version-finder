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
    const foundDependenciesWithoutDuplicates = [
      ...new Set(foundDependenciesWithLatestFromEachFamily),
    ];
    const foundDependenciesWithout64if64m = this.remove64if64mPresent(
      foundDependenciesWithoutDuplicates
    );
    return foundDependenciesWithout64if64m;
  }

  remove64if64mPresent(dependencies: Dependency[]): Dependency[] {
    let cis64mDependency: Dependency;
    let cis64Dependency: Dependency;

    const cis64mFamily = this.versionManager.families.find((fam) => {
      return fam.name === 'CIS 6.4m';
    });
    if (cis64mFamily) {
      cis64mDependency = dependencies.find((dep) => {
        return dep.family === cis64mFamily.id;
      });
    }

    const cis64Family = this.versionManager.families.find((fam) => {
      return fam.name === 'CIS 6.4';
    });
    if (cis64Family) {
      cis64Dependency = dependencies.find((dep) => {
        return dep.family === cis64Family.id;
      });
    }

    if (cis64mDependency && cis64Dependency) {
      dependencies.splice(dependencies.indexOf(cis64Dependency), 1);
    }
    return dependencies;
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
