import { Release, Product } from '@version-finder/version-finder-lib';
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
      this.versionLoader.deleteRelease(releaseToDelete);
      return true;
    } else {
      return false;
    }
  }

  deleteProduct(productToDelete: Product) {
    const indexOfProductToDelete = this.products.findIndex((prod) => {
      return prod.id === productToDelete.id;
    });
    if (indexOfProductToDelete >= 0) {
      this.products.splice(indexOfProductToDelete, 1);
      this.versionLoader.deleteProduct(productToDelete);
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
      matchingProduct.productType = product.productType;
      this.versionLoader.updateProduct(matchingProduct);
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
      matchingRelease.dependencies = updatedRelease.dependencies;
      matchingRelease.releaseDate = updatedRelease.releaseDate;
      matchingRelease.supported = updatedRelease.supported;
      matchingRelease.version = updatedRelease.version;
      this.versionLoader.updateRelease(matchingRelease);
      return true;
    } else {
      return false;
    }
  }

  addRelease(release: Release): boolean {
    // can't depend on itself.
    if (release.dependencies.includes(release.id)) {
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
      let releaseId = 0;
      if (this.releases.length > 0) {
        const depWithMaxId = this.releases.reduce((p, c) =>
          p.id > c.id ? p : c
        );
        releaseId = depWithMaxId.id + 1;
      }
      release.id = releaseId;
      this.releases.push(release);
      this.versionLoader.addRelease(release);
      return true;
    }
    return false;
  }
}
