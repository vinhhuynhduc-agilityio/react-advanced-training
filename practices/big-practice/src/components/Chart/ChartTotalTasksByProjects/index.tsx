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
import {
  formatDataForChartTotalTasksByProjects,
  renderTooltipProjectChart
} from '@/helpers';

// component
import { Spinner } from '@/components/common';

// hooks
import { useDashboardContext } from '@/hooks';

interface ChartTotalTasksByProjectsProps {
  isLoading: boolean;
  isSavingProject: boolean;
  isSavingTask: boolean;
};

export const ChartTotalTasksByProjects: React.FC<ChartTotalTasksByProjectsProps> = memo(
  ({
    isLoading,
    isSavingTask,
    isSavingProject
  }) => {
    const { tasks, projects } = useDashboardContext();
    const formattedData = useMemo(
      () => formatDataForChartTotalTasksByProjects(tasks, projects),
      [tasks, projects]
    );

    // Configure chart with bar series
    const [options, setOptions] = useState<AgChartOptions>({
      title: {
        text: 'Total tasks by projects',
      },
      data: formattedData,
      series: [
        {
          type: 'bar',
          xKey: 'projectName',
          yKey: '2023',
          yName: '2023',
          direction: 'horizontal',
          tooltip: {
            renderer: renderTooltipProjectChart
          },
        },
        {
          type: 'bar',
          xKey: 'projectName',
          yKey: '2024',
          yName: '2024',
          direction: 'horizontal',
          tooltip: {
            renderer: renderTooltipProjectChart
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

    // Update chart data when formattedData changes
    useEffect(() => {
      setOptions((prevOptions) => ({
        ...prevOptions,
        data: formattedData,
      }));
    }, [formattedData]);

    if (isLoading || isSavingTask || isSavingProject) {
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
