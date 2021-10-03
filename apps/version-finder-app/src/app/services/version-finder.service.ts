import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dependency, Family } from '@version-finder/version-finder-lib';

@Injectable({
  providedIn: 'root',
})
export class VersionFinderService {
  private readonly port = 80;
  private readonly baseUrl: string = `http://localhost:${this.port}`;

  constructor(private http: HttpClient) {}

  findDependencies(dependencies: Dependency[]): Observable<Dependency[]> {
    const dependenciesToSearch = JSON.stringify(dependencies);
    return this.http.post<Dependency[]>(`${this.baseUrl}/find-dependencies`, {
      dependencies: dependenciesToSearch,
    });
  }
}
