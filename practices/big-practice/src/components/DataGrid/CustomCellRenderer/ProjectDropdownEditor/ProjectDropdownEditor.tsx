import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ICellEditorParams } from "ag-grid-community";
import {
  ProjectsData,
  TaskData
} from "@/types/table";
import { useEffect } from "react";

interface CustomCellEditorParams extends ICellEditorParams {
  onSelectProject: (value: ProjectsData, data: TaskData) => void;
  projects: ProjectsData[];
}

export const ProjectDropdownEditor: React.FC<CustomCellEditorParams> = props => {
  const {
    stopEditing,
    projects,
    node,
    onSelectProject,
    column
  } = props;

  // Set the width of the dropdown editor to match the column width
  const dropdownWidth = column.getActualWidth();

  const handleSelect = (value: ProjectsData) => {
    onSelectProject(value, node.data);

    // Stop editing after selection
    stopEditing();
  };

  useEffect(() => {
    const handleAnyClickOrScrollOrResize = () => {
      stopEditing();
    };

    // Add event listeners for click, scroll, and resize
    document.addEventListener("click", handleAnyClickOrScrollOrResize);
    document.addEventListener("scroll", handleAnyClickOrScrollOrResize, true);
    window.addEventListener("resize", handleAnyClickOrScrollOrResize);

    // Cleanup event listeners when component unmounts
    return () => {
      document.removeEventListener("click", handleAnyClickOrScrollOrResize);
      document.removeEventListener("scroll", handleAnyClickOrScrollOrResize, true);
      window.removeEventListener("resize", handleAnyClickOrScrollOrResize);
    };
  }, [stopEditing]);

  return (
    <div
      className="bg-white border border-gray-300 w-36"
      style={{ width: dropdownWidth }}
    >
      {
        projects.map((option) => (
          <div
            className="p-1.5 cursor-pointer border-b border-gray-300 hover:bg-gray-200"
            key={option.id}
            onClick={() => handleSelect(option)}
          >
            {option.projectName}
          </div>
        ))
      }
    </div>
  );
};
