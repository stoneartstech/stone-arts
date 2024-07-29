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
import { enqueueSnackbar, SnackbarProvider } from "notistack";

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
    const isOkay = confirm("Confirm Complete Order");
    if (isOkay) {
      try {
        const report = pendingSiteOrders.filter((i) => {
          return i?.clientId === clientId;
        });
        let newData = { ...report[0], type: "site" };
        // console.log(report);
        await setDoc(doc(db, `logistics-pending/${clientId}`), newData);
        await setDoc(doc(db, `workshop-site-completed/${clientId}`), report[0]);
        await deleteDoc(doc(db, `workshop-site-pending/${clientId}`));
        enqueueSnackbar("Order Completed", {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Some error occured", {
          variant: "error",
        });
      }
    }
  };
  const handleRetailOrders = async (clientId) => {
    const isOkay = confirm("Confirm Complete Order");
    if (isOkay) {
      try {
        const report = pendingRetailOrders.filter((i) => {
          return i?.clientId === clientId || i?.orderId === clientId;
        });
        let newData = { ...report[0], type: "retail" };
        // console.log(report);
        await setDoc(doc(db, `logistics-pending/${clientId}`), newData);
        await setDoc(
          doc(db, `workshop-retail-completed/${clientId}`),
          report[0]
        );
        await deleteDoc(doc(db, `workshop-retail-pending/${clientId}`));
        enqueueSnackbar("Order Completed", {
          variant: "success",
        });
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Some error occured", {
          variant: "error",
        });
      }
    }
  };

  return (
    <>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
      {viewOrder ? (
        <ViewOrder
          orderType={orderType}
          order={activeOrder}
          setViewOrder={setViewOrder}
        />
      ) : (
        <div>
          <div className="w-full relative md:px-8 flex flex-col md:flex-row justify-between">
            <button className="go-back-btn" onClick={() => router.back()}>
              Go Back
            </button>
          </div>
          <p className="page-heading ">Workshop Home Page</p>
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
                        <div className=" py-1.5 md:py-0  col-span-3 md:col-span-2 text-sm md:text-base  border-black border-b-0 md:border-b border flex items-center justify-center font-semibold">
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
                            <table className="custom-table">
                              <thead className="custom-table-head">
                                <tr>
                                  <th className="custom-table-row">Sl. No.</th>
                                  <th className="custom-table-row">
                                    Product Name
                                  </th>
                                  <th className="custom-table-row">
                                    Product Description
                                  </th>
                                  <th className="custom-table-row">Size</th>
                                  <th className="custom-table-row">Quantity</th>
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
                            <table className="custom-table">
                              <thead className="custom-table-head">
                                <tr>
                                  <th className="custom-table-row">Sl. No.</th>
                                  <th className="custom-table-row">
                                    Product Name
                                  </th>
                                  <th className="custom-table-row">
                                    Product Description
                                  </th>
                                  <th className="custom-table-row">Size</th>
                                  <th className="custom-table-row">Quantity</th>
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
            </div>
          )}
        </div>
      )}
    </>
  );
}
