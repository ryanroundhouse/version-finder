import { Component, OnInit } from '@angular/core';
import { Release, Product } from '@version-finder/version-finder-lib';
import { VersionManagerService } from '../services/version-manager.service';
import { AddDependencyMessage } from './add-dependency/add-dependency-message';
import {
  faQuestionCircle,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'version-finder-add-release',
  templateUrl: './add-release.component.html',
  styleUrls: ['./add-release.component.scss'],
})
export class AddReleaseComponent implements OnInit {
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

  getDependenciesForRelease(releases: number[]): Release[] {
    const foundDependencies: Release[] = [];
    releases.forEach((depId) => {
      const foundDep = this.releases.find((dep) => {
        return dep.id === depId;
      });
      if (foundDep) {
        foundDependencies.push(foundDep);
      }
    });
    return foundDependencies;
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
      releaseToGetNewRelease.dependencies.push(event.newReleaseId);
      this.versionManagerService
        .updateRelease(releaseToGetNewRelease)
        .subscribe((result: boolean) => {
          console.log(result);
          this.refreshReleases();
        });
    }
  }

  onDeleteDependency(releaseId: number, dependencyId: number) {
    console.log(
      `got delete request for release ${releaseId}'s dependency ${dependencyId}`
    );
    const confirmResult = confirm(
      'Are you sure you want to delete the Dependency?'
    );
    if (confirmResult) {
      const release = this.releases.find((rel) => {
        return rel.id === releaseId;
      });
      if (release) {
        const indexOfDependency = release.dependencies.findIndex((dep) => {
          return dep === dependencyId;
        });
        if (indexOfDependency >= 0) {
          release.dependencies.splice(indexOfDependency, 1);
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

  addRelease(
    releaseVersion: string,
    newReleaseReleaseDate: string,
    ProductId: number
  ) {
    console.log(`adding release ${releaseVersion} for Product ${ProductId}`);
    const newRelease = new Release(
      -1,
      ProductId,
      releaseVersion,
      true,
      [],
      newReleaseReleaseDate
    );
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
