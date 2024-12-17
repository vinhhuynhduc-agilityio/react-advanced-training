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
import { formatDataForChartTotalTasksByProjects, totalTasksByProjectsOption } from '@/components/Chart/helpers';

// component
import { Spinner } from '@/components/common';

// hooks
import { useDashboardContext } from '@/hooks';

interface ChartTotalTasksByProjectsProps {
  isLoading: boolean;
};

export const ChartTotalTasksByProjects: React.FC<ChartTotalTasksByProjectsProps> = memo(
  ({
    isLoading,
  }) => {
    const { tasks, projects } = useDashboardContext();
    const [options, setOptions] = useState<AgChartOptions>(totalTasksByProjectsOption);

    const formattedData = useMemo(
      () => formatDataForChartTotalTasksByProjects(tasks, projects),
      [tasks, projects]
    );

    // Update chart data when formattedData changes
    useEffect(() => {
      setOptions((prevOptions) => ({
        ...prevOptions,
        data: formattedData,
      }));
    }, [formattedData]);

    if (isLoading) {
      return (
        <div className="flex-1 bg-white border border-customBorder">
          <Spinner />
        </div>
      );
    }

    return (
      <div className="flex-1 bg-white border border-customBorder">
        <AgCharts options={options} />
      </div>
    );
  }
);
