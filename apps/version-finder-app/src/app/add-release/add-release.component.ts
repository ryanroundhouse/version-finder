import { Component, OnInit } from '@angular/core';
import { Dependency, Family } from '@version-finder/version-finder-lib';
import { VersionManagerService } from '../services/version-manager.service';
import { AddDependencyMessage } from './add-dependency/add-dependency-message';

@Component({
  selector: 'version-finder-add-release',
  templateUrl: './add-release.component.html',
  styleUrls: ['./add-release.component.scss'],
})
export class AddReleaseComponent implements OnInit {
  dependencies: Dependency[] = [];
  families: Family[] = [];

  constructor(private versionManagerService: VersionManagerService) {}

  ngOnInit(): void {
    this.refreshDependencies();
    this.refreshFamilies();
  }

  refreshDependencies() {
    this.versionManagerService
      .getAllDependencies()
      .subscribe((dependencies: Dependency[]) => {
        this.dependencies = dependencies;
      });
  }

  refreshFamilies() {
    this.versionManagerService
      .getAllFamilies()
      .subscribe((families: Family[]) => {
        this.families = families;
      });
  }

  getReleasesByFamily(familyId: number): Dependency[] {
    const releases = this.dependencies.filter((dep) => {
      return dep.family === familyId;
    });
    return releases;
  }

  getDependenciesForRelease(dependencies: number[]): Dependency[] {
    const foundDependencies: Dependency[] = [];
    dependencies.forEach((depId) => {
      const foundDep = this.dependencies.find((dep) => {
        return dep.id === depId;
      });
      if (foundDep) {
        foundDependencies.push(foundDep);
      }
    });
    return foundDependencies;
  }

  getFamilyNameById(familyId: number): string | undefined {
    const family = this.families.find((fam) => {
      return fam.id === familyId;
    });
    return family?.name;
  }

  addDependencyEvent(event: AddDependencyMessage) {
    console.log(`got add dependency event: ${JSON.stringify(event)}`);
    const releaseToGetNewDependency = this.dependencies.find((dep) => {
      return dep.id === event.releaseId;
    });
    if (releaseToGetNewDependency) {
      releaseToGetNewDependency.dependencies.push(event.newDependencyId);
      this.versionManagerService
        .updateDependency(releaseToGetNewDependency)
        .subscribe((result: boolean) => {
          console.log(result);
          this.refreshDependencies();
        });
    }
  }

  onDelete(releaseId: number, dependencyId: number) {
    console.log(
      `got delete request for release ${releaseId}'s dependency ${dependencyId}`
    );
    const release = this.dependencies.find((rel) => {
      return rel.id === releaseId;
    });
    if (release) {
      const indexOfDependency = release.dependencies.findIndex((rel) => {
        return rel === dependencyId;
      });
      console.log(`found index of dependency: ${indexOfDependency}`);
      if (indexOfDependency >= 0) {
        release.dependencies.splice(indexOfDependency, 1);
        console.log(`new release after delete: ${JSON.stringify(release)}`);
        this.versionManagerService
          .updateDependency(release)
          .subscribe((result: boolean) => {
            console.log(result);
            this.refreshDependencies();
          });
      }
    }
  }

  addRelease(releaseVersion: string, familyId: number) {
    console.log(`adding release ${releaseVersion} for family ${familyId}`);
    const newRelease = new Dependency(-1, familyId, releaseVersion, true, []);
    this.versionManagerService
      .addRelease(newRelease)
      .subscribe((result: boolean) => {
        console.log(result);
        this.refreshDependencies();
      });
  }
}
