import { Component, OnInit } from '@angular/core';
import { Release, Product } from '@version-finder/version-finder-lib';
import { VersionFinderService } from '../services/version-finder.service';
import { VersionManagerService } from '../services/version-manager.service';

@Component({
  selector: 'version-finder-find-releases',
  templateUrl: './find-dependencies.component.html',
  styleUrls: ['./find-dependencies.component.scss'],
})
export class FindDependenciesComponent implements OnInit {
  releases: Release[] = [];
  products: Product[] = [{ id: 0, name: 'test' }];
  selectedProduct: Product = this.products[0];
  versions: string[] = [];
  selectedVersion = '';
  foundReleases: Release[] = [];

  constructor(
    private versionFinderService: VersionFinderService,
    private versionManagerService: VersionManagerService
  ) {}

  ngOnInit(): void {
    this.versionManagerService
      .getAllReleases()
      .subscribe((Releases: Release[]) => {
        this.releases = Releases;
      });
    this.versionManagerService
      .getAllProducts()
      .subscribe((Products: Product[]) => {
        this.products = Products;
        // this.selectedProduct = this.Products[0];
      });
  }

  onChangeProductSelection(value: Product) {
    const versionsOfProduct = this.releases
      .filter((dep) => {
        return dep.product === value.id;
      })
      .map((dep) => {
        return dep.version;
      });
    this.versions = versionsOfProduct;
    this.selectedVersion = versionsOfProduct[0];
    this.foundReleases = [];
    console.log('found versions for this Product: ' + versionsOfProduct);
  }

  onChangeVersionSelection(value: string) {
    this.foundReleases = [];
    console.log(value);
    this.onSearch(value);
  }

  getProductFromId(productId: number): Product | undefined {
    const product = this.products.find((product) => {
      return product.id === productId;
    });
    return product;
  }

  onSearch(event: any) {
    const depToSearchFor = this.releases.find((dep) => {
      return (
        dep.product === this.selectedProduct.id &&
        dep.version === this.selectedVersion
      );
    });
    console.log(`searching for ${JSON.stringify(depToSearchFor)}`);
    if (depToSearchFor) {
      this.versionFinderService
        .findReleases([depToSearchFor])
        .subscribe((foundReleases: Release[]) => {
          this.foundReleases = foundReleases;
          console.log('found: ' + JSON.stringify(this.foundReleases));
        });
    }
  }
}
