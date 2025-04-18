import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DataChartComponent } from './data-chart/data-chart.component';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { JsonToTableModule } from 'json-to-table-com';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    HttpClientModule,
    DataChartComponent,
    BrowserModule,
    JsonToTableModule,
    BaseChartDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
