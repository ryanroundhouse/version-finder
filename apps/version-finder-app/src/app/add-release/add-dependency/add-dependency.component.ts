import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Release, Product } from '@version-finder/version-finder-lib';
import { AddDependencyMessage } from './add-dependency-message';

@Component({
  selector: 'version-finder-add-dependency',
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.scss'],
})
export class AddDependencyComponent {
  @Input() Products: Product[] = [];
  @Input() Releases: Release[] = [];
  @Input() productId = -1;
  @Output() addReleaseEvent = new EventEmitter<AddDependencyMessage>();

  selectedProduct: Product = this.Products[0];
  versions: string[] = [];
  selectedVersion = '';

  onAdd() {
    const depToAdd = this.Releases.find((dep) => {
      return (
        dep.product === this.selectedProduct.id &&
        dep.version === this.selectedVersion
      );
    });
    if (depToAdd) {
      const addReleaseMessage: AddDependencyMessage = new AddDependencyMessage(
        this.productId,
        depToAdd.id
      );
      this.addReleaseEvent.emit(addReleaseMessage);
    }
  }

  onChangeProductSelection(value: Product) {
    const versionsOfProduct = this.Releases.filter((dep) => {
      return dep.product === value.id;
    }).map((dep) => {
      return dep.version;
    });
    this.versions = versionsOfProduct;
    this.selectedVersion = versionsOfProduct[0];
    console.log('found versions for this Product: ' + versionsOfProduct);
  }

  onChangeVersionSelection(value: string) {
    console.log(value);
  }
}
