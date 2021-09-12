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
  families: Family[] = [];
  selectedFamilyId = 0;

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
      });
  }
}
