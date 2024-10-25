import { UserData } from "@/types/table";
import { ICellRendererParams } from "ag-grid-community";

export const PersonRenderer = (params: ICellRendererParams<UserData>) => {
  if (!params.data) {
    return null;
  }

  const { avatarUrl, fullName, earnings } = params.data;
  return (
    <div className="flex items-center py-2">
      <img
        src={avatarUrl}
        alt="avatar"
        className="w-14 h-14 rounded-full mr-4"
      />
      <div className="flex flex-col">
        <div className="text-base font-medium">{fullName}</div>
        <div className="text-base font-normal">{earnings}</div>
      </div>
    </div>
  );
};
