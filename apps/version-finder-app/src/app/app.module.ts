import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { AddReleaseComponent } from './add-release/add-release.component';
import { FindDependenciesComponent } from './find-dependencies/find-dependencies.component';
import { AddFamilyComponent } from './add-family/add-family.component';
import { LatestReleasesComponent } from './latest-releases/latest-releases.component';
import { TestComponentComponent } from './test-component/test-component.component';
import { AddDependencyComponent } from './add-release/add-dependency/add-dependency.component';

const routes: Routes = [
  { path: 'add-release', component: AddReleaseComponent },
  { path: 'add-family', component: AddFamilyComponent },
  { path: 'release-lookup', component: FindDependenciesComponent },
  { path: '**', component: LatestReleasesComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    AddReleaseComponent,
    FindDependenciesComponent,
    AddFamilyComponent,
    LatestReleasesComponent,
    TestComponentComponent,
    AddDependencyComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
