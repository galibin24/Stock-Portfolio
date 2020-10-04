import { Stock } from './../interfaces/stock';
import { StockService } from './../stock.service';
import { AfterViewInit, Component, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-stocks-list',
  templateUrl: './stocks-list.component.html',
  styleUrls: ['./stocks-list.component.css'],
})
export class StocksListComponent implements OnInit {
  stocks: Stock[] = [];
  constructor(private stockService: StockService) {}

  getStocks(): void {
    this.stockService.getStocks().map((stock) => {
      stock.subscribe((all) => {
        this.stocks.push(all);
      });
    });
  }

  ngOnInit(): void {
    this.getStocks();
  }
}
