import { DailyRate, Exchange } from './models';

const BASE_URL = 'https://www.alphavantage.co';
const API_KEY = process.env.API_KEY;

/**
 * Class that handles the business logic of the exchange rate history.
 */
export class HistoryService {
  /**
   * Fetches the exchange rate history from the [Alphavantage](https://alphavantage.co) API.
   * @param exchange {Exchange} The exchange whose rate history is being fetched.
   * @returns {Promise<DailyRate[]>} Returns the history organized per day.
   */
  async fetchHistory(exchange: Exchange): Promise<DailyRate[]> {
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
    return history;
  }

  private getHistoryURL(base: string, target: string) {
    return `${BASE_URL}/query?function=FX_DAILY&from_symbol=${base}&to_symbol=${target}&apikey=${API_KEY}`;
  }
}
