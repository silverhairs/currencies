import { DailyRate, Exchange } from 'services/models';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  exchange: Exchange;
  data: DailyRate[];
  labels: string[];
}

/**
 * UI component of the exchange history chart.
 * @param props {ChartProps} The chart's properties.
 * @returns {JSX.Element} Returns the chart component.
 */
export function RateHistoryChart(props: ChartProps): JSX.Element {
  return (
    <div className='historical-graph'>
      <Line
        data={{
          labels: props.labels,
          datasets: [
            {
              label: `${props.exchange.baseCurrency.label} / ${props.exchange.targetCurrency.label}`,
              data: props.data.map((day) => day.closingPrice),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: `${props.exchange.baseCurrency.label} / ${props.exchange.targetCurrency.label}`,
            },
          },
        }}
      />
    </div>
  );
}
