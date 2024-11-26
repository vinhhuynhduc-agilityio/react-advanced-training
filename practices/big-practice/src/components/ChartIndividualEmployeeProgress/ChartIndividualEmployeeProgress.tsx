import {
  memo,
  useEffect,
  useMemo,
  useState
} from "react";

// ag-grid
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";

// types
import {
  TaskData,
  UserData
} from "@/types/table";

// helpers
import {
  formatDataForChartIndividualEmployee,
  initOptions
} from "@/helpers/chartTasks";

// component
import Spinner from "@/components/common/Spinner/Spinner";

interface ChartIndividualEmployeeProgressProps {
  tasks: TaskData[];
  users: UserData[];
  selectedUserId: string | null;
  isLoading: boolean;
};

const ChartIndividualEmployeeProgress: React.FC<ChartIndividualEmployeeProgressProps> = ({
  tasks,
  users,
  selectedUserId,
  isLoading
}) => {
  const [options, setOptions] = useState<AgChartOptions>(initOptions);

  const selectedUser = useMemo(() => {
    if (users.length === 0) return null;
    if (!selectedUserId) return users[0];
    return users.find((user) => user.id === selectedUserId);
  }, [users, selectedUserId]);

  useEffect(() => {
    const formattedData = selectedUser
      ? formatDataForChartIndividualEmployee(tasks, selectedUser.id)
      : [];

    setOptions((prevOptions) => ({
      ...prevOptions,
      data: formattedData,
      series: [
        {
          ...prevOptions.series?.[0],
          yName: selectedUser?.fullName,
        },
      ],
    }) as AgChartOptions);
  }, [selectedUser, tasks]);

  if (isLoading) {
    return (
      <div className="flex-1 mr-4 bg-white border border-customBorder">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex-1 mr-4 bg-white border border-customBorder">
      <AgCharts options={options} />
    </div>
  );
};

export default memo(ChartIndividualEmployeeProgress);
