import { expect } from 'chai';
import { Release, Product } from '@version-finder/version-finder-lib';

import { VersionManager } from './VersionManager';
import { VersionLoaderMemory } from './VersionLoaderMemory';

describe('version manager Product tests', () => {
  it('add Product adds a Product', () => {
    const versionLoader = new VersionLoaderMemory([], []);
    const versionManager = new VersionManager(versionLoader);
    const newProduct = new Product(0, '0th');
    const result = versionManager.addProduct(newProduct);

    expect(versionManager.products).has.same.members([newProduct]);
    expect(result).to.be.true;
  });
  it('get Products gets Products', () => {
    const newProduct = new Product(0, '0th');
    const versionLoader = new VersionLoaderMemory([newProduct], []);
    const versionManager = new VersionManager(versionLoader);

    const addedFamilities = versionManager.getProducts();
    expect(addedFamilities).has.same.members([newProduct]);
  });
  it('add Product wont add duplicate Product', () => {
    const newProduct = new Product(0, '0th');
    const versionLoader = new VersionLoaderMemory([newProduct], []);
    const versionManager = new VersionManager(versionLoader);
    const result = versionManager.addProduct(newProduct);

    expect(versionManager.products).has.same.members([newProduct]);
    expect(result).to.be.false;
  });
  it('add Product assigns a new id when no Products present', () => {
    const newProduct = new Product(-1, '0th');
    const versionLoader = new VersionLoaderMemory([], []);
    const versionManager = new VersionManager(versionLoader);
    const result = versionManager.addProduct(newProduct);

    expect(versionManager.products[0].id).does.not.equal(-1);
    expect(result).to.be.true;
  });
  it('add Product assigns a new id when Products are present', () => {
    const oldProduct = new Product(0, '0th');
    const newProduct = new Product(999, '1st');
    const versionLoader = new VersionLoaderMemory([oldProduct], []);
    const versionManager = new VersionManager(versionLoader);
    const result = versionManager.addProduct(newProduct);

    expect(versionManager.products[0].id).does.not.equal(999);
    expect(versionManager.products[1].id).does.not.equal(999);
    expect(result).to.be.true;
  });
  it('version manager can rename a Product', () => {
    const ProductToBeRenamed = new Product(0, '0th');
    const newNamedProduct = new Product(0, '1st');
    const versionLoader = new VersionLoaderMemory([ProductToBeRenamed], []);
    const versionManager = new VersionManager(versionLoader);
    const result = versionManager.updateProduct(newNamedProduct);

    expect(versionManager.products[0].name).equals(newNamedProduct.name);
    expect(result).to.be.true;
  });
  it('version manager cant rename a Product it doesnt hae', () => {
    const ProductToBeRenamed = new Product(0, '0th');
    const versionLoader = new VersionLoaderMemory([], []);
    const versionManager = new VersionManager(versionLoader);
    const result = versionManager.updateProduct(ProductToBeRenamed);

    expect(result).to.be.false;
    expect(versionManager.products.length).equals(0);
  });
});
describe('version manager Release tests', () => {
  it('get Releases gets Releases', () => {
    const newRelease = new Release(Math.random(), 0, '', true, []);
    const versionLoader = new VersionLoaderMemory([], [newRelease]);
    const versionManager = new VersionManager(versionLoader);

    const Releases = versionManager.getReleases();
    expect(Releases).has.same.members([newRelease]);
  });
  it('get Releases by Product gets only Releases by Product', () => {
    const product = new Product(0, '0th');
    const ProductRelease = new Release(Math.random(), product.id, '', true, []);
    const nonProductRelease = new Release(Math.random(), 1, '', true, []);
    const versionLoader = new VersionLoaderMemory(
      [],
      [ProductRelease, nonProductRelease]
    );
    const versionManager = new VersionManager(versionLoader);

    const Releases = versionManager.getReleasesByProduct(product);
    expect(Releases).has.same.members([ProductRelease]);
  });
  it('add Release adds a Release', () => {
    const product = new Product(0, '0th');
    const release = new Release(Math.random(), product.id, '', true, []);
    const versionLoader = new VersionLoaderMemory([product], []);
    const versionManager = new VersionManager(versionLoader);

    const result = versionManager.addRelease(release);
    expect(result).to.be.true;
    expect(versionManager.releases).has.same.members([release]);
  });
  it('add Release fails when the Product isnt present', () => {
    const release = new Release(Math.random(), 0, '', true, []);
    const versionLoader = new VersionLoaderMemory([], []);
    const versionManager = new VersionManager(versionLoader);

    const result = versionManager.addRelease(release);
    expect(result).to.be.false;
    expect(versionManager.releases).has.same.members([]);
  });
  it('add Release fails when the Release already exists', () => {
    const product = new Product(0, '0th');
    const release = new Release(Math.random(), product.id, '', true, []);
    const versionLoader = new VersionLoaderMemory([product], [release]);
    const versionManager = new VersionManager(versionLoader);

    const result = versionManager.addRelease(release);
    expect(result).to.be.false;
    expect(versionManager.releases).has.same.members([release]);
  });
  it('add Release fails when the same version already exists for that Release', () => {
    const product = new Product(0, '0th');
    const release = new Release(Math.random(), product.id, '1.0', true, []);
    const versionLoader = new VersionLoaderMemory([product], [release]);
    const versionManager = new VersionManager(versionLoader);
    const duplicateRelease = new Release(
      Math.random(),
      product.id,
      '1.0',
      true,
      []
    );

    const result = versionManager.addRelease(duplicateRelease);
    expect(result).to.be.false;
    expect(versionManager.releases).has.same.members([release]);
  });
  it('add Release cant depend on itself', () => {
    const product = new Product(0, '0th');
    const ReleaseId = Math.random();
    const release = new Release(ReleaseId, product.id, '1.0', true, [
      ReleaseId,
    ]);
    const versionLoader = new VersionLoaderMemory([product], []);
    const versionManager = new VersionManager(versionLoader);

    const result = versionManager.addRelease(release);
    expect(result).to.be.false;
    expect(versionManager.releases).has.same.members([]);
  });
  it('can delete release', () => {
    const product = new Product(0, '0th');
    const ReleaseId = Math.random();
    const release = new Release(ReleaseId, product.id, '1.0', true, [
      ReleaseId,
    ]);
    const versionLoader = new VersionLoaderMemory([product], [release]);
    const versionManager = new VersionManager(versionLoader);

    const result = versionManager.deleteRelease(release);
    expect(result).to.be.true;
    expect(versionManager.releases).has.same.members([]);
  });
  it('returns false if it cant find the release', () => {
    const product = new Product(0, '0th');
    const ReleaseId = Math.random();
    const release = new Release(ReleaseId, product.id, '1.0', true, [
      ReleaseId,
    ]);
    const versionLoader = new VersionLoaderMemory([product], []);
    const versionManager = new VersionManager(versionLoader);

    const result = versionManager.deleteRelease(release);
    expect(result).to.be.false;
    expect(versionManager.releases).has.same.members([]);
  });
});
