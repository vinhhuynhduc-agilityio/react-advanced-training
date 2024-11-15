import { useState, useEffect, useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";

// types
import { TaskData } from "@/types/table";

// helpers
import { formatDataForChartTotalTasks } from "../helpers/ChartTotalTasksCompleted";

interface ChartTotalTasksCompletedProps {
  tasks: TaskData[];
};

const ChartTotalTasksCompleted: React.FC<ChartTotalTasksCompletedProps> = ({ tasks }) => {
  const formattedData = useMemo(
    () => formatDataForChartTotalTasks(tasks),
    [tasks]
  );

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
          renderer: (params) => {
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
          },
        },
      },
      {
        type: "line",
        xKey: "month",
        yKey: "2024",
        yName: "2024",
        tooltip: {
          renderer: (params) => {
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
          },
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

  return <AgCharts options={options} />;
};

export default ChartTotalTasksCompleted;
