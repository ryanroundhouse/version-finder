import { expect } from 'chai';
import { Dependency, Family } from '@version-finder/version-finder-lib';

import VersionFinder from './VersionFinder';
import { VersionManager } from './VersionManager';
import path = require('path');

describe('get pre-reqs for releases', () => {
  it('should find a single entry when only that single entry exists', () => {
    const family = new Family(0, '0th');
    const dependency = new Dependency(Math.random(), family.id, '', true, []);
    const versionManager = new VersionManager([family], [dependency]);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result).has.same.members([dependency]);
  });
  it('should return only the entry when no dependency for search exist', () => {
    const dependencyFamily = new Family(0, '0th');
    const dependency = new Dependency(
      Math.random(),
      dependencyFamily.id,
      '',
      true,
      []
    );
    const unrelatedDependencyFamily = new Family(1, '1st');
    const unrelatedDependency = new Dependency(
      Math.random(),
      unrelatedDependencyFamily.id,
      '',
      true,
      []
    );
    const versionManager = new VersionManager(
      [dependencyFamily, unrelatedDependencyFamily],
      [dependency, unrelatedDependency]
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result).has.same.members([dependency]);
  });
  it('should return all dependency linked by dependency', () => {
    const relatedDependencyFamily = new Family(0, '0th');
    const relatedDependency = new Dependency(
      Math.random(),
      relatedDependencyFamily.id,
      '',
      true,
      []
    );
    const dependencyFamily = new Family(1, '1st');
    const dependency = new Dependency(
      Math.random(),
      dependencyFamily.id,
      '',
      true,
      [relatedDependency.id]
    );
    const versionManager = new VersionManager(
      [relatedDependencyFamily, dependencyFamily],
      [dependency, relatedDependency]
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result).has.same.members([dependency, relatedDependency]);
  });
  it('should return dependency of dependency', () => {
    const secondLevelDependencyFamily = new Family(0, '0th');
    const secondLevelDependency = new Dependency(
      Math.random(),
      secondLevelDependencyFamily.id,
      '',
      true,
      []
    );
    const firstLevelDependencyFamily = new Family(1, '1st');
    const firstLevelDependency = new Dependency(
      Math.random(),
      firstLevelDependencyFamily.id,
      '',
      true,
      [secondLevelDependency.id]
    );
    const dependencyFamily = new Family(2, '2nd');
    const dependency = new Dependency(
      Math.random(),
      dependencyFamily.id,
      '',
      true,
      [firstLevelDependency.id]
    );
    const versionManager = new VersionManager(
      [
        secondLevelDependencyFamily,
        firstLevelDependencyFamily,
        dependencyFamily,
      ],
      [dependency, firstLevelDependency, secondLevelDependency]
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([dependency]);
    expect(result).has.same.members([
      dependency,
      firstLevelDependency,
      secondLevelDependency,
    ]);
  });
  it('should look for deeper dependencies until no new families are discovered', () => {
    const superBottomFamily = new Family(0, '0th');
    const superBottomDependency = new Dependency(
      Math.random(),
      superBottomFamily.id,
      '',
      true,
      []
    );
    const bottomFamily = new Family(1, '1st');
    const bottomDependency = new Dependency(
      Math.random(),
      bottomFamily.id,
      '',
      true,
      [superBottomDependency.id]
    );
    const middleFamily = new Family(2, '2nd');
    const middleDependency = new Dependency(
      Math.random(),
      middleFamily.id,
      '',
      true,
      [bottomDependency.id]
    );
    const topFamily = new Family(3, '3rd');
    const topDependency = new Dependency(
      Math.random(),
      topFamily.id,
      '',
      true,
      [middleDependency.id]
    );

    const versionManager = new VersionManager(
      [superBottomFamily, bottomFamily, middleFamily, topFamily],
      [superBottomDependency, bottomDependency, middleDependency, topDependency]
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([topDependency]);
    expect(result).has.same.members([
      topDependency,
      middleDependency,
      bottomDependency,
      superBottomDependency,
    ]);
  });
  it('should only return a single dependency of each family', () => {
    const familyX = new Family(0, '0th');
    const firstDependencyFromFamilyX = new Dependency(
      Math.random(),
      familyX.id,
      '',
      true,
      []
    );
    const secondDependencyFromFamilyX = new Dependency(
      Math.random(),
      familyX.id,
      '',
      true,
      []
    );
    const searchDependencyWithFirstDependencyFamily = new Family(1, '1st');
    const searchDependencyWithFirstDependency = new Dependency(
      Math.random(),
      searchDependencyWithFirstDependencyFamily.id,
      '',
      true,
      [firstDependencyFromFamilyX.id]
    );
    const searchDependencyWithSecondDependencyFamily = new Family(2, '2nd');
    const searchDependencyWithSecondDependency = new Dependency(
      Math.random(),
      searchDependencyWithSecondDependencyFamily.id,
      '',
      true,
      [secondDependencyFromFamilyX.id]
    );

    const versionManager = new VersionManager(
      [
        familyX,
        searchDependencyWithFirstDependencyFamily,
        searchDependencyWithSecondDependencyFamily,
      ],
      [
        firstDependencyFromFamilyX,
        secondDependencyFromFamilyX,
        searchDependencyWithFirstDependency,
        searchDependencyWithSecondDependency,
      ]
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([
      searchDependencyWithFirstDependency,
      searchDependencyWithSecondDependency,
    ]);
    expect(result).has.same.members([
      searchDependencyWithFirstDependency,
      searchDependencyWithSecondDependency,
      firstDependencyFromFamilyX,
    ]);
  });
  it('should only return the latest dependency of each family', () => {
    const familyX = new Family(0, '0th');
    const olderDependencyFromFamilyX = new Dependency(
      Math.random(),
      familyX.id,
      '1.0',
      true,
      []
    );
    const newerDependencyFromFamilyX = new Dependency(
      Math.random(),
      familyX.id,
      '2.0',
      true,
      []
    );
    const searchDependencyWithFirstDependencyFamily = new Family(1, '1st');
    const searchDependencyWithFirstDependency = new Dependency(
      Math.random(),
      searchDependencyWithFirstDependencyFamily.id,
      '',
      true,
      [olderDependencyFromFamilyX.id]
    );
    const searchDependencyWithSecondDependencyFamily = new Family(2, '2nd');
    const searchDependencyWithSecondDependency = new Dependency(
      Math.random(),
      searchDependencyWithSecondDependencyFamily.id,
      '',
      true,
      [newerDependencyFromFamilyX.id]
    );

    const versionManager = new VersionManager(
      [
        familyX,
        searchDependencyWithFirstDependencyFamily,
        searchDependencyWithSecondDependencyFamily,
      ],
      [
        olderDependencyFromFamilyX,
        newerDependencyFromFamilyX,
        searchDependencyWithFirstDependency,
        searchDependencyWithSecondDependency,
      ]
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([
      searchDependencyWithFirstDependency,
      searchDependencyWithSecondDependency,
    ]);
    expect(result.includes(newerDependencyFromFamilyX)).to.be.true;
  });
  it('dont return a prerequisite that is no longer supported', () => {
    const unsupportedDependencyFamily = new Family(0, '0th');
    const unsupportedDependency = new Dependency(
      Math.random(),
      unsupportedDependencyFamily.id,
      '',
      false,
      []
    );
    const searchDependencyFamily = new Family(1, '1st');
    const searchDependency = new Dependency(
      Math.random(),
      searchDependencyFamily.id,
      '',
      true,
      [unsupportedDependency.id]
    );

    const versionManager = new VersionManager(
      [unsupportedDependencyFamily, searchDependencyFamily],
      [unsupportedDependency, searchDependency]
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([searchDependency]);
    expect(result).has.same.members([searchDependency]);
  });
  it('should resolve nested dependencies when loaded from files', () => {
    const nsBL64family = new Family(6, 'nsBL 6.4');
    const nsBL66family = new Family(5, 'nsBL 6.6');
    const cis64family = new Family(0, 'CIS 6.4');
    const cis66family = new Family(4, 'CIS 6.6');
    const cc6family = new Family(2, 'CC6');

    const cis64NsblDependency = new Dependency(
      16,
      cis64family.id,
      '6.4.20',
      true,
      []
    );
    const nsbl64Dependency = new Dependency(
      15,
      nsBL64family.id,
      '6.4.29',
      true,
      [cis64NsblDependency.id]
    );
    const cis66NsblDependency = new Dependency(
      7,
      cis66family.id,
      '6.6.8',
      true,
      []
    );
    const nsbl66Dependency = new Dependency(
      14,
      nsBL66family.id,
      '6.6.9',
      true,
      [cis66NsblDependency.id]
    );
    const cis66Dependency = new Dependency(
      9,
      cis66family.id,
      '6.6.5',
      true,
      []
    );
    const cis64Dependency = new Dependency(
      3,
      cis64family.id,
      '6.4.27',
      true,
      []
    );
    const cc6Dependency = new Dependency(13, cc6family.id, '6.7.2', true, [
      cis64Dependency.id,
      cis66Dependency.id,
      nsbl64Dependency.id,
      nsbl66Dependency.id,
    ]);
    const expectedDependencies = [
      cc6Dependency,
      nsbl66Dependency,
      cis66NsblDependency,
      nsbl64Dependency,
      cis64Dependency,
    ];

    const versionManager = new VersionManager([], []);
    versionManager.loadDependenciesFromFile(
      path.resolve(__dirname, '../assets/testDependencies.json')
    );
    versionManager.loadFamiliesFromFile(
      path.resolve(__dirname, '../assets/testFamilies.json')
    );

    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findDependenciesFor([cc6Dependency]);
    expect(JSON.stringify(result)).equals(JSON.stringify(expectedDependencies));
  });
});

describe('get releases for pre-req', () => {
  it('should find a single item if only one release exists', () => {
    const productToQueryFamily = new Family(0, '0th');
    const productToQuery = new Dependency(
      0,
      productToQueryFamily.id,
      '',
      true,
      []
    );
    const singleReleaseFamily = new Family(1, '1st');
    const singleRelease = new Dependency(1, singleReleaseFamily.id, '', true, [
      productToQuery.id,
    ]);
    const versionManager = new VersionManager(
      [productToQueryFamily, singleReleaseFamily],
      [singleRelease, productToQuery]
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithDependency([
      productToQuery,
    ]);
    expect(result).has.same.members([singleRelease]);
  });
  it('should find latest dependency that supports it', () => {
    const queryProductFamily = new Family(0, '0th');
    const queryProduct = new Dependency(
      Math.random(),
      queryProductFamily.id,
      '6.4',
      true,
      []
    );
    const tooNewQueryProduct = new Dependency(
      Math.random(),
      queryProductFamily.id,
      '6.5',
      true,
      []
    );

    const dependencyFamily = new Family(1, '1st');
    const tooOldDependency = new Dependency(
      Math.random(),
      dependencyFamily.id,
      '1.0',
      true,
      [queryProduct.id]
    );
    const justRightDependency = new Dependency(
      Math.random(),
      dependencyFamily.id,
      '2.0',
      true,
      [queryProduct.id]
    );
    const tooNewDependency = new Dependency(
      Math.random(),
      dependencyFamily.id,
      '3.0',
      true,
      [tooNewQueryProduct.id]
    );

    const versionManager = new VersionManager(
      [queryProductFamily, dependencyFamily],
      [
        queryProduct,
        tooNewQueryProduct,
        tooOldDependency,
        justRightDependency,
        tooNewDependency,
      ]
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithDependency([
      queryProduct,
    ]);
    expect(result).has.same.members([justRightDependency]);
  });
  it('shouldnt return dependencies that arent supported', () => {
    const productToQueryFamily = new Family(0, '0th');
    const productToQuery = new Dependency(
      Math.random(),
      productToQueryFamily.id,
      '',
      true,
      []
    );
    const unsupportedReleaseFamily = new Family(1, '1st');
    const unsupportedRelease = new Dependency(
      Math.random(),
      unsupportedReleaseFamily.id,
      '',
      false,
      [productToQuery.id]
    );
    const versionManager = new VersionManager(
      [productToQueryFamily, unsupportedReleaseFamily],
      [unsupportedRelease, productToQuery]
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithDependency([
      productToQuery,
    ]);
    expect(result).has.same.members([]);
  });
  it('if no product matches your version return one from an earlier version', () => {
    const searchFamily = new Family(0, '0th');
    const olderRelease = new Dependency(
      Math.random(),
      searchFamily.id,
      '1.0',
      true,
      []
    );
    const searchRelease = new Dependency(
      Math.random(),
      searchFamily.id,
      '2.0',
      true,
      []
    );
    const productFamily = new Family(1, '1st');
    const productForOlderRelease = new Dependency(
      Math.random(),
      productFamily.id,
      '8.0',
      true,
      [olderRelease.id]
    );

    const versionManager = new VersionManager(
      [searchFamily, productFamily],
      [olderRelease, searchRelease, productForOlderRelease]
    );
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithDependency([
      searchRelease,
    ]);
    expect(result).has.same.members([productForOlderRelease]);
  });
});
