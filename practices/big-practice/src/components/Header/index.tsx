import React, { memo } from 'react';

// component
import { Button } from '@/components/common';

interface HeaderProps {
  onAddUser: () => void;
  onAddProject: () => void;
  onAddTask: () => void;
};

export const Header: React.FC<HeaderProps> = memo(
  ({
    onAddUser,
    onAddProject,
    onAddTask
  }) => {

    return (
      <header className=" bg-white flex flex-row py-2 px-3 items-center border border-customBorder">
        <div className="flex flex-row items-center w-[16.5rem]">
          <img src="/assets/logo.png" alt="Logo" className="h-12 w-12 mr-2" />
          <h1 className=" text-xl font-medium text-[#475466]">
            Team Progress
          </h1>
        </div>
        <Button label="Add a user" onClick={onAddUser} />
        <Button label="Add a task" onClick={onAddTask} />
        <Button label="Add a project" onClick={onAddProject} />
      </header>
    );
  }
);