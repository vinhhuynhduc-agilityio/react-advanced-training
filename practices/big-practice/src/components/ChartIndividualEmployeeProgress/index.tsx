import {
  memo,
  useEffect,
  useMemo,
  useState
} from 'react';

// ag-grid
import { AgCharts } from 'ag-charts-react';
import { AgChartOptions } from 'ag-charts-community';

// helpers
import {
  formatDataForChartIndividualEmployee,
  initOptions
} from '@/helpers';

// component
import { Spinner } from '@/components/common';

// hooks
import { useDashboardContext } from '@/hooks';

interface ChartIndividualEmployeeProgressProps {
  selectedUserId: string | null;
  isLoading: boolean;
  isSavingUser: boolean;
  isSavingTask: boolean;
};

export const ChartIndividualEmployeeProgress: React.FC<ChartIndividualEmployeeProgressProps> = memo(
  ({
    selectedUserId,
    isLoading,
    isSavingTask,
    isSavingUser
  }) => {
    const { users, tasks } = useDashboardContext();
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

    if (isLoading || isSavingTask || isSavingUser) {
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
  }
);
