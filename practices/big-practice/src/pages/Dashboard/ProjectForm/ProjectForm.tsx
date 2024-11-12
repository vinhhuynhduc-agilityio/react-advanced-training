import React from "react";
import { useForm } from "react-hook-form";

// types
import { ProjectsData } from "@/types/table";

interface ProjectFormProps {
  projects: ProjectsData[];
  onClose: () => void;
  onSubmit: (newProjectName: string) => void;
};

interface ProjectFormData {
  projectName: string;
};

const ProjectForm: React.FC<ProjectFormProps> = ({
  projects,
  onClose,
  onSubmit
}) => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProjectFormData>();

  const isProjectDuplicate = (name: string) => {
    return projects.some(project => project.projectName === name);
  };

  const onSubmitForm = (data: ProjectFormData) => {
    onSubmit(data.projectName);
  };

  const renderError = (content: string | undefined) => (
    <p className="text-red-500 text-sm mt-1 ml-32">
      {content}
    </p>
  );

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">

      {/* Body */}
      <div>
        <div className="flex items-center">
          <label className="w-32 text-gray-700 font-semibold">
            Project Name
          </label>
          <input
            className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-black"
            type="text"
            {...register("projectName", {
              required: "Project name is required",
              validate: {
                duplicate: (value) => !isProjectDuplicate(value) || "Project name already exists",
              },
            })}
            placeholder="Enter project name"
          />
        </div>
        {errors.projectName && renderError(errors.projectName.message)}
      </div>

      {/* Footer */}
      <div className="flex justify-between border-t pt-3">
        <button
          type="button"
          onClick={onClose}
          className="bg-slate-200 text-pink-600 font-bold">
          Cancel
        </button>
        <button
          type="submit"
          className="bg-slate-200 text-blue-600 font-bold">
          Save
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
