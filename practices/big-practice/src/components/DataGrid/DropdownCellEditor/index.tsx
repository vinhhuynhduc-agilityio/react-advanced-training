import {
  useEffect,
  useRef,
  useState
} from 'react'
import clsx from 'clsx';

// ag-grid
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ICellEditorParams } from 'ag-grid-community';

interface CustomCellEditorParams<T, D> extends ICellEditorParams {
  onSelectOption: (value: T, data: D) => void;
  options: T[];
  displayKey: keyof T;
};

export const DropdownCellEditor = <T, D>(props: CustomCellEditorParams<T, D>) => {
  const {
    options,
    node,
    column,
    displayKey,
    eGridCell,
    stopEditing,
    onSelectOption,
  } = props;

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleSelect = (value: T) => {
    onSelectOption(value, node.data);
    stopEditing();
  };

  useEffect(() => {

    // Use eGridCell from props to get the position of the cell being edited
    const cellElement = eGridCell as HTMLElement;
    const cellRect = cellElement.getBoundingClientRect();
    const dropdownHeight = dropdownRef.current?.offsetHeight || 0;

    if (cellRect) {

      // Check the space below the cell
      const spaceBelow = window.innerHeight - cellRect.bottom;

      // If there is enough space below, display the dropdown below, otherwise display it above.
      const topPosition = spaceBelow > dropdownHeight
        ? cellRect.bottom
        : cellRect.top - dropdownHeight;

      setDropdownPosition({
        top: topPosition,
        left: cellRect.left,
      });
    }
  }, [eGridCell]);

  useEffect(() => {
    const handleAnyClickOrScrollOrResize = (event: Event) => {

      if (event.type === 'resize') {
        stopEditing();
        return;
      }

      // If click or scroll inside dropdown then do not stopEditing
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node)
      ) {
        return;
      }

      stopEditing();
    };

    // Add event listeners for click, scroll, and resize
    document.addEventListener('click', handleAnyClickOrScrollOrResize);
    document.addEventListener('scroll', handleAnyClickOrScrollOrResize, true);
    window.addEventListener('resize', handleAnyClickOrScrollOrResize);

    // Cleanup event listeners when component unmounts
    return () => {
      document.removeEventListener('click', handleAnyClickOrScrollOrResize);
      document.removeEventListener('scroll', handleAnyClickOrScrollOrResize, true);
      window.removeEventListener('resize', handleAnyClickOrScrollOrResize);
    };
  }, [stopEditing]);

  const currentValue = node.data[props.column.getColId()] as string;

  return (
    <div
      ref={dropdownRef}
      className="bg-white border border-gray-300 shadow-lg rounded z-1000 overflow-y-auto max-h-[300px]"
      style={{
        position: "fixed",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: column.getActualWidth(),
      }}
    >
      {options.map((option, index) => {
        const optionValue = String(option[displayKey]);

        return (
          <div
            key={index}
            className={clsx(
              "p-1.5 cursor-pointer border-b border-gray-300 hover:bg-gray-200",
              {
                "bg-blue-100": optionValue === currentValue,
              }
            )}
            onClick={() => handleSelect(option)}
          >
            {optionValue}
          </div>
        );
      })}
    </div>
  );
};