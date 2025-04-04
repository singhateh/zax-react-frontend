import React, { useEffect, useState } from "react";
import noDataImage from "../../../assets/nodata.png";
import { CheckboxInput } from "../../../Global/components/Inputs";

const DataTable = ({
  filteredData,
  loadingFilteredData,
  searchPerformed,
  onActionClick,
  columns,
}) => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const select = (id) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };
  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  return (
    <div className="mt-2 mr-8">
      {searchPerformed ? (
        filteredData.length > 0 ? (
          loadingFilteredData ? (
            <div className="flex justify-center items-center h-15">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700 border-collapse border border-gray-200 rounded-lg">
                <thead className="bg-[#d8ab05] text-white text-xs md:text-sm uppercase">
                  <tr>
                    {columns.map((col, index) => (
                      <th
                        key={index}
                        className="px-2 py-1 md:px-4 md:py-3 border"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    // console.log(item),
                    <tr
                      key={item.id}
                      className="bg-white hover:bg-gray-100 transition-all"
                    >
                      {columns.map(
                        (col, index) => (
                          console.log(item.zaxId),
                          (
                            <td key={index} className="px-4 py-2 border">
                              {col.key === "sn" ? (
                                <CheckboxInput
                                  onChange={() => select(item.zaxId)}
                                  checked={selectedItems.has(item.zaxId)}
                                />
                              ) : (
                                item[col.key]
                              )}
                            </td>
                          )
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center grid justify-center items-center">
            <img
              width="100px"
              height="100px"
              src={noDataImage}
              alt="No Data Available"
            />
            No data available.
          </div>
        )
      ) : null}
    </div>
  );
};

export default DataTable;
