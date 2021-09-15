import { Component, OnInit } from '@angular/core';
import { Dependency, Family } from '@version-finder/version-finder-lib';
import { VersionFinderService } from './services/version-finder.service';

@Component({
  selector: 'version-finder-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  dependencies: Dependency[] = [];
  families: Family[] = [{ id: 0, name: 'test' }];
  selectedFamily: Family = this.families[0];
  versions: string[] = [];
  selectedVersion = '';
  foundDependencies: Dependency[] = [];

  constructor(private versionFinderService: VersionFinderService) {}

  ngOnInit(): void {
    this.versionFinderService
      .getAllDependencies()
      .subscribe((dependencies: Dependency[]) => {
        this.dependencies = dependencies;
      });
    this.versionFinderService
      .getAllFamilies()
      .subscribe((families: Family[]) => {
        this.families = families;
        // this.selectedFamily = this.families[0];
      });
  }

  onChangeFamilySelection(value: Family) {
    const versionsOfFamily = this.dependencies
      .filter((dep) => {
        return dep.family === value.id;
      })
      .map((dep) => {
        return dep.version;
      });
    this.versions = versionsOfFamily;
    this.selectedVersion = versionsOfFamily[0];
    this.foundDependencies = [];
    console.log('found versions for this family: ' + versionsOfFamily);
  }

  onChangeVersionSelection(value: string) {
    this.foundDependencies = [];
    console.log(value);
  }

  getFamilyFromId(familyId: number): Family | undefined {
    const family = this.families.find((family) => {
      return family.id === familyId;
    });
    return family;
  }

  onSearch(event: any) {
    const depToSearchFor = this.dependencies.find((dep) => {
      return (
        dep.family === this.selectedFamily.id &&
        dep.version === this.selectedVersion
      );
    });
    console.log(`searching for ${JSON.stringify(depToSearchFor)}`);
    if (depToSearchFor) {
      this.versionFinderService
        .findDependencies([depToSearchFor])
        .subscribe((foundDependencies: Dependency[]) => {
          this.foundDependencies = foundDependencies;
          console.log('found: ' + this.foundDependencies);
        });
    }
  }
}
