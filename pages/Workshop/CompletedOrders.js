import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import ViewOrder from "./ViewOrder";

const filterList = [
  {
    id: 0,
    name: "All",
  },
  {
    id: 1,
    name: "Standard",
  },
  {
    id: 2,
    name: "Non-Standard",
  },
];
export default function CompletedOrders() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(0);
  const [completedSiteOrders, setCompletedSiteOrders] = useState([]);
  const [completedRetailOrders, setCompletedRetailOrders] = useState([]);

  const [viewOrder, setViewOrder] = useState(false);
  const [activeOrder, setActiveOrder] = useState("");
  const [orderType, setOrderType] = useState(0);
  const [activeQuote, setActiveQuote] = useState("");
  const [pendingSiteOrders, setPendingSiteOrders] = useState([]);
  const [viewSiteOrders, setViewSiteOrders] = useState(true);
  const [pendingRetailOrders, setPendingRetailOrders] = useState([]);

  useEffect(() => {
    const fetch = onSnapshot(
      collection(db, "workshop-site-completed"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompletedSiteOrders(reports);
      }
    );
    const fetch2 = onSnapshot(
      collection(db, "workshop-retail-completed"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompletedRetailOrders(reports);
        setLoading(false);
      }
    );

    return fetch, fetch2;
  }, []);

  return (
    <>
      {viewOrder ? (
        <ViewOrder
          orderType={orderType}
          order={activeOrder}
          setViewOrder={setViewOrder}
          action="view"
        />
      ) : (
        <div>
          <div className="w-full relative md:px-8 flex flex-col md:flex-row justify-between">
            <button
              className="bg-slate-300 p-2 md:absolute left-10 rounded-lg w-fit text-sm md:text-base "
              onClick={() => router.back()}
            >
              Go Back
            </button>
            <p className=" text-xl md:text-2xl  text-center w-full font-bold mb-2">
              Workshop Home Page
            </p>
            <div></div>
          </div>
          <div className=" flex items-center justify-center">
            <div className=" mt-6 md:w-[40%] grid grid-cols-3 border-l border-black">
              {filterList.map((item, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setFilter(item.id);
                    }}
                    className={` ${
                      item.id === filter ? "bg-gray-400" : "hover:bg-gray-300"
                    } text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0 `}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col mt-7">
            <p className="text-lg md:text-2xl mx-auto font-semibold underline mb-2">
              Completed Site Orders
            </p>
            {loading ? (
              <div className=" w-full flex items-center justify-center">
                <Image
                  width={50}
                  height={50}
                  src="/loading.svg"
                  alt="Loading ..."
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {completedSiteOrders?.filter((i) => {
                  if (filter === 0) {
                    return i;
                  } else if (filter === 1) {
                    return i.standard === true;
                  } else {
                    return i.standard !== true;
                  }
                }).length === 0 && (
                  <p className=" mt-3">No Orders Found !!</p>
                )}{" "}
                {completedSiteOrders
                  ?.filter((i) => {
                    if (filter === 0) {
                      return i;
                    } else if (filter === 1) {
                      return i.standard === true;
                    } else {
                      return i.standard !== true;
                    }
                  })
                  ?.map((order, index) => {
                    return (
                      <div
                        key={index}
                        className=" mt-4  md:w-[55%] grid grid-cols-4"
                      >
                        <div className=" col-span-2  border-black border flex items-center justify-center font-semibold text-sm md:text-base">
                          {order?.name && order?.clientId
                            ? order?.name + " - " + order?.clientId
                            : "Order ID - " + String(order?.orderId)}
                        </div>
                        <button
                          onClick={() => {
                            setActiveOrder(order);
                            setViewOrder(true);
                            setOrderType(0);
                            console.log(order);
                          }}
                          className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0"
                        >
                          Check Orders
                        </button>
                        <button
                          onClick={() => {
                            if (activeQuote === order?.orderId) {
                              setActiveQuote("");
                            } else {
                              setActiveQuote(order?.orderId);
                            }
                          }}
                          className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0"
                        >
                          Check Quote
                        </button>
                        {activeQuote === order?.orderId && (
                          <div className=" overflow-x-auto text-sm md:text-base p-2 col-span-4  md:col-span-5 bg-gray-100 w-full">
                            <table className="custom-table">
                              <thead className="custom-table-head">
                                <tr>
                                  <th className="custom-table-rowr">Sl. No.</th>
                                  <th className="custom-table-rowr">
                                    Product Name
                                  </th>
                                  <th className="custom-table-rowr">
                                    Product Description
                                  </th>
                                  <th className="custom-table-rowr">Size</th>
                                  <th className="custom-table-rowr">
                                    Quantity
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {order?.order?.map((item, index) => (
                                  <tr key={index}>
                                    <td className="custom-table-data text-center">
                                      {index + 1}
                                    </td>
                                    <td className="custom-table-data">
                                      {item?.prodName}
                                    </td>
                                    <td className="custom-table-data">
                                      {item?.prodDesc}
                                    </td>
                                    <td className="custom-table-data">
                                      {item?.Size}
                                    </td>
                                    <td className="custom-table-data">
                                      {item?.Qty}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
          <div className="flex flex-col mt-7">
            <p className=" text-lg md:text-2xl mx-auto font-semibold underline mb-2">
              Completed Retail Orders
            </p>
            {loading ? (
              <div className=" w-full flex items-center justify-center">
                <Image
                  width={50}
                  height={50}
                  src="/loading.svg"
                  alt="Loading ..."
                />
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {completedRetailOrders?.filter((i) => {
                  if (filter === 0) {
                    return i;
                  } else if (filter === 1) {
                    return i.standard === true;
                  } else {
                    return i.standard !== true;
                  }
                }).length === 0 && (
                  <p className=" mt-3">No Orders Found !!</p>
                )}{" "}
                {completedRetailOrders
                  ?.filter((i) => {
                    if (filter === 0) {
                      return i;
                    } else if (filter === 1) {
                      return i.standard === true;
                    } else {
                      return i.standard !== true;
                    }
                  })
                  ?.map((order, index) => {
                    return (
                      <div
                        key={index}
                        className=" mt-4  md:w-[55%] grid grid-cols-4"
                      >
                        <div className=" col-span-2  border-black border flex items-center justify-center font-semibold text-sm md:text-base">
                          {order?.name && order?.clientId
                            ? order?.name + " - " + order?.clientId
                            : "Order ID - " + String(order?.orderId)}
                        </div>
                        <button
                          onClick={() => {
                            setActiveOrder(order);
                            setViewOrder(true);
                            setOrderType(0);
                            console.log(order);
                          }}
                          className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0"
                        >
                          Check Orders
                        </button>
                        <button
                          onClick={() => {
                            if (activeQuote === order?.orderId) {
                              setActiveQuote("");
                            } else {
                              setActiveQuote(order?.orderId);
                            }
                          }}
                          className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0"
                        >
                          Check Quote
                        </button>
                        {activeQuote === order?.orderId && (
                          <div className=" overflow-x-auto text-sm md:text-base p-2 col-span-4  md:col-span-5 bg-gray-100 w-full">
                            <table className="custom-table">
                              <thead className="custom-table-head">
                                <tr>
                                  <th className="custom-table-rowr">Sl. No.</th>
                                  <th className="custom-table-rowr">
                                    Product Name
                                  </th>
                                  <th className="custom-table-rowr">
                                    Product Description
                                  </th>
                                  <th className="custom-table-rowr">Size</th>
                                  <th className="custom-table-rowr">
                                    Quantity
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {order?.order?.map((item, index) => (
                                  <tr key={index}>
                                    <td className="custom-table-data text-center">
                                      {index + 1}
                                    </td>
                                    <td className="custom-table-data">
                                      {item?.prodName}
                                    </td>
                                    <td className="custom-table-data">
                                      {item?.prodDesc}
                                    </td>
                                    <td className="custom-table-data">
                                      {item?.Size}
                                    </td>
                                    <td className="custom-table-data">
                                      {item?.Qty}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
