import { Disclosure } from "@headlessui/react";
import React from "react";
import CategoryValues from "../../../models/CategoryValues";
import SidebarFilterInput from "../../atoms/SidebarFilterInput/SidebarFilterInput";
import SidebarFilterSectionInfo from "../../atoms/SidebarFilterSectionInfo/SidebarFilterSectionInfo";

interface SidebarMobileFiltersProps {
  filters: CategoryValues[];
  handlers: ((event: React.MouseEvent<HTMLElement>) => void)[];
}

const SidebarMobileFilters = ({
  filters,
  handlers,
}: SidebarMobileFiltersProps) => {
  return (
    <React.Fragment>
      {filters.map((section, index) => (
        <Disclosure
          as="div"
          key={index}
          className="border-t border-gray-200 px-4 py-6"
        >
          {({ open }) => (
            <>
              <h3 className="-mx-2 -my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                  <SidebarFilterSectionInfo open={open} section={section} />
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-6">
                  {section.values.map((option, optionIdx) => (
                    <div key={option.name} className="flex items-center">
                      <SidebarFilterInput
                        key={optionIdx}
                        mobile={true}
                        section={section}
                        option={option}
                        optionIdx={optionIdx}
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

export default SidebarMobileFilters;
