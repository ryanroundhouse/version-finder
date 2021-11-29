import { Release, Product } from '@version-finder/version-finder-lib';

export interface VersionLoader {
  getReleases(): Release[];
  getProducts(): Product[];
  addProduct(newProduct: Product): boolean;
  addRelease(newRelease: Release): boolean;
}
