import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Release, Product } from '@version-finder/version-finder-lib';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VersionFinderService {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  findReleases(Releases: Release[]): Observable<Release[]> {
    const ReleasesToSearch = JSON.stringify(Releases);
    return this.http.post<Release[]>(`${this.baseUrl}/find-Releases`, {
      Releases: ReleasesToSearch,
    });
  }
}
