import { FormattedMonthData } from "@/types/chartTypes";
import { TaskData } from "@/types/table";

/**
 * @returns {FormattedMonthData[]} Array containing task completion data by month,
 * each object contains: `month` (month name), `2023` and `2024` (number of completed tasks)
 */
const formatDataForChartTotalTasks = (tasks: TaskData[]): FormattedMonthData[] => {
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

export {
  formatDataForChartTotalTasks
};
