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
export default function PendingOrders() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState(false);
  const [activeOrder, setActiveOrder] = useState("");
  const [orderType, setOrderType] = useState(0);
  const [activeQuote, setActiveQuote] = useState("");
  const [filter, setFilter] = useState(0);
  const [pendingSiteOrders, setPendingSiteOrders] = useState([]);
  const [viewSiteOrders, setViewSiteOrders] = useState(true);
  const [pendingRetailOrders, setPendingRetailOrders] = useState([]);

  useEffect(() => {
    const fetch = onSnapshot(
      collection(db, "workshop-site-pending"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingSiteOrders(reports);
      }
    );
    const fetch2 = onSnapshot(
      collection(db, "workshop-retail-pending"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingRetailOrders(reports);
      }
    );

    setLoading(false);
    return fetch, fetch2;
  }, []);

  const handleSiteOrders = async (clientId) => {
    try {
      const report = pendingSiteOrders.filter((i) => {
        return i?.clientId === clientId;
      });
      let newData = { ...report[0], type: "site" };
      // console.log(report);
      await setDoc(doc(db, `logistics-pending/${clientId}`), newData);
      await setDoc(doc(db, `workshop-site-completed/${clientId}`), report[0]);
      await deleteDoc(doc(db, `workshop-site-pending/${clientId}`));
      alert("Uploaded");
    } catch (error) {
      console.log(error);
      alert("Try again Later !! ");
    }
  };
  const handleRetailOrders = async (clientId) => {
    try {
      const report = pendingRetailOrders.filter((i) => {
        return i?.clientId === clientId || i?.orderId === clientId;
      });
      let newData = { ...report[0], type: "retail" };
      // console.log(report);
      await setDoc(doc(db, `logistics-pending/${clientId}`), newData);
      await setDoc(doc(db, `workshop-retail-completed/${clientId}`), report[0]);
      await deleteDoc(doc(db, `workshop-retail-pending/${clientId}`));
      alert("Uploaded");
    } catch (error) {
      console.log(error);
      alert("Try again Later !! ");
    }
  };

  return (
    <>
      {viewOrder ? (
        <ViewOrder
          orderType={orderType}
          order={activeOrder}
          setViewOrder={setViewOrder}
        />
      ) : (
        <div>
          <div className="w-full relative md:px-8 flex flex-col md:flex-row justify-between">
            <button
              className="bg-slate-300 p-2 md:absolute left-10 rounded-lg w-fit"
              onClick={() => router.back()}
            >
              Go Back
            </button>
            <p className="text-xl md:text-2xl  text-center w-full font-bold mb-2">
              Workshop Home Page
            </p>
          </div>
          <div className=" flex items-center justify-center mt-2 w-full font-semibold">
            <button
              onClick={() => {
                setViewSiteOrders(true);
              }}
              className={` ${
                viewSiteOrders ? "bg-gray-400" : "hover:bg-gray-300"
              } text-xs md:text-sm font-semibold md:w-[100px] py-1.5 md:py-2.5 px-4 border-black border border-r-0 `}
            >
              Site
            </button>
            <button
              onClick={() => {
                setViewSiteOrders(false);
              }}
              className={` ${
                !viewSiteOrders ? "bg-gray-400" : "hover:bg-gray-300"
              } text-xs md:text-sm font-semibold md:w-[100px] py-1.5 md:py-2.5 px-4 border-black border `}
            >
              Retail
            </button>
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

          {viewSiteOrders ? (
            <div className="flex flex-col mt-7">
              <p className=" text-lg md:text-2xl mx-auto font-semibold underline mb-2">
                Pending Site Orders
              </p>
              <div className="flex flex-col items-center">
                {pendingSiteOrders?.filter((i) => {
                  if (filter === 0) {
                    return i;
                  } else if (filter === 1) {
                    return i?.orderType?.toLowerCase() === "standard";
                  } else {
                    return i?.orderType?.toLowerCase() !== "standard";
                  }
                }).length === 0 && (
                  <p className=" mt-3">No Orders Found !!</p>
                )}{" "}
                {pendingSiteOrders
                  ?.filter((i) => {
                    if (filter === 0) {
                      return i;
                    } else if (filter === 1) {
                      return i?.orderType?.toLowerCase() === "standard";
                    } else {
                      return i?.orderType?.toLowerCase() !== "standard";
                    }
                  })
                  ?.map((order, index) => {
                    return (
                      <div
                        key={index}
                        className=" mt-4 md:w-[70%] grid grid-cols-3 md:grid-cols-5"
                      >
                        <div className=" py-1.5 md:py-0  col-span-3 md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
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
                          className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border md:border-l-0"
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
                        <button
                          onClick={() => {
                            handleSiteOrders(order.clientId);
                          }}
                          className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0"
                        >
                          Complete Order
                        </button>
                        {activeQuote === order?.orderId && (
                          <div className=" overflow-x-auto text-sm md:text-base p-2 col-span-3  md:col-span-5 bg-gray-100 w-full">
                            <table className="  w-full mt-2 table-auto">
                              <thead className="bg-blue-500 text-white">
                                <tr>
                                  <th className="px-2 border-gray-400 border">
                                    Sl. No.
                                  </th>
                                  <th className="px-2 border-gray-400 border">
                                    Product Name
                                  </th>
                                  <th className="px-2 border-gray-400 border">
                                    Product Description
                                  </th>
                                  <th className="px-2 border-gray-400 border">
                                    Size
                                  </th>
                                  <th className="px-2 border-gray-400 border">
                                    Quantity
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {order?.order?.map((item, index) => (
                                  <tr key={index}>
                                    <td className="bg-white border border-gray-400 text-center">
                                      {index + 1}
                                    </td>
                                    <td className="bg-white border border-gray-400">
                                      {item?.prodName}
                                    </td>
                                    <td className="bg-white border border-gray-400">
                                      {item?.prodDesc}
                                    </td>
                                    <td className="bg-white border border-gray-400">
                                      {item?.Size}
                                    </td>
                                    <td className="bg-white border border-gray-400">
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
            </div>
          ) : (
            <div className="flex flex-col mt-7">
              <p className="text-2xl mx-auto font-semibold underline mb-2">
                Pending Retail Orders
              </p>
              <div className="flex flex-col items-center">
                {pendingRetailOrders?.filter((i) => {
                  if (filter === 0) {
                    return i;
                  } else if (filter === 1) {
                    return i?.orderType?.toLowerCase() === "standard";
                  } else {
                    return i?.orderType?.toLowerCase() !== "standard";
                  }
                }).length === 0 && (
                  <p className=" mt-3">No Orders Found !!</p>
                )}{" "}
                {pendingRetailOrders
                  ?.filter((i) => {
                    if (filter === 0) {
                      return i;
                    } else if (filter === 1) {
                      return i?.orderType?.toLowerCase() === "standard";
                    } else {
                      return i?.orderType?.toLowerCase() !== "standard";
                    }
                  })
                  ?.map((order, index) => {
                    return (
                      <div
                        key={index}
                        className=" mt-4 md:w-[70%] grid grid-cols-3 md:grid-cols-5"
                      >
                        <div className=" py-1.5 md:py-0  col-span-3 md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                          {order?.name && order?.clientId
                            ? order?.name + " - " + order?.clientId
                            : "Order ID - " + String(order?.orderId)}
                        </div>
                        <button
                          onClick={() => {
                            setActiveOrder(order);
                            setViewOrder(true);
                            setOrderType(1);
                            console.log(order);
                          }}
                          className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border md:border-l-0"
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
                        <button
                          onClick={() => {
                            handleRetailOrders(
                              order.clientId || order?.orderId
                            );
                          }}
                          className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0"
                        >
                          Complete Order
                        </button>
                        {activeQuote === order?.orderId && (
                          <div className=" overflow-x-auto text-sm md:text-base p-2 col-span-3  md:col-span-5 bg-gray-100 w-full">
                            <table className="  w-full mt-2 table-auto">
                              <thead className="bg-blue-500 text-white">
                                <tr>
                                  <th className="px-2 border-gray-400 border">
                                    Sl. No.
                                  </th>
                                  <th className="px-2 border-gray-400 border">
                                    Product Name
                                  </th>
                                  <th className="px-2 border-gray-400 border">
                                    Product Description
                                  </th>
                                  <th className="px-2 border-gray-400 border">
                                    Size
                                  </th>
                                  <th className="px-2 border-gray-400 border">
                                    Quantity
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {order?.order?.map((item, index) => (
                                  <tr key={index}>
                                    <td className="bg-white border border-gray-400 text-center">
                                      {index + 1}
                                    </td>
                                    <td className="bg-white border border-gray-400">
                                      {item?.prodName}
                                    </td>
                                    <td className="bg-white border border-gray-400">
                                      {item?.prodDesc}
                                    </td>
                                    <td className="bg-white border border-gray-400">
                                      {item?.Size}
                                    </td>
                                    <td className="bg-white border border-gray-400">
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
            </div>
          )}
        </div>
      )}
    </>
  );
}
