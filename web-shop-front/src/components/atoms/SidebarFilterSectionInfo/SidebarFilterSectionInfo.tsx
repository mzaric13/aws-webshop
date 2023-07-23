import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import React from "react";
import CategoryValues from "../../../models/CategoryValues";

interface SidebarFilterSectionInfoProps {
  open: any;
  section: CategoryValues;
}

const SidebarFilterSectionInfo = ({
  open,
  section,
}: SidebarFilterSectionInfoProps) => {
  return (
    <React.Fragment>
      <span className="font-medium text-gray-900">{section.category}</span>
      <span className="ml-6 flex items-center">
        {open ? (
          <MinusIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </span>
    </React.Fragment>
  );
};

export default SidebarFilterSectionInfo;
