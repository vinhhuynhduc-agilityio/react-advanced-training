import { UserData } from "@/types";
import { ICellRendererParams } from "ag-grid-community";

// component
import { Avatar } from "@/components";

export const PersonListItem = (params: ICellRendererParams<UserData>) => {
  if (!params.data) {
    return null;
  }

  const { avatarUrl, fullName, earnings } = params.data;
  return (
    <div
      className="flex items-center py-2"
      role="listitem"
      aria-label={fullName}
    >
      <Avatar
        src={avatarUrl}
        alt="User Avatar"
        size="w-14 h-14"
      />
      <div className="flex flex-col ml-4">
        <div className="text-base font-medium text-[#313131]">{fullName}</div>
        <div className="text-base font-normal text-[#475466]">{earnings}</div>
      </div>
    </div>
  );
};