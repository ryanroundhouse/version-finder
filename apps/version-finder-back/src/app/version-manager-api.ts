import * as path from 'path';
import { VersionManager } from './VersionManager';
import { Release, Product } from '@version-finder/version-finder-lib';
import { VersionLoaderFile } from './VersionLoaderFile';

export class VersionManagerApi {
  versionManager: VersionManager;
  constructor() {
    const versionLoaderFile = new VersionLoaderFile(
      path.resolve(__dirname, 'assets/Products.json'),
      path.resolve(__dirname, 'assets/Releases.json')
    );
    this.versionManager = new VersionManager(versionLoaderFile);
  }

  getAllProducts(): Product[] {
    return this.versionManager.getProducts();
  }

  getAllReleases(): Release[] {
    return this.versionManager.getReleases();
  }

  addProduct(newProduct: Product) {
    return this.versionManager.addProduct(newProduct);
  }

  addRelease(newRelease: Release) {
    return this.versionManager.addRelease(newRelease);
  }

  deleteRelease(releaseToDelete: Release) {
    return this.versionManager.deleteRelease(releaseToDelete);
  }

  deleteProduct(productToDelete: Product) {
    return this.versionManager.deleteProduct(productToDelete);
  }

  updateProduct(newProduct: Product) {
    return this.versionManager.updateProduct(newProduct);
  }

  updateRelease(updatedRelease: Release) {
    return this.versionManager.updateRelease(updatedRelease);
  }
}
