import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import ViewDeliveryNote from "./ViewDeliveryNotes";
import ViewOrder from "./ViewOrder";

export default function CompletedOrders() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [viewSiteInfo, setViewSiteInfo] = useState(false);
  const [viewDeliveryNote, setViewDeliverynote] = useState(false);
  const [filter, setFilter] = useState(0);
  const [orderType, setOrderType] = useState("");
  const [activeOrder, setActiveOrder] = useState("");
  const [orders, setOrders] = useState([]);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [activeTab, setActiveTab] = useState(false);

  const fetchVehicleData = async () => {
    try {
      const vehicleSnapshot = await getDocs(collection(db, "Vehicles"));
      const vehiclesList = vehicleSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehiclesList(vehiclesList);
      console.log(vehiclesList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
    }
  };

  useEffect(() => {
    const fetch = onSnapshot(
      collection(db, "logistics-pending"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(reports);
        setLoading(false);
      }
    );
    fetchVehicleData();
    return fetch;
  }, []);

  return (
    <>
      {viewDeliveryNote ? (
        <ViewDeliveryNote
          orderType={activeOrder?.type}
          orderID={activeOrder?.orderId}
          setViewDeliverynote={setViewDeliverynote}
        />
      ) : viewSiteInfo ? (
        <ViewOrder
          orderType={activeOrder?.type}
          order={activeOrder}
          setViewOrder={setViewSiteInfo}
        />
      ) : (
        <div>
          <div className="w-full relative md:px-8 flex flex-col md:flex-row justify-between">
            <button
              className="bg-slate-300 p-2 md:absolute left-10 rounded-lg w-fit text-sm md:text-base "
              onClick={() => {
                if (activeOrder !== "") {
                  setActiveOrder("");
                } else {
                  router.back();
                }
              }}
            >
              Go Back
            </button>
            <p className=" text-xl md:text-2xl  text-center w-full font-bold mb-2">
              {activeOrder === ""
                ? "Assign Order"
                : `Order - ${activeOrder?.orderId || activeOrder?.id}`}
            </p>
          </div>
          {activeOrder === "" ? (
            <>
              <div className="flex flex-col mt-7">
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
                    {orders?.length === 0 && (
                      <p className=" mt-3">No Orders Found !!</p>
                    )}{" "}
                    {orders?.map((order, index) => {
                      return (
                        <div
                          key={index}
                          className=" mt-4  md:w-[45%] grid grid-cols-3"
                        >
                          <div className=" col-span-2  border-black border flex items-center justify-center font-semibold">
                            {order?.name && order?.clientId
                              ? order?.name + " - " + order?.clientId
                              : "Order ID - " + String(order?.orderId)}
                          </div>
                          <button
                            onClick={() => {
                              setActiveOrder(order);
                              setOrderType(0);
                            }}
                            className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0"
                          >
                            Check Order
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className=" w-full flex flex-col">
              <div className=" grid grid-cols-1 md:grid-cols-4  gap-3 items-center  w-full px-6">
                <p className="mt-2 p-2.5 bg-white px-2 md:px-4">
                  Client Name : {activeOrder?.name}
                </p>
                <p className="mt-2 p-2.5 bg-white px-2 md:px-4">
                  Client Code : {activeOrder?.clientCode}
                </p>
                <p className="mt-2 p-2.5 bg-white px-2 md:px-4">
                  Location : {activeOrder?.location}
                </p>
                <p className="mt-2 p-2.5 bg-white px-2 md:px-4">
                  Date : {activeOrder?.date}
                </p>
                <button
                  onClick={(e) => {
                    setViewDeliverynote(true);
                  }}
                  className=" cursor-pointer  bg-green-500 disabled:bg-gray-400 disabled:text-gray-700 py-2.5 px-4 text-white font-semibold"
                >
                  Check Delivery Note
                </button>
                <button
                  onClick={(e) => {
                    setViewSiteInfo(true);
                  }}
                  className=" cursor-pointer  bg-green-500 disabled:bg-gray-400 disabled:text-gray-700 py-2.5 px-4 text-white font-semibold"
                >
                  Check Site Info
                </button>
              </div>
              <div className="  p-1 md:p-5 mt-3 rounded-lg ">
                <div className=" flex flex-col  px-3  relative ">
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
                      {vehiclesList?.length === 0 && (
                        <p className=" mt-2">No Vehicles Found !!</p>
                      )}{" "}
                      {vehiclesList?.map((order, index) => {
                        return (
                          <div key={index}>
                            <div className=" mt-2.5 md:w-[90%] grid grid-cols-3 md:grid-cols-5">
                              <div className=" py-1.5 md:py-0  col-span-3 md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                                {order?.name}
                              </div>
                              <button
                                onClick={() => {}}
                                className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 px-4 border-black border md:border-l-0"
                              >
                                Assign Delivery
                              </button>
                              <button
                                onClick={() => {
                                  if (activeTab?.name === order?.name) {
                                    setActiveTab(false);
                                  } else {
                                    setActiveTab(order);
                                  }
                                }}
                                className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 px-4 border-black border border-l-0"
                              >
                                Check Vehicle
                              </button>
                              <button
                                onClick={() => {
                                  // handleSiteOrders(order.clientId);
                                }}
                                className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 px-4 border-black border border-l-0"
                              >
                                Check Assigned Deliveries
                              </button>
                            </div>
                            {activeTab && activeTab?.name === order?.name && (
                              <div className=" flex flex-col p-2 ">
                                <p>Name: {activeTab?.name}</p>
                                <p>Description: {activeTab?.description}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
