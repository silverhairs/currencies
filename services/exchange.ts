import { Currency, Exchange } from '@components/ExchangeForm';
import { debounce } from 'lodash';
/**
 * API key from env variable.
 */
const API_KEY = process.env.API_KEY;
/**
 * URI Authority of the [Alphavantage](https://alphavantage.co) API.
 */
const BASE_URL = 'https://www.alphavantage.co';

/**
 * Class that handles the business logic of `Exchange` objects with the given list of currencies.
 */
class ExchangeService {
  constructor(private currencies: Currency[]) {}
  /**
   * A list of all the Exchange objects that can possibly exist with the given list of currencies.
   */
  public get exchangeCombinations(): Exchange[] {
    return this._generatePossibleExchanges();
  }

  /**
   * Generates an {Array<Exchange>} with all the possible echange objects from the given list of currencies.
   * @returns {Array<Exchange>} Returns the generated array.
   */
  private _generatePossibleExchanges(): Exchange[] {
    const results: Exchange[] = [];
    for (let i = 0; i < this.currencies.length - 1; i++) {
      for (let j = i + 1; j < this.currencies.length; j++) {
        results.push({
          baseCurrency: this.currencies[i],
          targetCurrency: this.currencies[j],
          rate: 1,
        });
      }
    }
    return results;
  }

  /**
   * Fetches the rates of all the exchanges possible in the given list of currencies.
   * @returns {Promise<Exchange[]>} Returns all the exchange rates.
   */
  async fetchAllExchanges(): Promise<Exchange[]> {
    return await new Promise((resolve) => {
      debounce(() => resolve(this._fetchAllExchanges()), 120_000);
    });
  }

  private async _fetchAllExchanges(): Promise<Exchange[]> {
    const exchanges = this._generatePossibleExchanges();
    return await Promise.all(exchanges.map(this.fetchExchangeRate));
  }
  /**
   * Fetches the rate of a given exchange from the API.
   * @param exchange {Exchange} the exchange whose rate is being fetched.
   * @returns {Promise<Exchange>} Returns the passed exchange with un updated rate.
   */
  async fetchExchangeRate(exchange: Exchange): Promise<Exchange> {
    const response = await fetch(
      `${BASE_URL}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${exchange.baseCurrency.value}&to_currency=${exchange.targetCurrency.value}&apikey=${API_KEY}`
    );
    const data = await response.json();
    return {
      ...exchange,
      rate: data['Realtime Currency Exchange Rate']['5. Exchange Rate'],
    };
  }
}

export { ExchangeService };
