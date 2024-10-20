import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import Image from "next/image";
import { IoChevronDown } from "react-icons/io5";

export default function ViewInventory() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const date = new Date().toLocaleDateString();
  const [activeTab, setActiveTab] = useState(false);
  const [warehouseArr, setWarehouseArr] = useState([]);
  const [combinedArr, setCombinedArr] = useState([]);
  const [reports, setReports] = useState([]);
  const fetchData = async (warehouseList) => {
    setLoading(true);
    const allShowroomData = [];
    for (const showroom of warehouseList) {
      const querySnapshot = await getDocs(
        collection(db, `erpag/inventory`, showroom?.name)
      );
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      allShowroomData.push({
        warehouseName: showroom?.name,
        data: requests,
      });
    }
    console.log(allShowroomData);
    setCombinedArr(allShowroomData);
    setLoading(false);
  };

  const fetchWarehouse = async () => {
    try {
      const warehouses = await getDoc(doc(db, `erpag`, "AllWarehouses"));
      if (warehouses.data()?.data) {
        setWarehouseArr(warehouses.data()?.data);
        const resArr = warehouses
          .data()
          ?.data?.sort((a, b) =>
            a?.name?.toLowerCase() > b?.name?.toLowerCase() ? 1 : -1
          );
        console.log(resArr);
        fetchData(resArr);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);

  // function handleExportToExcel(Invoice) {
  //   // filtering objects with desired Invoice No.
  //   const objectsWithDesiredInvoiceNo = reports.filter(
  //     (obj) => obj[0].InvoiceNo === Invoice
  //   );
  //   // converting array of objects to array of arrays to use aoa method of xlsx
  //   const arrayOfArrays = Object.values(objectsWithDesiredInvoiceNo).map(
  //     (obj) => Object.values(obj)
  //   );
  //   // adding excel headers
  //   const headers = [
  //     "Sl. No",
  //     "Inv. No.",
  //     "Rec. Dt.",
  //     "OrderNo",
  //     "OrderDetail",
  //     "SiteName",
  //     "Delv. Dt.",
  //     "Sc",
  //     "Qty",
  //     "Unit",
  //     "Remarks",
  //     "Exp. DOC",
  //   ];
  //   const FinalArray = arrayOfArrays[0].map((report, index) => [
  //     index + 1,
  //     report.InvoiceNo,
  //     report.ReceivedDate,
  //     report.OrderNo,
  //     report.OrderDetail,
  //     report.SiteName,
  //     report.DeliveryDate,
  //     report.Sc,
  //     report.Qty,
  //     report.Unit,
  //     report.Remarks,
  //     report.ExpectedDOC,
  //   ]);
  //   FinalArray.unshift(headers);
  //   console.log(FinalArray);
  //   const workSheet = XLSX.utils.aoa_to_sheet(FinalArray);
  //   const workBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
  //   XLSX.writeFile(workBook, `Workshop-Report-${Invoice}.xlsx`);
  // }

  return (
    <div div className=" w-full overflow-x-auto">
      {loading ? (
        <div className=" w-full flex items-center justify-center">
          <Image width={50} height={50} src="/loading.svg" alt="Loading ..." />
        </div>
      ) : (
        <div>
          <div className="w-full pl-6 flex items-center justify-between overflow-x-auto">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
          <div className="w-full pl-6 flex items-center justify-center mb-4 overflow-x-auto">
            <div className=" flex items-center gap-2">
              <input
                name="search"
                id="search"
                value={search}
                autoComplete="off"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search Products by name/ SKU "
                className=" md:w-[300px] py-2 px-3 border-black border rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl mb-2">Inventory</p>
          </div>
          {combinedArr?.map((item, index) => {
            return (
              <div key={index}>
                <h4
                  onClick={() => {
                    if (activeTab === item?.warehouseName?.toLowerCase()) {
                      setActiveTab(false);
                    } else {
                      setActiveTab(item?.warehouseName?.toLowerCase());
                    }
                  }}
                  className="w-full cursor-pointer text-center mt-3 mb-1 font-semibold bg-gray-300 py-2 flex items-center gap-1 justify-center"
                >
                  {item?.warehouseName} (
                  {
                    item?.data?.filter((i) => {
                      if (search === "") {
                        return i;
                      } else {
                        return (
                          i?.name
                            ?.toLowerCase()
                            .includes(search?.toLowerCase()) ||
                          i?.sku?.toLowerCase().includes(search?.toLowerCase())
                        );
                      }
                    }).length
                  }
                  )
                  <IoChevronDown
                    className={`${
                      activeTab === item?.warehouseName?.toLowerCase()
                        ? " rotate-180"
                        : ""
                    }`}
                  />
                </h4>
                {activeTab === item?.warehouseName?.toLowerCase() && (
                  <>
                    {item?.data?.filter((i) => {
                      if (search === "") {
                        return i;
                      } else {
                        return (
                          i?.name
                            ?.toLowerCase()
                            .includes(search?.toLowerCase()) ||
                          i?.sku?.toLowerCase().includes(search?.toLowerCase())
                        );
                      }
                    }).length > 0 ? (
                      <table className="table-auto w-full overflow-x-auto">
                        <thead className="bg-blue-500 text-white">
                          <tr>
                            <th className="px-2 border-gray-400 border">Sl.</th>
                            <th className="px-2 border-gray-400 border">
                              Name
                            </th>
                            <th className="px-2 border-gray-400 border">SKU</th>
                            <th className="px-2 border-gray-400 border">
                              Quantity
                            </th>
                            <th className="px-2 border-gray-400 border">UOM</th>
                            <th className="px-2 border-gray-400 border">
                              Stock Price
                            </th>
                            <th className="px-2 border-gray-400 border">
                              Additional Info
                            </th>
                          </tr>
                        </thead>
                        <tbody className="">
                          {item?.data
                            ?.filter((i) => {
                              if (search === "") {
                                return i;
                              } else {
                                return (
                                  i?.name
                                    ?.toLowerCase()
                                    .includes(search?.toLowerCase()) ||
                                  i?.sku
                                    ?.toLowerCase()
                                    .includes(search?.toLowerCase())
                                );
                              }
                            })
                            .map((item, index) => (
                              <tr key={index}>
                                <td className="bg-white border border-gray-400 text-center p-1">
                                  {index + 1}
                                </td>
                                <td className="bg-white border border-gray-400">
                                  <input
                                    type="text"
                                    value={item.name}
                                    className="w-full px-2 border-none outline-none"
                                  />
                                </td>
                                <td className="bg-white border border-gray-400">
                                  <input
                                    type="text"
                                    value={item.sku}
                                    className="w-full px-2 border-none outline-none"
                                  />
                                </td>
                                <td className="bg-white border border-gray-400">
                                  <input
                                    type="text"
                                    value={item.quantity}
                                    className="w-full px-2 border-none outline-none"
                                  />
                                </td>
                                <td className="bg-white border border-gray-400">
                                  <input
                                    type="text"
                                    value={item.UOM}
                                    className="w-full px-2 border-none outline-none"
                                  />
                                </td>
                                <td className="bg-white border border-gray-400">
                                  <input
                                    type="number"
                                    value={item.stockPrice}
                                    className="w-full px-2 border-none outline-none"
                                  />
                                </td>
                                <td className="bg-white border border-gray-400">
                                  <input
                                    type="text"
                                    value={item.addInfo}
                                    className="w-full px-2 border-none outline-none"
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className=" w-full text-center text-gray-400 ">
                        No Items Available
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
