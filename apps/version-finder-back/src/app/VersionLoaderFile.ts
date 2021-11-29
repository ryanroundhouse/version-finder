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
    fs.writeFile(filePath, JSON.stringify(Products), (err) => {
      if (err) {
        console.log('File write failed:', err);
        return;
      }
    });
  }

  writeReleasesToFile(filePath: string, Releases: Release[]) {
    fs.writeFile(filePath, JSON.stringify(Releases), (err) => {
      if (err) {
        console.log('File write failed:', err);
        return;
      }
    });
  }
}
