import { Component, OnInit } from '@angular/core';
import { Release, Product } from '@version-finder/version-finder-lib';
import { VersionManagerService } from '../services/version-manager.service';
import { AddDependencyMessage } from './add-dependency/add-dependency-message';

@Component({
  selector: 'version-finder-add-release',
  templateUrl: './add-release.component.html',
  styleUrls: ['./add-release.component.scss'],
})
export class AddReleaseComponent implements OnInit {
  releases: Release[] = [];
  products: Product[] = [];

  constructor(private versionManagerService: VersionManagerService) {}

  ngOnInit(): void {
    this.refreshReleases();
    this.refreshProducts();
  }

  refreshReleases() {
    this.versionManagerService
      .getAllReleases()
      .subscribe((releases: Release[]) => {
        this.releases = releases;
      });
  }

  refreshProducts() {
    this.versionManagerService
      .getAllProducts()
      .subscribe((products: Product[]) => {
        this.products = products;
      });
  }

  getReleasesByProduct(productId: number): Release[] {
    const releases = this.releases.filter((dep) => {
      return dep.product === productId;
    });
    return releases;
  }

  getReleasesForRelease(releases: number[]): Release[] {
    const foundReleases: Release[] = [];
    releases.forEach((depId) => {
      const foundDep = this.releases.find((dep) => {
        return dep.id === depId;
      });
      if (foundDep) {
        foundReleases.push(foundDep);
      }
    });
    return foundReleases;
  }

  getProductNameById(ProductId: number): string | undefined {
    const Product = this.products.find((fam) => {
      return fam.id === ProductId;
    });
    return Product?.name;
  }

  addReleaseEvent(event: AddDependencyMessage) {
    const releaseToGetNewRelease = this.releases.find((dep) => {
      return dep.id === event.releaseId;
    });
    if (releaseToGetNewRelease) {
      releaseToGetNewRelease.releases.push(event.newReleaseId);
      this.versionManagerService
        .updateRelease(releaseToGetNewRelease)
        .subscribe((result: boolean) => {
          console.log(result);
          this.refreshReleases();
        });
    }
  }

  onDelete(releaseId: number, ReleaseId: number) {
    console.log(
      `got delete request for release ${releaseId}'s Release ${ReleaseId}`
    );
    const confirmResult = confirm(
      'Are you sure you want to delete the Release?'
    );
    if (confirmResult) {
      const release = this.releases.find((rel) => {
        return rel.id === releaseId;
      });
      if (release) {
        const indexOfRelease = release.releases.findIndex((rel) => {
          return rel === ReleaseId;
        });
        if (indexOfRelease >= 0) {
          release.releases.splice(indexOfRelease, 1);
          this.versionManagerService
            .updateRelease(release)
            .subscribe((result: boolean) => {
              console.log(result);
              this.refreshReleases();
            });
        }
      }
    }
  }

  onReleaseDateUpdate(
    release: Release,
    newReleaseDate: string,
    newVersionNumber: string
  ) {
    console.log(
      `release: ${JSON.stringify(release)} new date: ${JSON.stringify(
        newReleaseDate
      )} new version: ${JSON.stringify(newVersionNumber)}`
    );
    release.version = newVersionNumber;
    release.releaseDate = newReleaseDate;
    this.versionManagerService
      .updateRelease(release)
      .subscribe((result: boolean) => {
        console.log(result);
        this.refreshReleases();
      });
  }

  addRelease(releaseVersion: string, ProductId: number) {
    console.log(`adding release ${releaseVersion} for Product ${ProductId}`);
    const newRelease = new Release(-1, ProductId, releaseVersion, true, []);
    this.versionManagerService
      .addRelease(newRelease)
      .subscribe((result: boolean) => {
        console.log(result);
        this.refreshReleases();
      });
  }

  deleteRelease(releaseId: number) {
    console.log(`got delete request for release ${releaseId}'`);
    const confirmResult = confirm(
      'Are you sure you want to delete the release?'
    );
    if (confirmResult) {
      const releaseToDelete = this.releases.find((rel) => {
        return rel.id === releaseId;
      });
      if (releaseToDelete) {
        this.versionManagerService
          .deleteRelease(releaseToDelete)
          .subscribe((result: boolean) => {
            console.log(result);
            this.refreshReleases();
          });
      }
    }
  }
}
