import Select from 'react-select';
import { Currency, Exchange } from 'services/models';

/**
 * A callback type for the amount update handler.
 */
type AmountHandler = (amount: number) => void;

/**
 * A callback type for the currency update handler.
 */
type CurrencyHandler = (currency: Currency) => void;
/**
 * A callback to handle the chart
 */
type ChartHandler = (exchange: Exchange) => void;

interface ExchangeFormProps {
  exchange: Exchange;
  baseCurrencies: Currency[];
  targetCurrencies: Currency[];
  amount: number;
  onChangeAmount: AmountHandler;
  onChangeBaseCurrency: CurrencyHandler;
  onChangeTargetCurrency: CurrencyHandler;
  chartHandler?: ChartHandler;
}

/**
 * UI Component of the form where the user can input the data for an exchange operation.
 * @param props {ExchangeFormProps} Required properties for the ExchangeForm component.
 * @returns {JSX.Element} Returns a component.
 */
export function ExchangeForm(props: ExchangeFormProps): JSX.Element {
  const amount = isNaN(props.amount) ? 0 : props.amount;

  /* Converts the amount entered from the base currency to the target currency.*/
  const convert = () => amount * props.exchange.rate;

  return (
    <div className='exchange-form'>
      <div className='amount-field field'>
        <label htmlFor='amount'>Amount</label> <br />
        <input
          type='number'
          name='amount'
          id='amount'
          placeholder='0.00'
          value={props.amount}
          onChange={(e) => props.onChangeAmount(e.target.valueAsNumber ?? 0)}
        />
      </div>
      <div className='base-field field'>
        <label htmlFor='base'>Base Currency</label>
        <Select
          name='base'
          id='base'
          options={props.baseCurrencies}
          onChange={(option) =>
            props.onChangeBaseCurrency({
              value: option!.value,
              symbol: option!.symbol,
              label: option!.label,
            })
          }
          placeholder='Base Currency'
          value={props.exchange.baseCurrency}
        />
      </div>
      <div className='target-field field'>
        <label htmlFor='base'>Target Currency</label>
        <Select
          name='target'
          id='target'
          options={props.targetCurrencies}
          onChange={(option) =>
            props.onChangeTargetCurrency({
              value: option!.value,
              symbol: option!.symbol,
              label: option!.label,
            })
          }
          placeholder='Target Currency'
          value={props.exchange.targetCurrency}
        />
      </div>
      <div className='result-field field'>
        <button onClick={() => props.chartHandler?.(props.exchange)}>
          Show Chart
        </button>
        <div className='result'>
          <h3>{`${amount} ${
            props.exchange.baseCurrency.symbol
          } = ${convert()} ${props.exchange.targetCurrency.symbol}`}</h3>
        </div>
      </div>
    </div>
  );
}
