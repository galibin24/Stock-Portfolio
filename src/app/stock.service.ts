import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { stockRecommendations } from './../assets/stocksRecomendations';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}

  getStockData(ticker: string, startDate: string, endDate: string) {
    // console.log(`http://${environment.apiUrl}/api/`);
    const stockUrl: string = `${environment.apiUrl}/api/`;
    console.log(stockUrl);
    return this.http
      .get<any>(stockUrl, {
        params: {
          ticker,
          startDate,
          endDate,
        },
      })
      .pipe(map((result) => result.chart.result[0]));
  }

  processStockData(stockData, recommendation) {
    console.log(stockData);
    let stockPrices: number[] = stockData.indicators.adjclose[0].adjclose;

    let boughtPrice: number = stockPrices[0];
    let currentPrice: number = stockPrices[stockPrices.length - 1];

    let stockReturn =
      ((currentPrice / boughtPrice - 1) * 100).toFixed(1).toString() + '%';

    let color;
    if (stockReturn.includes('-')) {
      color = 'table-danger';
    } else {
      color = 'table-success';
    }

    let stockInfo = {
      ...recommendation,
      return: stockReturn,
      boughtPrice: boughtPrice.toFixed(1).toString(),
      currentPrice: currentPrice.toFixed(1).toString(),
      color: color,
      intReturn: ((currentPrice / boughtPrice - 1) * 100).toFixed(1),
    };

    return stockInfo;
  }

  dateToTimestamp(date: string): string {
    const parts: any = date.split('-');
    const newDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    return (newDate.getTime() / 1000).toString();
  }
  currentDate(): string {
    return Date.now().toString();
  }

  getPortfolioReturn() {
    return forkJoin(this.getStocks());
  }
  getSP500Return() {
    return this.getStockData(
      '^GSPC',
      this.dateToTimestamp('2020-06-03'),
      this.currentDate()
    ).pipe(
      map((result) => {
        let sp500Prices: number[] = result.indicators.adjclose[0].adjclose;

        let boughtPrice: number = sp500Prices[0];
        let currentPrice: number = sp500Prices[sp500Prices.length - 1];
        return (
          ((currentPrice / boughtPrice - 1) * 100).toFixed(1).toString() + '%'
        );
      })
    );
  }
  getStocks() {
    return stockRecommendations.map((reccomendation) =>
      this.getStockData(
        reccomendation.Symbol,
        this.dateToTimestamp(reccomendation.startDate),
        this.currentDate()
      ).pipe(
        map((result) => {
          return this.processStockData(result, reccomendation);
        })
      )
    );
  }
}
