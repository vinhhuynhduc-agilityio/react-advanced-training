import { UserData } from "@/types";
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
        <div className="text-base font-medium text-[#313131]">{fullName}</div>
        <div className="text-base font-normal text-[#475466]">{earnings}</div>
      </div>
    </div>
  );
};
