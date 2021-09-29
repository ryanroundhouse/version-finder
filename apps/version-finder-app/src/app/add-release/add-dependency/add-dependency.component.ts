import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Dependency, Family } from '@version-finder/version-finder-lib';
import { AddDependencyMessage } from './add-dependency-message';

@Component({
  selector: 'version-finder-add-dependency',
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.scss'],
})
export class AddDependencyComponent {
  @Input() families: Family[] = [];
  @Input() dependencies: Dependency[] = [];
  @Input() productId = -1;
  @Output() addDependencyEvent = new EventEmitter<AddDependencyMessage>();

  selectedFamily: Family = this.families[0];
  versions: string[] = [];
  selectedVersion = '';

  onAdd() {
    const depToAdd = this.dependencies.find((dep) => {
      return (
        dep.family === this.selectedFamily.id &&
        dep.version === this.selectedVersion
      );
    });
    if (depToAdd) {
      const addDependencyMessage: AddDependencyMessage =
        new AddDependencyMessage(this.productId, depToAdd.id);
      this.addDependencyEvent.emit(addDependencyMessage);
    }
  }

  onChangeProductSelection(value: Family) {
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
