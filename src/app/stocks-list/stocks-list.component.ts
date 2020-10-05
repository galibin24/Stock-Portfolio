import { Stock } from './../interfaces/stock';
import { StockService } from './../stock.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-stocks-list',
  templateUrl: './stocks-list.component.html',
  styleUrls: ['./stocks-list.component.css'],
})
export class StocksListComponent {
  stocks: Stock[] = [];
  portfolioReturn: string;
  sp500Return: string;
  constructor(private stockService: StockService) {}

  addCollapseSign(collapseName) {
    let fixName = '#' + collapseName;
    return fixName;
  }

  getSP500Return() {
    this.stockService
      .getSP500Return()
      .subscribe((result) => (this.sp500Return = result));
  }
  getPortfolioReturn(): void {
    this.stockService.getPortfolioReturn().subscribe((stocks) => {
      const totalReturn = stocks.reduce((accum, curr) => {
        return {
          intReturn: parseInt(accum.intReturn) + parseInt(curr.intReturn),
        };
      });
      console.log(totalReturn);
      this.portfolioReturn =
        (totalReturn.intReturn / stocks.length).toFixed(1).toString() + '%';
    });
  }

  getStocks(): void {
    this.stockService.getStocks().map((stock) => {
      stock.subscribe((all) => {
        this.stocks.push(all);
      });
    });
  }

  ngOnInit(): void {
    this.getStocks();
    this.getPortfolioReturn();
    this.getSP500Return();
  }
}
