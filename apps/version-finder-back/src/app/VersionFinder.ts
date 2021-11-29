import { Release, Product } from '@version-finder/version-finder-lib';

import { VersionManager } from './VersionManager';

export class VersionFinder {
  versionManager: VersionManager;

  constructor(versionManager: VersionManager) {
    this.versionManager = versionManager;
  }

  findReleaseById(id: number) {
    return this.versionManager.releases.find((dep) => {
      return dep.id === id;
    });
  }

  whatProductsCanIRunWithRelease(productsToQuery: Release[]): Release[] {
    const foundReleases: Release[] = [];

    const allProducts: Product[] = this.getProductsFromReleases(
      this.versionManager.getReleases()
    );
    const searchProducts: Product[] =
      this.getProductsFromReleases(productsToQuery);

    allProducts.forEach((product) => {
      const productReleases = this.versionManager.getReleasesByProduct(product);
      productReleases.forEach((ProductRelease) => {
        if (
          ProductRelease.releases.some((ReleaseId) => {
            const release = this.findReleaseById(ReleaseId);
            return (
              searchProducts.find((product) => {
                return product.id === release.product;
              }) != null
            );
          })
        ) {
          if (
            ProductRelease.supported &&
            !this.isTooNew(ProductRelease, productsToQuery)
          ) {
            foundReleases.push(ProductRelease);
          }
        }
      });
    });

    const foundReleasesWithLatestFromEachProduct: Release[] =
      this.removeEarlierReleasesFromDuplicateProducts(
        foundReleases,
        allProducts
      );

    return foundReleasesWithLatestFromEachProduct;
  }

  isTooNew(productRelease: Release, productsToQuery: Release[]): boolean {
    let isTooNew = false;
    productRelease.releases.forEach((ProductRelease) => {
      const resolvedRelease = this.findReleaseById(ProductRelease);
      const productToQuery = productsToQuery.find((productToQuery) => {
        return resolvedRelease.product === productToQuery.product;
      });
      if (Release.isGreaterThan(productToQuery, resolvedRelease)) {
        isTooNew = true;
      }
    });
    return isTooNew;
  }

  findSubReleases(releases: Release[], products: Product[]): Release[] {
    releases.forEach((Release) => {
      Release.releases.forEach((subRelease) => {
        const resolvedRelease = this.findReleaseById(subRelease);
        if (resolvedRelease.supported) {
          releases.push(resolvedRelease);
        }
      });
    });
    const newProducts = this.getProductsFromReleases(releases);
    if (newProducts > products) {
      return this.findSubReleases(releases, newProducts);
    } else {
      return releases;
    }
  }

  findReleasesFor(searchReleases: Release[]): Release[] {
    const searchReleaseProducts = this.getProductsFromReleases(searchReleases);
    const foundReleases = this.findSubReleases(
      searchReleases,
      searchReleaseProducts
    );
    const foundProducts: Product[] =
      this.getProductsFromReleases(foundReleases);
    const foundReleasesWithLatestFromEachProduct: Release[] =
      this.removeEarlierReleasesFromDuplicateProducts(
        foundReleases,
        foundProducts
      );
    const foundReleasesWithoutDuplicates = [
      ...new Set(foundReleasesWithLatestFromEachProduct),
    ];
    const foundReleasesWithout64if64m = this.remove64if64mPresent(
      foundReleasesWithoutDuplicates
    );
    return foundReleasesWithout64if64m;
  }

  remove64if64mPresent(Releases: Release[]): Release[] {
    let cis64mRelease: Release;
    let cis64Release: Release;

    const cis64mProduct = this.versionManager.products.find((fam) => {
      return fam.name === 'CIS 6.4m';
    });
    if (cis64mProduct) {
      cis64mRelease = Releases.find((dep) => {
        return dep.product === cis64mProduct.id;
      });
    }

    const cis64Product = this.versionManager.products.find((fam) => {
      return fam.name === 'CIS 6.4';
    });
    if (cis64Product) {
      cis64Release = Releases.find((dep) => {
        return dep.product === cis64Product.id;
      });
    }

    if (cis64mRelease && cis64Release) {
      Releases.splice(Releases.indexOf(cis64Release), 1);
    }
    return Releases;
  }

  getProductsFromReleases(foundReleases: Release[]): Product[] {
    const productIds = [
      ...new Set(
        foundReleases.map((Release) => {
          return Release.product;
        })
      ),
    ];
    const products: Product[] = [];
    productIds.forEach((productId) => {
      products.push(
        this.versionManager.products.find((product) => product.id === productId)
      );
    });
    return products;
  }

  removeEarlierReleasesFromDuplicateProducts(
    foundReleases: Release[],
    foundProducts: Product[]
  ): Release[] {
    foundReleases.sort(Release.compare);

    foundProducts.forEach((foundProduct) => {
      const releasesByProduct = foundReleases.filter((foundRelease) => {
        return foundRelease.product === foundProduct.id;
      });
      if (releasesByProduct.length > 1) {
        let dontRemoveThisOne = true;
        releasesByProduct.forEach((dep) => {
          if (dontRemoveThisOne) {
            dontRemoveThisOne = false;
          } else {
            const releaseIndexToRemove = foundReleases.indexOf(dep);
            foundReleases.splice(releaseIndexToRemove, 1);
          }
        });
      }
    });
    return foundReleases;
  }
}

export default VersionFinder;
