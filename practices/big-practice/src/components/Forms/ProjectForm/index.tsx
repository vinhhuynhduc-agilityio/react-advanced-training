import { useForm } from 'react-hook-form';
import { useDashboardContext } from '@/hooks';

// components
import { Button } from '@/components/common';
import { TextField } from '@/components';

// helpers
import { isProjectDuplicate } from '@/helpers';

interface ProjectFormProps {
  onClose: () => void;
  onSubmit: (newProjectName: string) => void;
};

interface ProjectFormData {
  projectName: string;
};

const ProjectForm: React.FC<ProjectFormProps> = ({
  onClose,
  onSubmit
}) => {
  const { projects } = useDashboardContext();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProjectFormData>();

  const onSubmitForm = (data: ProjectFormData) => {
    onSubmit(data.projectName);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">

      {/* Body */}
      <TextField
        name='projectName'
        label='Project Name'
        placeholder='Enter project name'
        labelWidth='w-32'
        register={register}
        withErrorMargin='ml-32'
        validation={{
          required: 'Project name is required',
          validate: {
            duplicate: (value) =>
              !isProjectDuplicate(projects, value) || 'Project name already exists',
          },
        }}
        error={errors.projectName?.message}
      />

      {/* Footer */}
      <div className="flex justify-between border-t pt-3">
        <Button
          type='button'
          onClick={onClose}
          label='Cancel'
          variant='secondary'
        />
        <Button
          type='submit'
          label='Save'
          variant='primary'
        />
      </div>
    </form>
  );
};

export default ProjectForm;