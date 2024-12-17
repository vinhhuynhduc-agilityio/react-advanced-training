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

// component
import { Spinner } from '@/components/common';

// hooks
import { useDashboardContext } from '@/hooks';
import { formatDataForChartTotalTasks, totalTasksCompletedOptions } from '@/components/Chart/helpers';

interface ChartTotalTasksCompletedProps {
  isLoading: boolean;
};

export const ChartTotalTasksCompleted: React.FC<ChartTotalTasksCompletedProps> = memo(
  ({
    isLoading
  }) => {
    const { tasks } = useDashboardContext();
    const [options, setOptions] = useState<AgChartOptions>(totalTasksCompletedOptions);

    const formattedData = useMemo(
      () => formatDataForChartTotalTasks(tasks),
      [tasks]
    );

    useEffect(() => {
      setOptions((prevOptions) => ({
        ...prevOptions,
        data: formattedData,
      }));
    }, [formattedData]);

    if (isLoading) {
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
