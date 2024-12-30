import {
  useMemo,
  memo
} from 'react';
import { AgCharts } from 'ag-charts-react';

// component
import { Spinner } from '@/components/common';

// helpers
import { formatDataForChartTotalTasks, totalTasksCompletedOptions } from '@/components/Chart/helpers';

// types
import { TaskData } from '@/types';

interface ChartTotalTasksCompletedProps {
  isLoading: boolean;
  tasks: TaskData[]
};

export const ChartTotalTasksCompleted: React.FC<ChartTotalTasksCompletedProps> = memo(
  ({ isLoading, tasks }) => {

    const formattedData = useMemo(() => formatDataForChartTotalTasks(tasks), [tasks]);

    const memoizedOptions = useMemo(() => ({
      ...totalTasksCompletedOptions,
      data: formattedData,
    }), [formattedData]);

    if (isLoading) {
      return (
        <div
          className="flex-1 bg-white border border-customBorder h-[302px]"
          role="figure"
          aria-label="Loading chart: Total tasks completed"
        >
          <Spinner />
        </div>
      );
    }

    return (
      <div
        id="chart-total-tasks-completed"
        role="figure"
        aria-label="Chart showing total tasks completed"
        className="flex-1 bg-white border border-customBorder h-[302px]"
      >
        <AgCharts options={memoizedOptions} />
      </div>
    );
  }
);
