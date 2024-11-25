import {
  FormattedMonthData,
  FormattedProjectData
} from "@/types/chartTypes";
import {
  ProjectsData,
  TaskData
} from "@/types/table";

// ag-grid
import {
  AgAreaSeriesOptions,
  AgBarSeriesTooltipRendererParams,
  AgChartOptions,
  AgTooltipRendererResult,
} from "ag-charts-community";

/**
 * @returns {FormattedMonthData[]} Array containing task completion data by month,
 * each object contains: `month` (month name), `2023` and `2024` (number of completed tasks)
 */
const formatDataForChartTotalTasks = (
  tasks: TaskData[]
): FormattedMonthData[] => {
  const months = {
    Jan: { month: "Jan", 2023: 0, 2024: 0 },
    Feb: { month: "Feb", 2023: 0, 2024: 0 },
    Mar: { month: "Mar", 2023: 0, 2024: 0 },
    Apr: { month: "Apr", 2023: 0, 2024: 0 },
    May: { month: "May", 2023: 0, 2024: 0 },
    Jun: { month: "Jun", 2023: 0, 2024: 0 },
    Jul: { month: "Jul", 2023: 0, 2024: 0 },
    Aug: { month: "Aug", 2023: 0, 2024: 0 },
    Sep: { month: "Sep", 2023: 0, 2024: 0 },
    Oct: { month: "Oct", 2023: 0, 2024: 0 },
    Nov: { month: "Nov", 2023: 0, 2024: 0 },
    Dec: { month: "Dec", 2023: 0, 2024: 0 },
  };

  tasks.forEach((task) => {
    const completedDate = task.completedDate;

    if (completedDate !== "incomplete") {
      const [, monthStr, yearStr] = completedDate.split(" ");
      const year = parseInt("20" + yearStr);

      if (year === 2023 || year === 2024) {
        months[monthStr as keyof typeof months][year]++;
      }
    }
  });

  return Object.values(months);
};

const formatDataForChartTotalTasksByProjects = (
  tasks: TaskData[],
  projects: ProjectsData[]
): FormattedProjectData[] => {
  // Initialize the result with all projects from the `projects` parameter, and set 0 for both 2023 and 2024
  const result = projects.reduce((acc, project) => {
    acc[project.projectName] = {
      projectName: project.projectName,
      2023: 0,
      2024: 0,
    };

    return acc;
  }, {} as { [key: string]: FormattedProjectData });

  // Update the number of tasks per year for projects
  tasks.forEach((task) => {
    const {
      projectName,
      startDate
    } = task;
    const year = parseInt(`20${startDate.split(" ")[2]}`, 10);

    if (
      result[projectName] &&
      (year === 2023 || year === 2024)
    ) {
      result[projectName][year]++;
    }
  });

  return Object.values(result);
};

const formatDataForChartIndividualEmployee = (
  tasks: TaskData[],
  selectedUserId: string
) => {
  const months: Record<string, { month: string; totalTasksCompleted: number }> = {
    Jan: { month: "Jan", totalTasksCompleted: 0 },
    Feb: { month: "Feb", totalTasksCompleted: 0 },
    Mar: { month: "Mar", totalTasksCompleted: 0 },
    Apr: { month: "Apr", totalTasksCompleted: 0 },
    May: { month: "May", totalTasksCompleted: 0 },
    Jun: { month: "Jun", totalTasksCompleted: 0 },
    Jul: { month: "Jul", totalTasksCompleted: 0 },
    Aug: { month: "Aug", totalTasksCompleted: 0 },
    Sep: { month: "Sep", totalTasksCompleted: 0 },
    Oct: { month: "Oct", totalTasksCompleted: 0 },
    Nov: { month: "Nov", totalTasksCompleted: 0 },
    Dec: { month: "Dec", totalTasksCompleted: 0 },
  };

  tasks.forEach((task) => {
    const completedDate = task.completedDate;

    if (task.userId === selectedUserId && completedDate !== "incomplete") {
      const [, monthStr] = completedDate.split(" ");

      months[monthStr as keyof typeof months].totalTasksCompleted++;
    }
  });

  return Object.values(months);
};

const renderTooltipChart = (
  params: AgBarSeriesTooltipRendererParams
): AgTooltipRendererResult => {
  const month = params.datum[params.xKey];
  const tasksCompleted = params.datum[params.yKey];

  return {
    title: `<div style="text-align: center; line-height: 1.5">
              <div>${month}</div>
              <div>${tasksCompleted} tasks completed</div>
            </div>`,
    content: "",
    backgroundColor: "#181d1f",
  };
};

// Default chart configuration
const initOptions: AgChartOptions = {
  title: {
    text: `Individual employee's progress`,
  },
  data: [],
  series: [
    {
      type: "area",
      xKey: "month",
      yKey: "totalTasksCompleted",
      yName: "Loading...",
      interpolation: { type: "smooth" },
      tooltip: {
        renderer: renderTooltipChart,
      },
    } as AgAreaSeriesOptions,
  ],
  legend: {
    enabled: true,
    listeners: {
      legendItemClick: (event) => {
        event.preventDefault();
      },
    },
  },
};

const renderTooltipProjectChart = (
  params: AgBarSeriesTooltipRendererParams
): AgTooltipRendererResult => {
  const tasksCompleted = params.datum[params.yKey];

  return {
    title: tasksCompleted,
    content: "",
    backgroundColor: "#181d1f",
  };
};

export {
  formatDataForChartTotalTasks,
  formatDataForChartTotalTasksByProjects,
  formatDataForChartIndividualEmployee,
  initOptions,
  renderTooltipChart,
  renderTooltipProjectChart,
};
