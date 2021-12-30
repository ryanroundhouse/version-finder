import { Release, Product } from '@version-finder/version-finder-lib';
import { VersionLoader } from './VersionLoader';

export class VersionLoaderMemory implements VersionLoader {
  Releases: Release[];
  Products: Product[];

  constructor(Products: Product[], Releases: Release[]) {
    this.Releases = Releases;
    this.Products = Products;
  }

  deleteRelease(releaseToDelete: Release): boolean {
    return true;
  }

  deleteProduct(productToDelete: Product): boolean {
    return true;
  }
  updateProduct(newProduct: Product): boolean {
    return true;
  }
  updateRelease(newRelease: Release): boolean {
    return true;
  }

  getReleases(): Release[] {
    return this.Releases;
  }

  getProducts(): Product[] {
    return this.Products;
  }

  addProduct(newProduct: Product): boolean {
    return true;
  }

  addRelease(newRelease: Release): boolean {
    return true;
  }
}
