import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { StocksListComponent } from './stocks-list/stocks-list.component';
import { StockItemComponent } from './stock-item/stock-item.component';

@NgModule({
  declarations: [AppComponent, StocksListComponent, StockItemComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
