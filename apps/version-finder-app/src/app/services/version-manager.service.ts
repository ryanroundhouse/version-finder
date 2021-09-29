import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dependency, Family } from '@version-finder/version-finder-lib';

@Injectable({
  providedIn: 'root',
})
export class VersionManagerService {
  private readonly baseUrl: string = 'http://localhost:3333';

  constructor(private http: HttpClient) {}

  getAllDependencies(): Observable<Dependency[]> {
    return this.http.get<Dependency[]>(`${this.baseUrl}/dependencies/get`);
  }

  getAllFamilies(): Observable<Family[]> {
    return this.http.get<Family[]>(`${this.baseUrl}/families/get`);
  }

  addFamily(newFamily: Family): any {
    return this.http.post<any>(`${this.baseUrl}/families/add`, {
      family: JSON.stringify(newFamily),
    });
  }

  updateDependency(releaseToGetNewDependency: Dependency) {
    return this.http.post<any>(`${this.baseUrl}/dependencies/update`, {
      dependency: JSON.stringify(releaseToGetNewDependency),
    });
  }

  updateFamily(newFamily: Family): any {
    return this.http.post<any>(`${this.baseUrl}/families/update`, {
      family: JSON.stringify(newFamily),
    });
  }
}
