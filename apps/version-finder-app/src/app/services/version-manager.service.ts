import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Release, Product } from '@version-finder/version-finder-lib';

@Injectable({
  providedIn: 'root',
})
export class VersionManagerService {
  private readonly port = 80;
  private readonly baseUrl: string = `http://10.101.10.58:${this.port}`;

  constructor(private http: HttpClient) {}

  getAllReleases(): Observable<Release[]> {
    return this.http.get<Release[]>(`${this.baseUrl}/Releases/get`);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/Products/get`);
  }

  addProduct(newProduct: Product): Observable<boolean> {
    const result = this.http.post<boolean>(`${this.baseUrl}/Products/add`, {
      Product: JSON.stringify(newProduct),
    });
    return result;
  }

  addRelease(newRelease: Release): Observable<boolean> {
    const result = this.http.post<boolean>(`${this.baseUrl}/Releases/add`, {
      Release: JSON.stringify(newRelease),
    });
    return result;
  }

  deleteRelease(releaseToDelete: Release) {
    const result = this.http.post<boolean>(`${this.baseUrl}/Releases/delete`, {
      Release: JSON.stringify(releaseToDelete),
    });
    return result;
  }

  deleteProduct(productToDelete: Product) {
    const result = this.http.post<boolean>(`${this.baseUrl}/Products/delete`, {
      Product: JSON.stringify(productToDelete),
    });
    return result;
  }

  updateRelease(releaseToGetNewRelease: Release): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/Releases/update`, {
      Release: JSON.stringify(releaseToGetNewRelease),
    });
  }

  updateProduct(newProduct: Product): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/Products/update`, {
      Product: JSON.stringify(newProduct),
    });
  }
}
