import { FixedArray } from 'types';

/**
 * A model for a currency.
 */
export interface Currency {
  value: string;
  label: string;
  symbol: string;
}

/**
 * A model for an exchange. Holds the exchanges base currency, target currency and the exchange rate.
 */
export interface Exchange {
  baseCurrency: Currency;
  targetCurrency: Currency;
  rate: 1;
}

/**
 * A request of an exchange rate. Its lifepsan is of 1hour, after that, it expires.
 */
export class ExchangeRateRequest implements Exchange {
  baseCurrency: Currency;
  targetCurrency: Currency;
  rate: 1;
  requestTime: Date;

  constructor(
    private _: {
      baseCurrency: Currency;
      targetCurrency: Currency;
      rate: 1;
      requestTime: Date;
    }
  ) {
    this.baseCurrency = _.baseCurrency;
    this.targetCurrency = _.targetCurrency;
    this.requestTime = _.requestTime;
    this.rate = _.rate;
  }

  /**
   * Wether this ExchangeRateRequest is expired or not. An ExchangeRateRequest object has a lifespan of 1h.
   */
  get isExpired(): boolean {
    return new Date().getHours() - this.requestTime.getHours() > 0;
  }

  /**
   * Parses this ExchangeRateRequest into a JSON string.
   * @returns {string} Returns a JSON string.
   */
  toJson(): string {
    return JSON.stringify({
      baseCurrency: this.baseCurrency,
      targetCurrency: this.targetCurrency,
      rate: this.rate,
      requestTime: this.requestTime,
    });
  }

  /**
   * Deserializes a JSON into an ExchangeRateRequest object.
   * @param raw {string} The JSON string of a ExchangeRateRequest object.
   * @returns {ExchangeRateRequest} Returns a new ExchangeRateRequest object.
   */
  static fromJson(raw: string): ExchangeRateRequest {
    const data = JSON.parse(raw);
    return new ExchangeRateRequest({
      ...data,
      requestTime: new Date(data.requestTime),
    });
  }
}

export interface DailyRate {
  closingPrice: number;
  day: Date;
}

export interface WeeklyRate {
  days: FixedArray<DailyRate, 5>;
}
