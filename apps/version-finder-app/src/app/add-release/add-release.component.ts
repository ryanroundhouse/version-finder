import { Component, OnInit } from '@angular/core';
import { Dependency, Family } from '@version-finder/version-finder-lib';
import { VersionManagerService } from '../services/version-manager.service';

@Component({
  selector: 'version-finder-add-release',
  templateUrl: './add-release.component.html',
  styleUrls: ['./add-release.component.scss'],
})
export class AddReleaseComponent implements OnInit {
  dependencies: Dependency[] = [];
  families: Family[] = [];
  newFamilyName = '';

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

  onAdd(event: any) {
    console.log(event);
  }
}
