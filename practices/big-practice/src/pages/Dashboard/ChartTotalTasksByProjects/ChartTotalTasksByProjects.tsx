import {
  useState,
  useEffect,
  useMemo
} from "react";
import { AgCharts } from "ag-charts-react";
import {
  AgBarSeriesTooltipRendererParams,
  AgChartOptions,
  AgTooltipRendererResult
} from "ag-charts-community";

// types
import { ProjectsData, TaskData } from "@/types/table";

// helpers
import {
  formatDataForChartTotalTasksByProjects
} from "../helpers/ChartTasks";

interface ChartTotalTasksByProjectsProps {
  tasks: TaskData[];
  projects: ProjectsData[];
};

const ChartTotalTasksByProjects: React.FC<ChartTotalTasksByProjectsProps> = ({
  tasks,
  projects
}) => {
  const formattedData = useMemo(
    () => formatDataForChartTotalTasksByProjects(tasks, projects),
    [tasks, projects]
  );

  const renderTooltipChart = (params: AgBarSeriesTooltipRendererParams): AgTooltipRendererResult => {
    const tasksCompleted = params.datum[params.yKey];

    return {
      title: tasksCompleted,
      content: '',
      backgroundColor: '#181d1f',
    };
  };

  // Configure chart with bar series
  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: "Total tasks by projects",
    },
    data: formattedData,
    series: [
      {
        type: "bar",
        xKey: "projectName",
        yKey: "2023",
        yName: "2023",
        direction: "horizontal",
        tooltip: {
          renderer: renderTooltipChart
        },
      },
      {
        type: "bar",
        xKey: "projectName",
        yKey: "2024",
        yName: "2024",
        direction: "horizontal",
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

  // Update chart data when formattedData changes
  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      data: formattedData,
    }));
  }, [formattedData]);

  return (
    <div className="flex-1 bg-white border border-customBorder">
      <AgCharts options={options} />
    </div>
  );
};

export default ChartTotalTasksByProjects;
