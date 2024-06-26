import {Big, type BigSource} from '../index.js';
import {FasterMovingAverage, MovingAverage} from '../MA/MovingAverage.js';

/**
 * Simple Moving Average (SMA)
 * Type: Trend
 *
 * The Simple Moving Average (SMA) creates an average of all prices within a fixed interval. The SMA weights the prices
 * of all periods equally which makes it not as responsive to recent prices as the EMA.
 *
 * @see https://www.investopedia.com/terms/s/sma.asp
 */
export class SMA extends MovingAverage {
  public readonly prices: BigSource[] = [];

  override update(price: BigSource, replace: boolean = false): Big | void {
    if (this.prices.length && replace) {
      this.prices[this.prices.length - 1] = price;
    } else {
      this.prices.push(price);
    }

    if (this.prices.length > this.interval) {
      this.prices.shift();
    }

    if (this.prices.length === this.interval) {
      return this.setResult(SMA.getResultFromBatch(this.prices), replace);
    }
  }

  static getResultFromBatch(prices: BigSource[]): Big {
    const sum = prices.reduce((a: Big, b: BigSource) => a.plus(b), new Big('0'));
    return sum.div(prices.length || 1);
  }
}

export class FasterSMA extends FasterMovingAverage {
  public readonly prices: number[] = [];

  update(price: number, replace: boolean = false): void | number {
    if (this.prices.length && replace) {
      this.prices[this.prices.length - 1] = price;
    } else {
      this.prices.push(price);
    }

    if (this.prices.length > this.interval) {
      this.prices.shift();
    }

    if (this.prices.length === this.interval) {
      const sum = this.prices.reduce((a, b) => a + b, 0);
      return this.setResult(sum / this.prices.length, replace);
    }
  }
}
