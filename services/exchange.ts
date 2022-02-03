/**
 * [Alphavantage](https://alphavantage.co)'s API key.
 */
const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://www.alphavantage.co';

interface ExchangeRateRequest extends Exchange {
  requestTime: Date;
}

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
 * Class that handles the business logic of `Exchange` objects with the given list of currencies.
 */
export class ExchangeService {
  /**
   * Get the exchange rate of the passed exchange
   * @param exchange {Exchange} The exchange whose rate is being obtained.
   * @returns {Promise<ExchangeRateRequest>} Returns an ExchangeRate object.
   */
  async getExchangeRate(exchange: Exchange): Promise<Exchange> {
    const key = this.getExchangeKey(exchange);
    const savedExchange = localStorage.getItem(key);
    let exchangeRequest: ExchangeRateRequest | undefined;

    if (savedExchange === null) {
      exchangeRequest = await this.fetchExchange(exchange);
      this.cacheExchange(exchangeRequest);
    } else {
      exchangeRequest = this.getExchangeRequestFromJSON(savedExchange);
      const isExpired =
        new Date().getHours() - exchangeRequest.requestTime.getHours() > 0;
      if (isExpired) {
        exchangeRequest = await this.fetchExchange(exchange);
        this.cacheExchange(exchangeRequest);
      }
    }

    return exchangeRequest;
  }

  protected async fetchExchange(
    exchange: Exchange
  ): Promise<ExchangeRateRequest> {
    const raw = await fetch(
      `${BASE_URL}//query?function=CURRENCY_EXCHANGE_RATE&from_currency=${exchange.baseCurrency.value}&to_currency=${exchange.targetCurrency.value}&apikey=${API_KEY}`
    );
    const data = await raw.json();
    return {
      ...exchange,
      rate: data['Realtime Currency Exchange Rate']['5. Exchange Rate'],
      requestTime: new Date(),
    };
  }

  private cacheExchange(exchange: ExchangeRateRequest): void {
    const key = this.getExchangeKey(exchange);
    localStorage.setItem(key, JSON.stringify(exchange));
  }

  private getExchangeRequestFromJSON(raw: string): ExchangeRateRequest {
    const data = JSON.parse(raw);
    return {
      ...data,
      requestTime: new Date(data.requestTime),
    };
  }

  /**
   * Gets the local storage key of the passed exchange.
   * @param e {Exchange} The exchange whose key is being obtained.
   * @returns {string} Returns the key where the passed exchange is saved in local storage.
   */
  private getExchangeKey(e: Exchange): string {
    return `exchange--${e.baseCurrency.value}-${e.targetCurrency.value}`;
  }
}
