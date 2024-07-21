import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { IoChevronDown } from "react-icons/io5";
import Image from "next/image";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function ViewInventory() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [activeWarehouse, setActiveWarehouse] = useState("");
  const [warehouseArr, setWarehouseArr] = useState([]);
  const [warehouseArr2, setWarehouseArr2] = useState([]);
  const [warehouse, setWarehouse] = useState("");
  const [combinedArr, setCombinedArr] = useState([]);

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
        const resArr = warehouses
          .data()
          ?.data?.sort((a, b) =>
            a?.name?.toLowerCase() > b?.name?.toLowerCase() ? 1 : -1
          );
        setWarehouseArr(resArr);
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

  return (
    <div className="w-full overflow-x-auto">
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
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
          <div className="w-full pl-6 flex items-center justify-center mb-4 overflow-x-auto"></div>
          <div className="flex flex-col items-center">
            <p className="text-3xl mb-4">Warehouses</p>
          </div>
          {combinedArr?.map((item, index) => {
            return (
              <div key={index}>
                <h4
                  onClick={() => {
                    setWarehouse("");
                    setActiveWarehouse((prev) =>
                      prev === item?.warehouseName ? "" : item?.warehouseName
                    );
                  }}
                  className="w-full bg-gray-300 py-2 text-center mt-3 mb-1 flex items-baseline gap-2 justify-center font-semibold cursor-pointer "
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
                    className={` ${
                      activeWarehouse === item?.warehouseName ? "rotate-90" : ""
                    }text-sm`}
                  />
                </h4>
                {activeWarehouse === item?.warehouseName && (
                  <>
                    <div className="flex items-end gap-2 mb-1">
                      <div className="flex flex-col">
                        <label className="text-sm font-semibold">
                          Select Warehouse to Transfer
                        </label>
                        <select
                          type="text"
                          placeholder="Warehouse Name"
                          id="warehouse"
                          name="warehouse"
                          value={warehouse}
                          onChange={(e) => {
                            setWarehouse(e.target.value);
                          }}
                          className="py-2 px-3 border border-black rounded-md capitalize"
                        >
                          <option value={"mainwarehouse"} className="">
                            Select Warehouse
                          </option>
                          {warehouseArr?.map((item, index) => {
                            return (
                              <option
                                key={index}
                                value={item?.name}
                                className="capitalize"
                              >
                                {item?.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <button
                        onClick={async () => {
                          if (warehouse !== activeWarehouse) {
                            try {
                              const newArr = combinedArr?.filter((i) => {
                                return i?.warehouseName === activeWarehouse;
                              })[0]?.data;
                              for (const object of newArr) {
                                await setDoc(
                                  doc(
                                    db,
                                    `erpag/inventory/${warehouse}`,
                                    object?.name
                                  ),
                                  object
                                );
                                await deleteDoc(
                                  doc(
                                    db,
                                    `erpag/inventory/${activeWarehouse}`,
                                    object?.name
                                  )
                                );
                              }
                              fetchData(warehouseArr);
                              enqueueSnackbar("Transfered Successfully", {
                                variant: "success",
                              });
                            } catch (error) {
                              enqueueSnackbar("Some error occured", {
                                variant: "error",
                              });
                              console.error(error);
                            }
                          } else {
                            enqueueSnackbar(
                              "Choose Two Different Inventories",
                              {
                                variant: "warning",
                              }
                            );
                          }
                        }}
                        disabled={
                          warehouse === "" ||
                          item?.data?.filter((i) => {
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
                          }).length <= 0
                        }
                        className="bg-green-400 disabled:bg-gray-300 py-2.5 px-4 text-sm rounded-md font-semibold"
                      >
                        Transfer
                      </button>
                    </div>
                    <>
                      {item?.data?.filter((i) => {
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
                      }).length > 0 ? (
                        <table className="table-auto w-full overflow-x-auto">
                          <thead className="bg-blue-500 text-white">
                            <tr>
                              <th className="px-2 border-gray-400 border">
                                Sl.
                              </th>
                              <th className="px-2 border-gray-400 border">
                                Name
                              </th>
                              <th className="px-2 border-gray-400 border">
                                SKU
                              </th>
                              <th className="px-2 border-gray-400 border">
                                Quantity
                              </th>
                              <th className="px-2 border-gray-400 border">
                                UOM
                              </th>
                              <th className="px-2 border-gray-400 border">
                                Stock Price
                              </th>
                              <th className="px-2 border-gray-400 border">
                                Additional Info
                              </th>
                            </tr>
                          </thead>
                          <tbody>
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
                                      onChange={() => {}}
                                      className="w-full px-2 border-none outline-none"
                                      readOnly
                                    />
                                  </td>
                                  <td className="bg-white border border-gray-400">
                                    <input
                                      type="text"
                                      value={item.sku}
                                      onChange={() => {}}
                                      className="w-full px-2 border-none outline-none"
                                      readOnly
                                    />
                                  </td>
                                  <td className="bg-white border border-gray-400">
                                    <input
                                      type="text"
                                      onChange={() => {}}
                                      value={item.quantity}
                                      className="w-full px-2 border-none outline-none"
                                      readOnly
                                    />
                                  </td>

                                  <td className="bg-white border border-gray-400">
                                    <input
                                      type="text"
                                      value={item.UOM}
                                      onChange={() => {}}
                                      className="w-full px-2 border-none outline-none"
                                    />
                                  </td>
                                  <td className="bg-white border border-gray-400">
                                    <input
                                      type="number"
                                      value={item.stockPrice}
                                      onChange={() => {}}
                                      className="w-full px-2 border-none outline-none"
                                    />
                                  </td>
                                  <td className="bg-white border border-gray-400">
                                    <input
                                      type="text"
                                      value={item.addInfo}
                                      onChange={() => {}}
                                      className="w-full px-2 border-none outline-none"
                                    />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className=" w-full text-center ">
                          No Items Available
                        </div>
                      )}
                    </>
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
