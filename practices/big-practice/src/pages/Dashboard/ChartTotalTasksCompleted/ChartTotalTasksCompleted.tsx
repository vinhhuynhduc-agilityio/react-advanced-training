import {
  useState,
  useEffect,
  useMemo,
  memo
} from "react";
import { AgCharts } from "ag-charts-react";
import {
  AgBarSeriesTooltipRendererParams,
  AgChartOptions,
  AgTooltipRendererResult
} from "ag-charts-community";

// types
import { TaskData } from "@/types/table";

// helpers
import { formatDataForChartTotalTasks } from "../helpers/ChartTasks";

// component
import Spinner from "@/components/Spinner/Spinner";

interface ChartTotalTasksCompletedProps {
  tasks: TaskData[];
  isLoading: boolean;
};

const ChartTotalTasksCompleted: React.FC<ChartTotalTasksCompletedProps> = ({
  tasks,
  isLoading
}) => {
  const formattedData = useMemo(
    () => formatDataForChartTotalTasks(tasks),
    [tasks]
  );

  const renderTooltipChart = (params: AgBarSeriesTooltipRendererParams): AgTooltipRendererResult => {
    const month = params.datum[params.xKey];
    const tasksCompleted = params.datum[params.yKey];

    return {
      title: `<div style="text-align: center; line-height: 1.5">
                <div>${month}</div>
                <div>${tasksCompleted} tasks completed</div>
              </div>`,
      content: '',
      backgroundColor: '#181d1f'
    };
  };

  const [options, setOptions] = useState<AgChartOptions>({
    title: {
      text: "Total tasks completed",
    },
    data: formattedData,
    series: [
      {
        type: "line",
        xKey: "month",
        yKey: "2023",
        yName: "2023",
        tooltip: {
          renderer: renderTooltipChart
        },
      },
      {
        type: "line",
        xKey: "month",
        yKey: "2024",
        yName: "2024",
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
};

export default memo(ChartTotalTasksCompleted);
