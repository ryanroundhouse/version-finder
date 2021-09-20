import { Component, OnInit } from '@angular/core';
import { Dependency, Family } from '@version-finder/version-finder-lib';
import { VersionManagerService } from '../services/version-manager.service';

@Component({
  selector: 'version-finder-latest-releases',
  templateUrl: './latest-releases.component.html',
  styleUrls: ['./latest-releases.component.scss'],
})
export class LatestReleasesComponent implements OnInit {
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
        console.log(`found dependencies: ${JSON.stringify(this.dependencies)}`);
      });
  }

  refreshFamilies() {
    this.versionManagerService
      .getAllFamilies()
      .subscribe((families: Family[]) => {
        this.families = families;
        console.log(`found families: ${JSON.stringify(this.families)}`);
      });
  }

  getLatestReleaseByFamily(
    familyId: number | undefined
  ): Dependency | undefined {
    let latestRelease: Dependency | undefined;
    if (familyId !== undefined) {
      latestRelease = this.dependencies.find((dep) => {
        return dep.family === familyId;
      });
    }
    return latestRelease;
  }

  getDependenciesForRelease(dependencies: number[] | undefined): Dependency[] {
    const foundDependencies: Dependency[] = [];
    if (dependencies) {
      dependencies.forEach((depId) => {
        const foundDep = this.dependencies.find((dep) => {
          return dep.id === depId;
        });
        if (foundDep) {
          foundDependencies.push(foundDep);
        }
      });
    }
    return foundDependencies;
  }

  getFamilyNameById(familyId: number): string | undefined {
    const family = this.families.find((fam) => {
      return fam.id === familyId;
    });
    return family?.name;
  }
}
