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
    this.versionManagerService
      .getAllDependencies()
      .subscribe((dependencies: Dependency[]) => {
        this.dependencies = dependencies;
      });
    this.refreshFamilies();
  }

  refreshFamilies() {
    this.versionManagerService
      .getAllFamilies()
      .subscribe((families: Family[]) => {
        this.families = families;
      });
  }

  addFamily(newFamilyName: string) {
    console.log('got it ');
    const newFamily = new Family(-1, newFamilyName);
    this.versionManagerService.addFamily(newFamily).subscribe((result: any) => {
      console.log(result);
      this.refreshFamilies();
    });
  }
}
