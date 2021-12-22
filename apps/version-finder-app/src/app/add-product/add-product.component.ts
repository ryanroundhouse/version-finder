import { Component, OnInit } from '@angular/core';
import { Release, Product } from '@version-finder/version-finder-lib';
import { VersionManagerService } from '../services/version-manager.service';

@Component({
  selector: 'version-finder-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  Releases: Release[] = [];
  Products: Product[] = [];
  newProductName = '';

  constructor(private versionManagerService: VersionManagerService) {}

  ngOnInit(): void {
    this.versionManagerService
      .getAllReleases()
      .subscribe((Releases: Release[]) => {
        this.Releases = Releases;
      });
    this.refreshProducts();
  }

  refreshProducts() {
    this.versionManagerService
      .getAllProducts()
      .subscribe((Products: Product[]) => {
        this.Products = Products;
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
    const ProductToUpdate = this.Products.find((fam) => {
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
