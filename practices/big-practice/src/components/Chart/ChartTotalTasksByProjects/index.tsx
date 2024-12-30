import {
  useMemo,
  memo
} from 'react';
import { AgCharts } from 'ag-charts-react';

// helpers
import { formatDataForChartTotalTasksByProjects, totalTasksByProjectsOption } from '@/components/Chart/helpers';

// component
import { Spinner } from '@/components/common';

// types
import { ProjectsData, TaskData } from '@/types';


interface ChartTotalTasksByProjectsProps {
  isLoading: boolean;
  tasks: TaskData[];
  projects: ProjectsData[]
}

export const ChartTotalTasksByProjects: React.FC<ChartTotalTasksByProjectsProps> = memo(
  ({ isLoading, tasks, projects }) => {

    const formattedData = useMemo(
      () => formatDataForChartTotalTasksByProjects(tasks, projects),
      [tasks, projects]
    );

    const memoizedOptions = useMemo(() => ({
      ...totalTasksByProjectsOption,
      data: formattedData,
    }), [formattedData]);

    if (isLoading) {
      return (
        <div
          className="flex-1 bg-white border border-customBorder"
          role="figure"
          aria-label="Loading chart: Total tasks by projects"
        >
          <Spinner />
        </div>
      );
    }

    return (
      <div
        id="chart-tasks-by-projects"
        role="figure"
        aria-label="Chart showing total tasks by projects"
        className="flex-1 bg-white border border-customBorder"
      >
        <AgCharts options={memoizedOptions} />
      </div>
    );
  }
);
