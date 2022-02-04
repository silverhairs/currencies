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
 * A model for a daily exchange rate.
 */
export interface DailyRate {
  closingPrice: number;
  day: Date;
}

/**
 * An object that keeps track of an API request.
 */
abstract class TempRequest {
  constructor(protected requestTime: Date) {}

  /**
   * Wether this Request is expired or not. A TempRequest has a lifespan of 1h.
   */
  get isExpired(): boolean {
    return new Date().getHours() - this.requestTime.getHours() > 0;
  }

  /**
   * Parses this TempRequest into a JSON string.
   * @returns {string} Returns a JSON string.
   */
  abstract toJson(): string;
}

/**
 * A request of an exchange rate. Its lifepsan is of 1hour, after that time, it expires.
 */
export class ExchangeRateRequest extends TempRequest implements Exchange {
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
    super(_.requestTime);
    this.baseCurrency = _.baseCurrency;
    this.targetCurrency = _.targetCurrency;
    this.requestTime = _.requestTime;
    this.rate = _.rate;
  }

  override toJson(): string {
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

/**
 * A request of an exchange rate history, Its lifespan is 1h, after that time, it expires.
 */
export class HistoryRequest extends TempRequest {
  history: DailyRate[];
  requestTime: Date;

  constructor(private _history: DailyRate[], private _requestTime: Date) {
    super(_requestTime);
    this.history = _history;
    this.requestTime = _requestTime;
  }

  override toJson(): string {
    return JSON.stringify({
      history: this.history,
      requestTime: this.requestTime,
    });
  }

  static fromJson(raw: string): HistoryRequest {
    const data = JSON.parse(raw);
    return new HistoryRequest(data.history, new Date(data.requestTime));
  }
}
