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
  const exchangeService = new ExchangeService(currencies);

  const [availableExchanges, setAvalaibleExchanges] = useState<Exchange[]>(
    exchangeService.exchangeCombinations
  );
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
    const newExchange =
      availableExchanges.filter(
        (e) =>
          e.baseCurrency === exchange.baseCurrency &&
          e.targetCurrency === exchange.targetCurrency
      )[0] ?? exchange;

    setExchange({ ...exchange, rate: newExchange.rate });
  };

  useEffect(() => {
    exchangeService
      .fetchAllExchanges()
      .then(setAvalaibleExchanges)
      .then((_) => {
        exchangeRateHandler();
        availableExchanges.forEach(console.log);
      });
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
