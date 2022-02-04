import { Layout } from '@components/Layout';
import { ExchangeForm } from '@components/ExchangeForm';
import { useEffect, useState } from 'react';
import { ExchangeService } from 'services/exchangeService';
import { Currency, DailyRate, Exchange } from 'services/models';
import { RateHistoryChart } from '@components/RateHistoryChart';
import { HistoryService } from 'services/historyService';
import moment from 'moment';

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
  const exchangeService = new ExchangeService();
  const historyService = new HistoryService();
  const [exchangeHistory, setExchangeHistory] = useState<DailyRate[]>([]);
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
    const newExchange = await exchangeService.getExchangeRate(exchange);
    if (newExchange !== undefined) {
      setExchange({ ...exchange, rate: newExchange.rate });
    }
  };

  const historyHandler = async () => {
    const history = await historyService.getHistory(exchange);
    history.forEach(console.log);
    setExchangeHistory(history);
  };

  useEffect(() => {
    exchangeRateHandler();
    historyHandler();
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
        <RateHistoryChart
          exchange={exchange}
          data={exchangeHistory}
          labels={exchangeHistory.map((d) => moment(d.day).format('MMM Do YY'))}
        />
      </div>
    </Layout>
  );
}
