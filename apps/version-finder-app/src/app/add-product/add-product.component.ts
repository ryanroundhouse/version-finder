import { Component, OnInit } from '@angular/core';
import { Release, Product } from '@version-finder/version-finder-lib';
import { VersionManagerService } from '../services/version-manager.service';
import {
  faQuestionCircle,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'version-finder-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  releases: Release[] = [];
  products: Product[] = [];
  newProductName = '';
  faQuestionCircle: IconDefinition = faQuestionCircle;

  constructor(private versionManagerService: VersionManagerService) {}

  ngOnInit(): void {
    this.versionManagerService
      .getAllReleases()
      .subscribe((Releases: Release[]) => {
        this.releases = Releases;
      });
    this.refreshProducts();
  }

  refreshProducts() {
    this.versionManagerService
      .getAllProducts()
      .subscribe((Products: Product[]) => {
        this.products = Products;
      });
  }

  addProduct(newProductName: string, productType: string) {
    console.log('got it ');
    const newProduct = new Product(
      -1,
      newProductName,
      productType as
        | 'CIS Releases'
        | '7 Module Releases'
        | 'Addon Releases'
        | 'NSBL Releases'
    );
    this.versionManagerService
      .addProduct(newProduct)
      .subscribe((result: boolean) => {
        console.log(result);
        this.refreshProducts();
      });
    const productNameTextBox = document.getElementById('productNameInputBox');
    console.log((<HTMLInputElement>productNameTextBox).value);
    (<HTMLInputElement>productNameTextBox).value = '';
  }

  deleteProduct(productId: string) {
    console.log(`got delete request for product ${productId}`);
    const confirmResult = confirm(
      'Are you sure you want to delete this Product?'
    );
    if (confirmResult) {
      const productToDelete = this.products.find((prod) => {
        return prod.id === Number(productId);
      });
      if (productToDelete) {
        const indexOfProductToDelete = this.products.findIndex((prod) => {
          return prod === productToDelete;
        });
        if (indexOfProductToDelete >= 0) {
          this.products.splice(indexOfProductToDelete, 1);
          this.versionManagerService
            .deleteProduct(productToDelete)
            .subscribe((result: boolean) => {
              console.log(result);
              this.refreshProducts();
            });
        }
      }
    }
  }

  updateProduct(productName: string, productId: string, productType: string) {
    const productToUpdate = this.products.find((fam) => {
      return fam.id === Number(productId);
    });
    if (productToUpdate) {
      productToUpdate.name = productName;
      productToUpdate.productType = productType as
        | 'CIS Releases'
        | '7 Module Releases'
        | 'Addon Releases'
        | 'NSBL Releases';
      this.versionManagerService
        .updateProduct(productToUpdate)
        .subscribe((result: boolean) => {
          console.log(result);
          this.refreshProducts();
        });
    }
  }
}
