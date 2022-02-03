import { Layout } from '@components/Layout';
import { Currency, Exchange, ExchangeForm } from '@components/ExchangeForm';
import { useEffect, useState } from 'react';
import { ExchangeService } from 'services/exchange';

/**
 * All the available currencies.
 */
const currencies: Currency[] = [
  { value: 'USD', label: 'USD', symbol: '$' },
  { value: 'GBP', label: 'GBP', symbol: '£' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
];

/**
 * Home page.
 * @returns {JSX.Element} Returns the home page.
 */
export default function Home(): JSX.Element {
  const service = new ExchangeService();

  const [amount, setAmount] = useState<number>(0);
  const [exchange, setExchange] = useState<Exchange>({
    baseCurrency: currencies[0],
    targetCurrency: currencies[0],
    rate: 1,
  });

  const baseCurrencyHandler = (currency: Currency) => {
    setExchange({ ...exchange, baseCurrency: currency });
  };

  const targetCurrencyHandler = (currency: Currency) => {
    setExchange({ ...exchange, targetCurrency: currency });
  };

  const exchangeRateHandler = async () => {
    const newExchange = await service.getExchangeRate(exchange);
    if (newExchange !== undefined) {
      setExchange({ ...exchange, rate: newExchange.rate });
    }
  };

  useEffect(() => {
    exchangeRateHandler();
  }, [exchange.baseCurrency, exchange.targetCurrency]);

  return (
    <Layout title='Exchange Rates Calculator'>
      <div className='container'>
        <ExchangeForm
          baseCurrencies={currencies}
          targetCurrencies={currencies}
          amount={amount}
          exchange={exchange}
          onChangeBaseCurrency={baseCurrencyHandler}
          onChangeTargetCurrency={targetCurrencyHandler}
          onChangeAmount={setAmount}
        />
      </div>
    </Layout>
  );
}

//TODO:
/**
 * - Add Chart
 * - Fix bug while fetching the exchange rates.
 */

/**
 * API key from env variable.
 */
const API_KEY = process.env.API_KEY;
/**
 * URI Authority of the [Alphavantage](https://alphavantage.co) API.
 */
const BASE_URL = 'https://www.alphavantage.co';

async function fetchExchangeRate(exchange: Exchange): Promise<Exchange> {
  const response = await fetch(
    `${BASE_URL}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${exchange.baseCurrency.value}&to_currency=${exchange.targetCurrency.value}&apikey=${API_KEY}`
  );
  const data = await response.json();
  return {
    ...exchange,
    rate: data['Realtime Currency Exchange Rate']['5. Exchange Rate'],
  };
}
