import { Component, OnInit } from '@angular/core';
import { Release, Product } from '@version-finder/version-finder-lib';
import { VersionFinderService } from './services/version-finder.service';
import { VersionManagerService } from './services/version-manager.service';

@Component({
  selector: 'version-finder-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {
    console.log('started');
  }
}
