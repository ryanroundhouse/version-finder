import { expect } from 'chai';
import { Release, Product } from '@version-finder/version-finder-lib';

import VersionFinder from './VersionFinder';
import { VersionManager } from './VersionManager';
import path = require('path');
import { VersionLoaderFile } from './VersionLoaderFile';
import { VersionLoaderMemory } from './VersionLoaderMemory';

describe('get pre-reqs for releases', () => {
  it('should find a single entry when only that single entry exists', () => {
    const product = new Product(0, '0th');
    const release = new Release(0, product.id, '', true, []);
    const versionLoader = new VersionLoaderMemory([product], [release]);
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findReleasesFor([release]);
    expect(result).has.same.members([release]);
  });
  it('should return only the entry when no Release for search exist', () => {
    const releaseProduct = new Product(0, '0th');
    const release = new Release(Math.random(), releaseProduct.id, '', true, []);
    const unrelatedReleaseProduct = new Product(1, '1st');
    const unrelatedRelease = new Release(
      Math.random(),
      unrelatedReleaseProduct.id,
      '',
      true,
      []
    );
    const versionLoader = new VersionLoaderMemory(
      [releaseProduct, unrelatedReleaseProduct],
      [release, unrelatedRelease]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findReleasesFor([release]);
    expect(result).has.same.members([release]);
  });
  it('should return all Release linked by Release', () => {
    const relatedReleaseProduct = new Product(0, '0th');
    const relatedRelease = new Release(
      Math.random(),
      relatedReleaseProduct.id,
      '',
      true,
      []
    );
    const ReleaseProduct = new Product(1, '1st');
    const release = new Release(Math.random(), ReleaseProduct.id, '', true, [
      relatedRelease.id,
    ]);
    const versionLoader = new VersionLoaderMemory(
      [relatedReleaseProduct, ReleaseProduct],
      [release, relatedRelease]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findReleasesFor([release]);
    expect(result).has.same.members([release, relatedRelease]);
  });
  it('should return Release of Release', () => {
    const secondLevelReleaseProduct = new Product(0, '0th');
    const secondLevelRelease = new Release(
      Math.random(),
      secondLevelReleaseProduct.id,
      '',
      true,
      []
    );
    const firstLevelReleaseProduct = new Product(1, '1st');
    const firstLevelRelease = new Release(
      Math.random(),
      firstLevelReleaseProduct.id,
      '',
      true,
      [secondLevelRelease.id]
    );
    const releaseProduct = new Product(2, '2nd');
    const release = new Release(Math.random(), releaseProduct.id, '', true, [
      firstLevelRelease.id,
    ]);
    const versionLoader = new VersionLoaderMemory(
      [secondLevelReleaseProduct, firstLevelReleaseProduct, releaseProduct],
      [release, firstLevelRelease, secondLevelRelease]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findReleasesFor([release]);
    expect(result).has.same.members([
      release,
      firstLevelRelease,
      secondLevelRelease,
    ]);
  });
  it('should look for deeper Releases until no new Products are discovered', () => {
    const superBottomProduct = new Product(0, '0th');
    const superBottomRelease = new Release(
      Math.random(),
      superBottomProduct.id,
      '',
      true,
      []
    );
    const bottomProduct = new Product(1, '1st');
    const bottomRelease = new Release(
      Math.random(),
      bottomProduct.id,
      '',
      true,
      [superBottomRelease.id]
    );
    const middleProduct = new Product(2, '2nd');
    const middleRelease = new Release(
      Math.random(),
      middleProduct.id,
      '',
      true,
      [bottomRelease.id]
    );
    const topProduct = new Product(3, '3rd');
    const topRelease = new Release(Math.random(), topProduct.id, '', true, [
      middleRelease.id,
    ]);

    const versionLoader = new VersionLoaderMemory(
      [superBottomProduct, bottomProduct, middleProduct, topProduct],
      [superBottomRelease, bottomRelease, middleRelease, topRelease]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findReleasesFor([topRelease]);
    expect(result).has.same.members([
      topRelease,
      middleRelease,
      bottomRelease,
      superBottomRelease,
    ]);
  });
  it('should only return a single Release of each Product', () => {
    const ProductX = new Product(0, '0th');
    const firstReleaseFromProductX = new Release(
      Math.random(),
      ProductX.id,
      '',
      true,
      []
    );
    const secondReleaseFromProductX = new Release(
      Math.random(),
      ProductX.id,
      '',
      true,
      []
    );
    const searchReleaseWithFirstReleaseProduct = new Product(1, '1st');
    const searchReleaseWithFirstRelease = new Release(
      Math.random(),
      searchReleaseWithFirstReleaseProduct.id,
      '',
      true,
      [firstReleaseFromProductX.id]
    );
    const searchReleaseWithSecondReleaseProduct = new Product(2, '2nd');
    const searchReleaseWithSecondRelease = new Release(
      Math.random(),
      searchReleaseWithSecondReleaseProduct.id,
      '',
      true,
      [secondReleaseFromProductX.id]
    );

    const versionLoader = new VersionLoaderMemory(
      [
        ProductX,
        searchReleaseWithFirstReleaseProduct,
        searchReleaseWithSecondReleaseProduct,
      ],
      [
        firstReleaseFromProductX,
        secondReleaseFromProductX,
        searchReleaseWithFirstRelease,
        searchReleaseWithSecondRelease,
      ]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findReleasesFor([
      searchReleaseWithFirstRelease,
      searchReleaseWithSecondRelease,
    ]);
    expect(result).has.same.members([
      searchReleaseWithFirstRelease,
      searchReleaseWithSecondRelease,
      firstReleaseFromProductX,
    ]);
  });
  it('should only return the latest Release of each Product', () => {
    const ProductX = new Product(0, '0th');
    const olderReleaseFromProductX = new Release(
      Math.random(),
      ProductX.id,
      '1.0',
      true,
      []
    );
    const newerReleaseFromProductX = new Release(
      Math.random(),
      ProductX.id,
      '2.0',
      true,
      []
    );
    const searchReleaseWithFirstReleaseProduct = new Product(1, '1st');
    const searchReleaseWithFirstRelease = new Release(
      Math.random(),
      searchReleaseWithFirstReleaseProduct.id,
      '',
      true,
      [olderReleaseFromProductX.id]
    );
    const searchReleaseWithSecondReleaseProduct = new Product(2, '2nd');
    const searchReleaseWithSecondRelease = new Release(
      Math.random(),
      searchReleaseWithSecondReleaseProduct.id,
      '',
      true,
      [newerReleaseFromProductX.id]
    );

    const versionLoader = new VersionLoaderMemory(
      [
        ProductX,
        searchReleaseWithFirstReleaseProduct,
        searchReleaseWithSecondReleaseProduct,
      ],
      [
        olderReleaseFromProductX,
        newerReleaseFromProductX,
        searchReleaseWithFirstRelease,
        searchReleaseWithSecondRelease,
      ]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findReleasesFor([
      searchReleaseWithFirstRelease,
      searchReleaseWithSecondRelease,
    ]);
    expect(result.includes(newerReleaseFromProductX)).to.be.true;
  });
  it('dont return a prerequisite that is no longer supported', () => {
    const unsupportedReleaseProduct = new Product(0, '0th');
    const unsupportedRelease = new Release(
      Math.random(),
      unsupportedReleaseProduct.id,
      '',
      false,
      []
    );
    const searchReleaseProduct = new Product(1, '1st');
    const searchRelease = new Release(
      Math.random(),
      searchReleaseProduct.id,
      '',
      true,
      [unsupportedRelease.id]
    );

    const versionLoader = new VersionLoaderMemory(
      [unsupportedReleaseProduct, searchReleaseProduct],
      [unsupportedRelease, searchRelease]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findReleasesFor([searchRelease]);
    expect(result).has.same.members([searchRelease]);
  });
  it('should resolve nested Releases when loaded from files', () => {
    const nsBL64Product = new Product(6, 'nsBL 6.4');
    const nsBL66Product = new Product(5, 'nsBL 6.6');
    const cis64Product = new Product(0, 'CIS 6.4');
    const cis66Product = new Product(4, 'CIS 6.6');
    const cc6Product = new Product(2, 'CC6');

    const cis64NsblRelease = new Release(
      16,
      cis64Product.id,
      '6.4.20',
      true,
      []
    );
    const nsbl64Release = new Release(15, nsBL64Product.id, '6.4.29', true, [
      cis64NsblRelease.id,
    ]);
    const cis66NsblRelease = new Release(7, cis66Product.id, '6.6.8', true, []);
    const nsbl66Release = new Release(14, nsBL66Product.id, '6.6.9', true, [
      cis66NsblRelease.id,
    ]);
    const cis66Release = new Release(9, cis66Product.id, '6.6.5', true, []);
    const cis64Release = new Release(3, cis64Product.id, '6.4.27', true, []);
    const cc6Release = new Release(13, cc6Product.id, '6.7.2', true, [
      cis64Release.id,
      cis66Release.id,
      nsbl64Release.id,
      nsbl66Release.id,
    ]);
    const expectedReleases = [
      cc6Release,
      nsbl66Release,
      cis66NsblRelease,
      nsbl64Release,
      cis64Release,
    ];
    const versionLoaderFile = new VersionLoaderFile(
      path.resolve(__dirname, '../assets/testProducts.json'),
      path.resolve(__dirname, '../assets/testReleases.json')
    );
    const versionManager = new VersionManager(versionLoaderFile);

    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findReleasesFor([cc6Release]);
    expect(JSON.stringify(result)).equals(JSON.stringify(expectedReleases));
  });
  it('should only return the 6.4m dep and not CIS 6.4 if its possible to return both', () => {
    const cis64mProduct = new Product(0, 'CIS 6.4m');
    const cis64Product = new Product(1, 'CIS 6.4');
    const mcareProduct = new Product(2, 'mCare');

    const cis64mRelease = new Release(0, cis64mProduct.id, '6.4.0m', true, []);
    const cis64Release = new Release(1, cis64Product.id, '6.4.0', true, []);
    const mcareRelease = new Release(2, mcareProduct.id, '6.0', true, [
      cis64mRelease.id,
      cis64Release.id,
    ]);

    const versionLoader = new VersionLoaderMemory(
      [cis64Product, cis64mProduct, mcareProduct],
      [cis64Release, cis64mRelease, mcareRelease]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.findReleasesFor([mcareRelease]);
    expect(result).has.same.members([cis64mRelease, mcareRelease]);
  });
});

describe('get releases for pre-req', () => {
  it('should find a single item if only one release exists', () => {
    const productToQueryProduct = new Product(0, '0th');
    const productToQuery = new Release(
      0,
      productToQueryProduct.id,
      '',
      true,
      []
    );
    const singleReleaseProduct = new Product(1, '1st');
    const singleRelease = new Release(1, singleReleaseProduct.id, '', true, [
      productToQuery.id,
    ]);
    const versionLoader = new VersionLoaderMemory(
      [productToQueryProduct, singleReleaseProduct],
      [singleRelease, productToQuery]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithRelease([
      productToQuery,
    ]);
    expect(result).has.same.members([singleRelease]);
  });
  it('should find latest Release that supports it', () => {
    const queryProductProduct = new Product(0, '0th');
    const queryProduct = new Release(
      Math.random(),
      queryProductProduct.id,
      '6.4',
      true,
      []
    );
    const tooNewQueryProduct = new Release(
      Math.random(),
      queryProductProduct.id,
      '6.5',
      true,
      []
    );

    const ReleaseProduct = new Product(1, '1st');
    const tooOldRelease = new Release(
      Math.random(),
      ReleaseProduct.id,
      '1.0',
      true,
      [queryProduct.id]
    );
    const justRightRelease = new Release(
      Math.random(),
      ReleaseProduct.id,
      '2.0',
      true,
      [queryProduct.id]
    );
    const tooNewRelease = new Release(
      Math.random(),
      ReleaseProduct.id,
      '3.0',
      true,
      [tooNewQueryProduct.id]
    );

    const versionLoader = new VersionLoaderMemory(
      [queryProductProduct, ReleaseProduct],
      [
        queryProduct,
        tooNewQueryProduct,
        tooOldRelease,
        justRightRelease,
        tooNewRelease,
      ]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithRelease([queryProduct]);
    expect(result).has.same.members([justRightRelease]);
  });
  it('shouldnt return Releases that arent supported', () => {
    const productToQueryProduct = new Product(0, '0th');
    const productToQuery = new Release(
      Math.random(),
      productToQueryProduct.id,
      '',
      true,
      []
    );
    const unsupportedReleaseProduct = new Product(1, '1st');
    const unsupportedRelease = new Release(
      Math.random(),
      unsupportedReleaseProduct.id,
      '',
      false,
      [productToQuery.id]
    );
    const versionLoader = new VersionLoaderMemory(
      [productToQueryProduct, unsupportedReleaseProduct],
      [unsupportedRelease, productToQuery]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithRelease([
      productToQuery,
    ]);
    expect(result).has.same.members([]);
  });
  it('if no product matches your version return one from an earlier version', () => {
    const searchProduct = new Product(0, '0th');
    const olderRelease = new Release(
      Math.random(),
      searchProduct.id,
      '1.0',
      true,
      []
    );
    const searchRelease = new Release(
      Math.random(),
      searchProduct.id,
      '2.0',
      true,
      []
    );
    const productProduct = new Product(1, '1st');
    const productForOlderRelease = new Release(
      Math.random(),
      productProduct.id,
      '8.0',
      true,
      [olderRelease.id]
    );

    const versionLoader = new VersionLoaderMemory(
      [searchProduct, productProduct],
      [olderRelease, searchRelease, productForOlderRelease]
    );
    const versionManager = new VersionManager(versionLoader);
    const versionFinder = new VersionFinder(versionManager);

    const result = versionFinder.whatProductsCanIRunWithRelease([
      searchRelease,
    ]);
    expect(result).has.same.members([productForOlderRelease]);
  });
});
