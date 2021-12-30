import { Release, Product } from '@version-finder/version-finder-lib';

export interface VersionLoader {
  getReleases(): Release[];
  getProducts(): Product[];
  addProduct(newProduct: Product): boolean;
  addRelease(newRelease: Release): boolean;
  updateProduct(newProduct: Product): boolean;
  updateRelease(newRelease: Release): boolean;
  deleteProduct(productToDelete: Product): boolean;
  deleteRelease(releaseToDelete: Release): boolean;
}
