import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { AddReleaseComponent } from './add-release/add-release.component';
import { FindDependenciesComponent } from './find-dependencies/find-dependencies.component';

const routes: Routes = [
  { path: 'add', component: AddReleaseComponent },
  { path: '**', component: FindDependenciesComponent },
];

@NgModule({
  declarations: [AppComponent, AddReleaseComponent, FindDependenciesComponent],
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
