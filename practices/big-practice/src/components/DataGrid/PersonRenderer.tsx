import { ICellRendererParams } from "ag-grid-community";
import { RowData } from "../../types/users";

export const PersonRenderer = (params: ICellRendererParams<RowData>) => {
  if (!params.data) {
    return null;
  }

  const { avatar_url, full_name, earnings } = params.data;
  return (
    <div className="flex items-center py-2">
      <img
        src={avatar_url}
        alt="avatar"
        className="w-14 h-14 rounded-full mr-4"
      />
      <div className="flex flex-col">
        <div className="text-base font-medium">{full_name}</div>
        <div className="text-base font-normal">{earnings}</div>
      </div>
    </div>
  );
};
