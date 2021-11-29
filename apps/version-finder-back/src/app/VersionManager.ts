import { Release, Product } from '@version-finder/version-finder-lib';
import * as fs from 'fs';
import { VersionLoader } from './VersionLoader';

export class VersionManager {
  releases: Release[];
  products: Product[];
  versionLoader: VersionLoader;

  constructor(versionLoader: VersionLoader) {
    this.releases = versionLoader.getReleases();
    this.products = versionLoader.getProducts();
    this.versionLoader = versionLoader;
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(newProduct: Product): boolean {
    if (!this.products.includes(newProduct)) {
      let lastId = 0;
      if (this.products.length > 0) {
        lastId = this.products[this.products.length - 1].id + 1;
      }
      newProduct.id = lastId;
      this.products.push(newProduct);
      this.versionLoader.addProduct(newProduct);
      return true;
    }
    return false;
  }

  deleteRelease(releaseToDelete: Release) {
    const indexOfRelease = this.releases.findIndex((rel) => {
      return rel.id === releaseToDelete.id;
    });
    if (indexOfRelease >= 0) {
      this.releases.splice(indexOfRelease, 1);
      return true;
    } else {
      return false;
    }
  }

  getReleases(): Release[] {
    return this.releases;
  }

  getReleasesByProduct(product: Product): Release[] {
    return this.releases.filter((release) => {
      return release.product === product.id;
    });
  }

  updateProduct(product: Product): boolean {
    const matchingProduct = this.products.find((fam) => {
      return fam.id === product.id;
    });
    if (matchingProduct) {
      matchingProduct.name = product.name;
      return true;
    } else {
      return false;
    }
  }

  updateRelease(updatedRelease: Release): boolean {
    const matchingRelease = this.releases.find((dep) => {
      return dep.id === updatedRelease.id;
    });
    if (matchingRelease) {
      matchingRelease.releases = updatedRelease.releases;
      matchingRelease.releaseDate = updatedRelease.releaseDate;
      matchingRelease.supported = updatedRelease.supported;
      matchingRelease.version = updatedRelease.version;
      return true;
    } else {
      return false;
    }
  }

  addRelease(release: Release): boolean {
    // can't depend on itself.
    if (release.releases.includes(release.id)) {
      return false;
    }
    // same Product + Release already exists
    const matchingRelease = this.releases.find((dep) => {
      return dep.product === release.product && dep.version === release.version;
    });
    if (matchingRelease) {
      return false;
    }
    // Product has to exist
    if (
      this.products.find((fam) => {
        return fam.id === release.product;
      })
    ) {
      const depWithMaxId = this.releases.reduce((p, c) =>
        p.id > c.id ? p : c
      );
      release.id = depWithMaxId.id + 1;
      this.releases.push(release);
      this.versionLoader.addRelease(release);
      return true;
    }
    return false;
  }
}
