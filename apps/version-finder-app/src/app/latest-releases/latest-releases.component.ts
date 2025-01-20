import { Component, OnInit } from '@angular/core';
import { Release, Product } from '@version-finder/version-finder-lib';
import { VersionManagerService } from '../services/version-manager.service';
import {
  faQuestionCircle,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';

@Component({
  selector: 'version-finder-latest-releases',
  templateUrl: './latest-releases.component.html',
  styleUrls: ['./latest-releases.component.scss'],
})
export class LatestReleasesComponent implements OnInit {
  releases: Release[] = [];
  products: Product[] = [];
  faQuestionCircle: IconDefinition = faQuestionCircle;

  constructor(private versionManagerService: VersionManagerService) {}

  ngOnInit(): void {
    this.refreshReleases();
    this.refreshProducts();
  }

  refreshReleases() {
    this.versionManagerService
      .getAllReleases()
      .subscribe((Releases: Release[]) => {
        this.releases = Releases;
        console.log(`found Releases: ${JSON.stringify(this.releases)}`);
      });
  }

  refreshProducts() {
    this.versionManagerService
      .getAllProducts()
      .subscribe((Products: Product[]) => {
        this.products = Products;
        console.log(`found Products: ${JSON.stringify(this.products)}`);
      });
  }

  getFriendlyDate(dateString: string | undefined) {
    if (dateString) {
      return moment(dateString).format('MMMM DD, YYYY');
    } else {
      return undefined;
    }
  }

  getLatestReleaseByProduct(
    ProductId: number | undefined
  ): Release | undefined {
    let latestRelease: Release | undefined;
    if (ProductId !== undefined) {
      const releasedReleases = this.releases.filter((dep) => {
        const isReleased = moment(dep.releaseDate) < moment(moment.now());
        return dep.product === ProductId && isReleased;
      });
      if (releasedReleases) {
        releasedReleases.sort((first, second) => {
          return moment(second.releaseDate).diff(first.releaseDate);
        });
        latestRelease = releasedReleases[0];
      }
    }
    return latestRelease;
  }

  getCISProducts(): Product[] {
    return this.products.filter((prod) => [0, 4, 7, 11].includes(prod.id));
  }

  getNSBLProducts(): Product[] {
    return this.products.filter((prod) => [5, 6].includes(prod.id));
  }

  get7Products(): Product[] {
    return this.products.filter((prod) => [9, 10, 12].includes(prod.id));
  }

  getAddonProducts(): Product[] {
    return this.products.filter((prod) => [1, 2, 3, 8].includes(prod.id));
  }

  getReleasesForRelease(Releases: number[] | undefined): Release[] {
    const foundReleases: Release[] = [];
    if (Releases) {
      Releases.forEach((depId) => {
        const foundDep = this.releases.find((dep) => {
          return dep.id === depId;
        });
        if (foundDep) {
          foundReleases.push(foundDep);
        }
      });
    }
    return foundReleases;
  }

  get64Releases(Releases: number[] | undefined): Release[] {
    const stream64Products: Release[] = [];
    if (Releases) {
      const foundReleases = this.releases.filter((dep) => {
        return [0, 6, 7].includes(dep.product) && Releases.includes(dep.id);
      });
      foundReleases.forEach((dep) => {
        stream64Products.push(dep);
      });
    }
    return stream64Products;
  }

  get66Releases(Releases: number[] | undefined): Release[] {
    const stream64Products: Release[] = [];
    if (Releases) {
      const foundReleases = this.releases.filter((dep) => {
        return [4, 5].includes(dep.product) && Releases.includes(dep.id);
      });
      foundReleases.forEach((dep) => {
        stream64Products.push(dep);
      });
    }
    return stream64Products;
  }

  getOtherReleases(Releases: number[] | undefined): Release[] {
    const non6466Products: Release[] = [];
    if (Releases) {
      const foundReleases = this.releases.filter((dep) => {
        return (
          ![0, 4, 5, 6, 7].includes(dep.product) && Releases.includes(dep.id)
        );
      });
      foundReleases.forEach((dep) => {
        non6466Products.push(dep);
      });
    }
    return non6466Products;
  }

  getProductNameById(ProductId: number): string | undefined {
    const Product = this.products.find((fam) => {
      return fam.id === ProductId;
    });
    return Product?.name;
  }
}
