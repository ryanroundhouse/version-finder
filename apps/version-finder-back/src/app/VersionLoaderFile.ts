import { Release, Product } from '@version-finder/version-finder-lib';
import * as fs from 'fs';
import { VersionLoader } from './VersionLoader';

export class VersionLoaderFile implements VersionLoader {
  ReleaseFilePath: string;
  ProductFilePath: string;

  constructor(ProductFilePath: string, ReleaseFilePath: string) {
    this.ProductFilePath = ProductFilePath;
    this.ReleaseFilePath = ReleaseFilePath;
  }

  deleteRelease(releaseToDelete: Release): boolean {
    const releases = this.getReleases();
    const indexOfReleaseToDelete = releases.findIndex((rel) => {
      return rel.id === releaseToDelete.id;
    });
    if (indexOfReleaseToDelete >= 0) {
      releases.splice(indexOfReleaseToDelete, 1);
      this.writeReleasesToFile(this.ReleaseFilePath, releases);
      return true;
    }
    return false;
  }

  deleteProduct(productToDelete: Product): boolean {
    const products = this.getProducts();
    const indexOfProductToDelete = products.findIndex((prod) => {
      return prod.id === productToDelete.id;
    });
    if (indexOfProductToDelete >= 0) {
      products.splice(indexOfProductToDelete, 1);
      this.writeProductsToFile(this.ProductFilePath, products);
      return true;
    }
    return false;
  }

  updateProduct(updatedProduct: Product): boolean {
    const products = this.getProducts();
    const productToUpdate = products.find((prod) => {
      return prod.id === updatedProduct.id;
    });
    if (productToUpdate) {
      productToUpdate.name = updatedProduct.name;
      productToUpdate.productType = updatedProduct.productType;
      this.writeProductsToFile(this.ProductFilePath, products);
      return true;
    }
    return false;
  }
  updateRelease(updatedRelease: Release): boolean {
    const releases = this.getReleases();
    const releaseToUpdate = releases.find((rel) => {
      return rel.id === updatedRelease.id;
    });
    if (releaseToUpdate) {
      releaseToUpdate.dependencies = updatedRelease.dependencies;
      releaseToUpdate.releaseDate = updatedRelease.releaseDate;
      releaseToUpdate.supported = updatedRelease.supported;
      releaseToUpdate.version = updatedRelease.version;
      this.writeReleasesToFile(this.ReleaseFilePath, releases);
      return true;
    }
    return false;
  }

  getReleases(): Release[] {
    return this.loadReleasesFromFile(this.ReleaseFilePath);
  }
  getProducts(): Product[] {
    return this.loadProductsFromFile(this.ProductFilePath);
  }
  addProduct(newProduct: Product): boolean {
    const Products = this.getProducts();
    Products.push(newProduct);
    this.writeProductsToFile(this.ProductFilePath, Products);
    return true;
  }
  addRelease(newRelease: Release): boolean {
    const Releases = this.getReleases();
    Releases.push(newRelease);
    this.writeReleasesToFile(this.ReleaseFilePath, Releases);
    return true;
  }

  loadReleasesFromFile(filePath: string): Release[] {
    const Releases: Release[] = [];
    const buffer = fs.readFileSync(filePath);
    const ReleaseObjects: Release[] = JSON.parse(buffer.toString());
    ReleaseObjects.forEach((ReleaseObject) => {
      Releases.push(
        Object.assign(new Release(-1, null, '-1', true, []), ReleaseObject)
      );
    });
    return Releases;
  }

  loadProductsFromFile(filePath: string): Product[] {
    const Products: Product[] = [];
    const buffer = fs.readFileSync(filePath);
    const ProductObjects: Product[] = JSON.parse(buffer.toString());
    ProductObjects.forEach((ProductObject) => {
      Products.push(Object.assign(new Product(-1, ''), ProductObject));
    });
    return Products;
  }

  writeProductsToFile(filePath: string, Products: Product[]) {
    console.log(`attempting to write to ${filePath}`);
    fs.writeFile(filePath, JSON.stringify(Products), (err) => {
      if (err) {
        console.log('File write failed:', err);
        return;
      }
    });
  }

  writeReleasesToFile(filePath: string, Releases: Release[]) {
    console.log(`attempting to write to ${filePath}`);
    fs.writeFile(filePath, JSON.stringify(Releases), (err) => {
      if (err) {
        console.log('File write failed:', err);
        return;
      }
    });
  }
}
