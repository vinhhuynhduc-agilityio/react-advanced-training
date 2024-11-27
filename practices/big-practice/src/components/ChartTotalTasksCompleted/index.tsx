import {
  useState,
  useEffect,
  useMemo,
  memo
} from 'react';
import { AgCharts } from 'ag-charts-react';
import {
  AgChartOptions,
} from 'ag-charts-community';

// helpers
import { formatDataForChartTotalTasks, renderTooltipChart } from '@/helpers';

// component
import { Spinner } from '@/components/common';

// hooks
import { useDashboardContext } from '@/hooks';

interface ChartTotalTasksCompletedProps {
  isLoading: boolean;
  isSavingTask: boolean;
};

export const ChartTotalTasksCompleted: React.FC<ChartTotalTasksCompletedProps> = memo(
  ({
    isSavingTask,
    isLoading
  }) => {
    const { tasks } = useDashboardContext();

    const formattedData = useMemo(
      () => formatDataForChartTotalTasks(tasks),
      [tasks]
    );

    const [options, setOptions] = useState<AgChartOptions>({
      title: {
        text: 'Total tasks completed',
      },
      data: formattedData,
      series: [
        {
          type: 'line',
          xKey: 'month',
          yKey: '2023',
          yName: '2023',
          tooltip: {
            renderer: renderTooltipChart
          },
        },
        {
          type: 'line',
          xKey: 'month',
          yKey: '2024',
          yName: '2024',
          tooltip: {
            renderer: renderTooltipChart
          },
        },
      ],
      legend: {
        enabled: true,
        position: 'bottom',
        item: {
          marker: {
            size: 10,
          },
          label: {
            fontWeight: 'bold',
          },
        },
      },
    });

    useEffect(() => {
      setOptions((prevOptions) => ({
        ...prevOptions,
        data: formattedData,
      }));
    }, [formattedData]);

    if (isLoading || isSavingTask) {
      return (
        <div className="flex-1 bg-white border border-customBorder h-[302px]">
          <Spinner />
        </div>
      );
    }

    return (
      <div className="flex-1 bg-white border border-customBorder h-[302px]">
        <AgCharts options={options} />
      </div>
    )
  }
);
