import { DailyRate, Exchange, HistoryRequest } from './models';

const BASE_URL = 'https://www.alphavantage.co';
const API_KEY = process.env.API_KEY;

/**
 * Class that handles the business logic of the exchange rate history.
 */
export class HistoryService {
  /**
   * Gets the exchange rate history of the passed exchange. Checks first if the history
   * exists in the local storage, if it doesn't, fetch it from the API then save
   * it in local storage before returning it.
   * @param exchange {Exchange} The exchange whose history is being obtained.
   * @returns {Promise<DailyRate[]>} Returns an array of daily exchange rates.
   */
  async getHistory(exchange: Exchange): Promise<DailyRate[]> {
    const key = this.getKey(exchange);
    const savedHistory = localStorage.getItem(key);
    let request: HistoryRequest;

    if (savedHistory === null) {
      request = await this.fetchHistory(exchange);
      this.cacheHistory(exchange, request);
    } else {
      request = HistoryRequest.fromJson(savedHistory);
      if (request.isExpired) {
        request = await this.fetchHistory(exchange);
        this.cacheHistory(exchange, request);
      }
    }
    return request.history;
  }

  private async fetchHistory(exchange: Exchange): Promise<HistoryRequest> {
    const history: DailyRate[] = [];
    const raw = await fetch(
      this.getHistoryURL(
        exchange.baseCurrency.value,
        exchange.targetCurrency.value
      )
    );
    const data = await raw.json();
    const timeseries = data['Time Series FX (Daily)'];
    Object.keys(timeseries).forEach((day: string) => {
      history.push({
        day: new Date(day),
        closingPrice: timeseries[day]['4. close'] as number,
      });
    });
    return new HistoryRequest(history.slice(0, 30), new Date());
  }

  private cacheHistory(exchange: Exchange, history: HistoryRequest) {
    const key = this.getKey(exchange);
    localStorage.setItem(key, history.toJson());
  }

  private getHistoryURL(base: string, target: string) {
    return `${BASE_URL}/query?function=FX_DAILY&from_symbol=${base}&to_symbol=${target}&apikey=${API_KEY}`;
  }

  private getKey(e: Exchange): string {
    return `history--${e.baseCurrency.value}-${e.targetCurrency.value}`;
  }
}
