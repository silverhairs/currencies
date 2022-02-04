import { Exchange, ExchangeRateRequest } from './models';

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://www.alphavantage.co';

/**
 * Class that handles the business logic of `Exchange` objects with the given list of currencies.
 */
export class ExchangeService {
  /**
   * Gets the exchange rate of the passed exchange. Checks first if the exchange
   * exists in the local storage, if it doesn't, fetch it from the API then save
   * it in local storage before returning it.
   * @param exchange {Exchange} The exchange whose rate is being obtained.
   * @returns {Promise<ExchangeRateRequest>} Returns an ExchangeRate object.
   */
  async getExchangeRate(exchange: Exchange): Promise<Exchange> {
    const key = this.getExchangeKey(exchange);
    const savedExchange = localStorage.getItem(key);
    let exchangeRequest: ExchangeRateRequest;

    if (savedExchange === null) {
      exchangeRequest = await this.fetchExchange(exchange);
      this.cacheExchange(exchangeRequest);
    } else {
      exchangeRequest = ExchangeRateRequest.fromJson(savedExchange);
      if (exchangeRequest.isExpired) {
        exchangeRequest = await this.fetchExchange(exchange);
        this.cacheExchange(exchangeRequest);
      }
    }

    return exchangeRequest;
  }

  /**
   * Fetches an exchange rate from the [Alphavantage](https://alphavantage.co) API.
   * @param exchange {Exchange} The exchange whose rate is being fetched.
   * @returns {ExchangeRateRequest} Returns a new ExchangeRateRequest.
   */
  protected async fetchExchange(
    exchange: Exchange
  ): Promise<ExchangeRateRequest> {
    const raw = await fetch(
      this.getFetchExchangeURL(
        exchange.baseCurrency.value,
        exchange.targetCurrency.value
      )
    );
    const data = await raw.json();
    return new ExchangeRateRequest({
      ...exchange,
      rate: data['Realtime Currency Exchange Rate']['5. Exchange Rate'],
      requestTime: new Date(),
    });
  }

  /**
   * Saves a ExchangeRateRequest in local storage.
   * @param exchange {ExchangeRateRequest} The ExchangeRateRequest object to save.
   */
  private cacheExchange(exchange: ExchangeRateRequest): void {
    const key = this.getExchangeKey(exchange);
    localStorage.setItem(key, exchange.toJson());
  }

  /**
   * Gets the local storage key of the passed exchange.
   * @param e {Exchange} The exchange whose key is being obtained.
   * @returns {string} Returns the key where the passed exchange is saved in local storage.
   */
  private getExchangeKey(e: Exchange): string {
    return `exchange--${e.baseCurrency.value}-${e.targetCurrency.value}`;
  }

  /**
   * Helper method that creates a URL to fetch an exchange rate.
   * @param base {string} The base currency's value.
   * @param target {string} The target currency's value.
   * @returns  {string} Returns a URL.
   */
  private getFetchExchangeURL(base: string, target: string): string {
    return `${BASE_URL}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${base}&to_currency=${target}&apikey=${API_KEY}`;
  }
}
