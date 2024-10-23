import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ICellEditorParams } from "ag-grid-community";

export const ProjectDropdownEditor: React.FC<ICellEditorParams> = props => {
  const options = [
    "Support",
    "Failure Testing",
    "Quality Management",
    "Data Quality",
  ];

  const handleSelect = (value: string) => {
    props.stopEditing(); // Stop editing after selection
    props.node.setDataValue(props.column.getColId(), value); // Update the value in the grid
  };

  return (
    <div className="p-2 bg-white border border-gray-300 w-36" >
      {options.map((option) => (
        <div
          className="p-1.5 cursor-pointer bg-gray-100 border-b border-gray-300"
          key={option}
          onClick={() => handleSelect(option)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#ececec")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#f9f9f9")
          }
        >
          {option}
        </div>
      ))}
    </div>
  );
};
