import { Component, Input } from '@angular/core';
import { Product, Release } from '@version-finder/version-finder-lib';
import * as moment from 'moment';

@Component({
  selector: 'version-finder-release-panel',
  templateUrl: './release-panel.component.html',
  styleUrls: ['./release-panel.component.scss'],
})
export class ReleasePanelComponent {
  @Input() product!: Product;
  @Input() release!: Release | undefined;

  @Input() products!: Product[];
  @Input() releases!: Release[];

  getFriendlyDate(dateString: string | undefined) {
    if (dateString) {
      return moment(dateString).format('MMMM DD, YYYY');
    } else {
      return undefined;
    }
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
    console.log(`found non 64/66 releases: ${JSON.stringify(non6466Products)}`);
    return non6466Products;
  }

  getProductNameById(ProductId: number): string | undefined {
    const Product = this.products.find((fam) => {
      return fam.id === ProductId;
    });
    return Product?.name;
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
    console.log(`found 64 releases: ${JSON.stringify(stream64Products)}`);
    return stream64Products;
  }

  get66Releases(Releases: number[] | undefined): Release[] {
    const stream66Products: Release[] = [];
    if (Releases) {
      const foundReleases = this.releases.filter((dep) => {
        return [4, 5].includes(dep.product) && Releases.includes(dep.id);
      });
      foundReleases.forEach((dep) => {
        stream66Products.push(dep);
      });
    }
    console.log(`found 66 releases: ${JSON.stringify(stream66Products)}`);
    return stream66Products;
  }
}
