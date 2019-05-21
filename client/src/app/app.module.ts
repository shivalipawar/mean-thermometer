import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
} from "@angular/material";

import {AppComponent} from './app.component';
import { UploadComponent } from './upload/upload.component';
import { TemperatureChartComponent } from './temperature-chart/temperature-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    TemperatureChartComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
