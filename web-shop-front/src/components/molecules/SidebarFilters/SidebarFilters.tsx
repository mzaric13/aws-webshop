import { Disclosure } from "@headlessui/react";
import React from "react";
import CategoryValues from "../../../models/CategoryValues";
import SidebarFilterInput from "../../atoms/SidebarFilterInput/SidebarFilterInput";
import SidebarFilterSectionInfo from "../../atoms/SidebarFilterSectionInfo/SidebarFilterSectionInfo";

interface SidebarFiltersProps {
  filters: CategoryValues[];
  handlers: ((event: React.MouseEvent<HTMLElement>) => void)[];
}

const SidebarFilters = ({ filters, handlers }: SidebarFiltersProps) => {
  return (
    <React.Fragment>
      {filters.map((section) => (
        <Disclosure
          as="div"
          key={section.category}
          className="border-b border-gray-200 py-6"
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <SidebarFilterSectionInfo open={open} section={section} />
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-4">
                  {section.values.map((option, optionIdx) => (
                    <div key={option.name} className="flex items-center">
                      <SidebarFilterInput
                        section={section}
                        option={option}
                        optionIdx={optionIdx}
                        mobile={false}
                        handler={handlers[section.handlerIndex]}
                      />
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </React.Fragment>
  );
};

export default SidebarFilters;
