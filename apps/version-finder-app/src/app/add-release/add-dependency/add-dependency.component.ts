import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Dependency, Family } from '@version-finder/version-finder-lib';

@Component({
  selector: 'version-finder-add-dependency',
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.scss'],
})
export class AddDependencyComponent {
  @Input() families: Family[] = [];
  @Input() dependencies: Dependency[] = [];
  @Output() addDependencyEvent = new EventEmitter<number>();

  selectedFamily: Family = this.families[0];
  versions: string[] = [];
  selectedVersion = '';

  constructor() {
    console.log('child constructor');
  }

  onAdd(event: any) {
    const depToAdd = this.dependencies.find((dep) => {
      return (
        dep.family === this.selectedFamily.id &&
        dep.version === this.selectedVersion
      );
    });
    if (depToAdd) {
      this.addDependencyEvent.emit(depToAdd.id);
    }
    console.log(`child event: ${event}`);
  }

  onChangeProductSelection(value: any) {
    const versionsOfFamily = this.dependencies
      .filter((dep) => {
        return dep.family === value.id;
      })
      .map((dep) => {
        return dep.version;
      });
    this.versions = versionsOfFamily;
    this.selectedVersion = versionsOfFamily[0];
    console.log('found versions for this family: ' + versionsOfFamily);
  }

  onChangeVersionSelection(value: string) {
    console.log(value);
  }
}
