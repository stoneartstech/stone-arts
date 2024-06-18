import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  getDoc,
  docs,
  deleteDoc,
} from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function OrderHistory() {
  const searchParams = useSearchParams();
  const showroomName = searchParams.get("showroomName");
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const showroomDbNames = {
    Galleria: "orders",
    Mirage: "mirage-orders",
    Kisumu: "kisumu-orders",
    "Mombasa Road": "mombasa-orders",
  };
  const showroomDbName = showroomDbNames[showroomName];
  const router = useRouter();

  const [clientCode, setClientCode] = useState("");
  const [orderId, setOrderId] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [workshop, setWorkshop] = useState("matasia");
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [orderDesignation, setOrderDesignation] = useState("showroom");
  const [orderType, setOrderType] = useState("standard");
  const [orderDate, setOrderDate] = useState("");
  const [viewConfirmed, setViewConfirmed] = useState(false);
  const [viewOrderTypes, setViewOrdersTypes] = useState(true);
  const [pendingRetailOrders, setPendingRetailOrders] = useState([]);
  const [order, setOrder] = useState({});

  const [ordersData, setOrdersData] = useState([]);
  useEffect(() => {
    const fetch = onSnapshot(collection(db, showroomDbName), (snapshot) => {
      var orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrdersData(orders);
    });
    const fetch2 = onSnapshot(
      collection(db, "workshop-retail-pending"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingRetailOrders(reports);
        setLoading(false);
      }
    );
    return fetch, fetch2;
  }, []);

  const [selectedOrderId, setSelectedOrderId] = useState(-1);
  const handleClick = (orderId) => {
    setSelectedOrderId(orderId === selectedOrderId ? null : orderId);
  };

  return (
    <>
      {!loading && (
        <div>
          <div className="w-full pl-6">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => {
                if (!viewOrderTypes) {
                  setViewOrdersTypes(true);
                } else {
                  router.back();
                }
              }}
            >
              Go Back
            </button>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl">
              {viewOrderTypes ? (
                "Orders History"
              ) : (
                <>{viewConfirmed ? "Confirmed Orders" : "Unconfirmed Orders"}</>
              )}
            </p>
          </div>
          {viewOrderTypes ? (
            <>
              <div className=" flex flex-col justify-center items-center mt-6 gap-3 ">
                <button
                  onClick={() => {
                    setViewConfirmed(true);
                    setViewOrdersTypes(false);
                  }}
                  className=" py-2.5 px-6 bg-blue-400 hover:bg-blue-500 text-white  font-semibold w-[200px] "
                >
                  Confirmed Orders
                </button>
                <button
                  onClick={() => {
                    setViewConfirmed(false);
                    setViewOrdersTypes(false);
                  }}
                  className=" py-2.5 px-6 bg-blue-400 hover:bg-blue-500 text-white  font-semibold w-[200px] "
                >
                  Unconfirmed Orders
                </button>
              </div>
            </>
          ) : (
            <>
              {viewConfirmed ? (
                <>
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
                    <div className="flex flex-col gap-4 mt-2">
                      {pendingRetailOrders?.length > 0 ? (
                        <>
                          {pendingRetailOrders?.map((order) => (
                            <div
                              key={order.orderId}
                              className="p-1.5 bg-slate-300 cursor-pointer"
                              onClick={() => handleClick(order?.orderId)}
                            >
                              <div className=" flex items-center justify-between px-3">
                                <p>Order Id: {order?.orderId}</p>
                              </div>
                              {selectedOrderId === order?.orderId && (
                                <div className="p-2 bg-slate-300 mt-2">
                                  <p>Order Date: {order.date}</p>
                                  <p>Order Type: {order.orderType}</p>
                                  <p>
                                    Order Designation: {order.orderDesignation}
                                  </p>
                                  <p>Client Code: {order.clientCode}</p>
                                  <p>Invoice Number: {order.invoiceNumber}</p>
                                  <p>Location: {order.location}</p>
                                  <p>Client Name: {order.name}</p>
                                  <p>Workshop: {order.workshop}</p>
                                  <p>
                                    Order Status:{" "}
                                    {order.confirmed === true
                                      ? "confirmed"
                                      : "not confirmed"}
                                  </p>

                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Prod Name</th>
                                        <th>Prod Desc</th>
                                        <th>Size</th>
                                        <th>Qty</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order?.order?.map((item) => (
                                        <tr key={item.prodName}>
                                          <td className="px-6">
                                            {item.prodName}
                                          </td>
                                          <td className="px-12">
                                            {item.prodDesc}
                                          </td>
                                          <td className="px-6">{item.Size}</td>
                                          <td className="px-4 text-center">
                                            {item.Qty}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <p className=" text-center mt-4">No Confirmed Orders</p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
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
                    <div className="flex flex-col gap-4 mt-2">
                      {ordersData?.length > 0 ? (
                        <>
                          {ordersData.map((order) => (
                            <div
                              key={order.orderId}
                              className="p-1.5 bg-slate-300 cursor-pointer"
                              onClick={() => handleClick(order.orderId)}
                            >
                              <div className=" flex items-center justify-between px-3">
                                <p>Order Id: {order.orderId}</p>
                                {currentUser &&
                                  currentUser?.email ===
                                    "admin@stonearts.com" && (
                                    <button
                                      onClick={() => {
                                        setDoc(
                                          doc(
                                            db,
                                            "workshop-retail-pending",
                                            `${order?.orderId}`
                                          ),
                                          order
                                        );
                                        deleteDoc(
                                          doc(
                                            db,
                                            showroomDbName,
                                            `${order?.orderId}`
                                          ),
                                          order
                                        );
                                        alert(
                                          `Order - ${order?.orderId} Confirmed`
                                        );
                                      }}
                                      className=" font-medium bg-green-400 text-sm hover:bg-green-500 py-2 px-4"
                                    >
                                      Confirm Order
                                    </button>
                                  )}
                              </div>
                              {selectedOrderId === order.orderId && (
                                <div className="p-2 bg-slate-300 mt-2">
                                  <p>Order Date: {order.date}</p>
                                  <p>Order Type: {order.orderType}</p>
                                  <p>
                                    Order Designation: {order.orderDesignation}
                                  </p>
                                  <p>Client Code: {order.clientCode}</p>
                                  <p>Invoice Number: {order.invoiceNumber}</p>
                                  <p>Location: {order.location}</p>
                                  <p>Client Name: {order.name}</p>
                                  <p>Workshop: {order.workshop}</p>
                                  <p>
                                    Order Status:{" "}
                                    {order.confirmed === true
                                      ? "confirmed"
                                      : "not confirmed"}
                                  </p>

                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Prod Name</th>
                                        <th>Prod Desc</th>
                                        <th>Size</th>
                                        <th>Qty</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.order.map((item) => (
                                        <tr key={item.prodName}>
                                          <td className="px-6">
                                            {item.prodName}
                                          </td>
                                          <td className="px-12">
                                            {item.prodDesc}
                                          </td>
                                          <td className="px-6">{item.Size}</td>
                                          <td className="px-4 text-center">
                                            {item.Qty}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          ))}
                        </>
                      ) : (
                        <p className=" text-center mt-4">
                          No Unconfirmed Orders
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
