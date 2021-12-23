import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Release, Product } from '@version-finder/version-finder-lib';

@Injectable({
  providedIn: 'root',
})
export class VersionFinderService {
  private readonly port = 80;
  private readonly baseUrl: string = `http://10.101.10.58:${this.port}`;

  constructor(private http: HttpClient) {}

  findReleases(Releases: Release[]): Observable<Release[]> {
    const ReleasesToSearch = JSON.stringify(Releases);
    return this.http.post<Release[]>(`${this.baseUrl}/find-Releases`, {
      Releases: ReleasesToSearch,
    });
  }
}
