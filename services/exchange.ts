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
export class ExchangeService {
  /**
   * Get the exchange rate of the passed exchange
   * @param exchange {Exchange} The exchange whose rate is being obtained.
   * @returns {Promise<ExchangeRateRequest>} Returns a
   */
  async getExchangeRate(exchange: Exchange): Promise<Exchange> {
    const savedExchange = localStorage.getItem('exchange');
    let exchangeRequest: ExchangeRateRequest | undefined;

    console.log(`From storage: ${savedExchange}`);
    if (savedExchange !== null) {
      exchangeRequest = getExchangeRequestFromJSON(savedExchange);
      const isExpired =
        new Date().getHours() -
          Date.parse(exchangeRequest.requestTime.toDateString()) >
        0;

      if (isExpired) {
        console.log('expired');

        exchangeRequest = await this.fetchExchangeRate(exchange);
        this.cacheExchange(exchangeRequest);
      }
    } else {
      console.log('making request');

      exchangeRequest = await this.fetchExchangeRate(exchange);
      this.cacheExchange(exchangeRequest);
    }

    return exchangeRequest;
  }

  private async fetchExchangeRate(
    exchange: Exchange
  ): Promise<ExchangeRateRequest> {
    const raw = await fetch(
      `${BASE_URL}//query?function=CURRENCY_EXCHANGE_RATE&from_currency=${exchange.baseCurrency.value}&to_currency=${exchange.targetCurrency.value}&apikey=${API_KEY}`
    );
    const data = await raw.json();
    return {
      baseCurrency: exchange.baseCurrency,
      targetCurrency: exchange.targetCurrency,
      rate: data['Realtime Currency Exchange Rate']['5. Exchange Rate'],
      requestTime: new Date(),
    };
  }

  private cacheExchange(exchangeRequest: ExchangeRateRequest): void {
    localStorage.setItem('exchange', JSON.stringify(exchangeRequest));
  }
}

/**
 * A model for the exchange rate.
 */
export interface ExchangeRateRequest extends Exchange {
  requestTime: Date;
}
/**
 * Parses a JSON string into a new ExchangeRateRequest object.
 * @param raw {string} The ExchangeRateRequest in a json string.
 * @returns {ExchangeRateRequest} Returns the deserialized ExchangeRateRequest.
 */
const getExchangeRequestFromJSON = (raw: string): ExchangeRateRequest => {
  const data = JSON.parse(raw);
  return {
    ...data,
    requestTime: new Date(data.requestTime),
  };
};
