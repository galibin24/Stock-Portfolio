import { Injectable } from '@angular/core';
import { observable, Observable, of, forkJoin, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { stockRecommendations } from './../assets/stocksRecomendations';
import { Stock } from './interfaces/stock';
import { mapToMapExpression } from '@angular/compiler/src/render3/util';
import { catchError, concatAll, map, mergeAll, tap } from 'rxjs/operators';
import { ComplexOuterSubscriber } from 'rxjs/internal/innerSubscribe';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}

  getStockData(ticker: string, startDate: string, endDate: string) {
    const stockUrl: string = `/v8/finance/chart/${ticker}?period1=${startDate}&period2=${endDate}&interval=1d`;
    console.log(stockUrl);
    return (
      this.http
        // TODO write better type
        .get<any>(stockUrl)
        .pipe(map((result) => result.chart.result[0]))
    );
  }

  processStockData(stockData, recommendation) {
    let stockPrices: number[] = stockData.indicators.adjclose[0].adjclose;

    let boughtPrice: number = stockPrices[0];
    let currentPrice: number = stockPrices[stockPrices.length - 1];

    let stockReturn =
      ((currentPrice / boughtPrice - 1) * 1000).toFixed(1).toString() + '%';

    let stockInfo = {
      ...recommendation,
      return: stockReturn,
      boughtPrice: boughtPrice.toFixed(1).toString(),
      currentPrice: currentPrice.toFixed(1).toString(),
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

  getStocks() {
    return stockRecommendations.map((reccomendation) =>
      this.getStockData(
        'AAPL',
        this.dateToTimestamp('2020-09-18'),
        this.currentDate()
      ).pipe(
        map((result) => {
          return this.processStockData(result, reccomendation);
        })
      )
    );
  }
}

// https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?period1={StartDate}&period1={endDate}&interval=1d
// period1 - startdate
// period2 - enddate
//
// https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?range=1y&interval=1d
// 'https://query1.finance.yahoo.com/v8/finance/chart/AAPL'
