import { Component, OnInit } from '@angular/core';
import { Release, Product } from '@version-finder/version-finder-lib';
import { VersionManagerService } from '../services/version-manager.service';
import {
  faQuestionCircle,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

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

  addProduct(newProductName: string) {
    console.log('got it ');
    const newProduct = new Product(-1, newProductName);
    this.versionManagerService
      .addProduct(newProduct)
      .subscribe((result: boolean) => {
        console.log(result);
        this.refreshProducts();
      });
  }

  updateProduct(ProductName: string, ProductId: string) {
    // update the Product
    const ProductToUpdate = this.products.find((fam) => {
      return fam.id === Number(ProductId);
    });
    if (ProductToUpdate) {
      ProductToUpdate.name = ProductName;
      this.versionManagerService
        .updateProduct(ProductToUpdate)
        .subscribe((result: boolean) => {
          console.log(result);
          this.refreshProducts();
        });
    }
  }
}
