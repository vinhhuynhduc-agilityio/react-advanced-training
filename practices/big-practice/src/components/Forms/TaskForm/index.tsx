
import React from 'react';
import {
  useForm,
  Controller
} from 'react-hook-form';

// helpers
import { formatDropdownOptions } from '@/helpers';

// types
import { TaskFormValues } from '@/types';

// component
import { Button, Dropdown } from '@/components/common';

// hooks
import { useDashboardContext } from '@/hooks';

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (data: TaskFormValues) => void;
};

const TaskForm: React.FC<TaskFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const {
    users,
    projects,
    tasks
  } = useDashboardContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<TaskFormValues>();

  const onSubmitForm = (data: TaskFormValues) => {
    onSubmit(data);
  };

  const renderError = (content: string | undefined) => (
    <p className="text-red-500 text-sm mt-1">
      {content}
    </p>
  );

  const isTaskDuplicate = (value: string) => {
    return tasks.some(task =>
      task.taskName.toUpperCase() === value.toUpperCase()
    );
  };

  const projectOptions = formatDropdownOptions(projects, 'projectName');

  const userOptions = formatDropdownOptions(users, 'fullName');

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-4'>

      {/* Task Name */}
      <div>
        <label className="text-gray-700 font-semibold mb-1">
          Task Name
        </label>
        <input
          className="w-full p-2 rounded-md border border-gray-300 bg-white text-black"
          type="text"
          {...register("taskName", {
            required: "Task name is required",
            validate: {
              duplicate: (value) => !isTaskDuplicate(value) || "Task name already exists",
            },
          })}
          placeholder="Enter task name"
        />
        {errors.taskName && renderError(errors.taskName.message)}
      </div>

      {/* Currency */}
      <div>
        <label className="text-gray-700 font-semibold mb-1">
          Currency
        </label>
        <input
          className="w-full p-2 rounded-md border border-gray-300 bg-white text-black"
          type="text"
          inputMode="numeric"
          maxLength={4}
          {...register("currency", {
            required: "Currency is required",
            pattern: {
              value: /^[1-9][0-9]*$/,
              message: "Currency must be a number not starting with 0"
            },
          })}
          placeholder="Enter currency"
        />
        {errors.currency && renderError(errors.currency.message)}
      </div>

      <div className="flex space-x-4">

        {/* Project Dropdown */}
        <div className="flex-1">
          <label className="text-gray-700 font-semibold mb-1">Project</label>
          <Controller
            name="project"
            control={control}
            rules={{
              required: "Project is required",
            }}
            render={({ field }) => (
              <Dropdown
                {...field}  // Pass react-hook-form"s field props to Dropdown
                options={projectOptions}
                placeholder="Select a project"
                onSelect={(selected) => field.onChange(selected)}  // Use `onChange` to update the value
              />
            )}
          />
          {errors.project && renderError(errors.project.message)}
        </div>

        {/* Assignee Dropdown */}
        <div className="flex-1">
          <label className="text-gray-700 font-semibold mb-1">Assignee</label>
          <Controller
            name="user"
            control={control}
            rules={{
              required: "Assignee is required",
            }}
            render={({ field }) => (
              <Dropdown
                {...field}  // Pass react-hook-form"s field props to Dropdown
                options={userOptions}
                placeholder="Select an assignee"
                onSelect={(selected) => field.onChange(selected)}  // Use `onChange` to update the value
              />
            )}
          />
          {errors.user && renderError(errors.user.message)}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between border-t pt-3">
        <Button
          type="button"
          onClick={onClose}
          label="Cancel"
          variant="secondary"
        />
        <Button
          type="submit"
          label="Save"
          variant="primary"
        />
      </div>
    </form>
  );
};

export default TaskForm;