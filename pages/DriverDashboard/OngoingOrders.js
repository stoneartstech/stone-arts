import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import ViewOrder from "../Logistics/ViewOrder";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Link from "next/link";
import OngoingOrders from "./OngoingOrders";

export default function CompletedOrders() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [viewSiteInfo, setViewSiteInfo] = useState(false);
  const [driver, setDriver] = useState("");
  const [actionsTab, setActionsTab] = useState(false);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(false);
  const [activeTab, setActiveTab] = useState(false);
  const [activeOrder, setActiveOrder] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");

  const fetchVehicleData = async () => {
    try {
      const result = await getDoc(doc(db, `Drivers/Driver-127`));
      const data = result?.data();
      if (data) {
        setDriver(data);
        if (data?.ongoingOrders) {
          setOrders(data?.ongoingOrders);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, []);

  const fetchOrder = async () => {
    try {
      const result = await getDoc(
        doc(db, `logistics-pending/${selectedOrder?.id}`)
      );
      const data = result?.data();
      if (data) {
        setActiveOrder(data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Order Details: ", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [selectedOrder]);

  return (
    <>
      {viewSiteInfo ? (
        <ViewOrder
          orderType={activeOrder?.type}
          order={activeOrder}
          setViewOrder={setViewSiteInfo}
        />
      ) : (
        <div>
          <SnackbarProvider
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          />
          <div className="w-full relative md:px-8 flex flex-col md:flex-row justify-between">
            <button
              className="bg-slate-300 p-2 md:absolute left-10 rounded-lg w-fit text-sm md:text-base "
              onClick={() => {
                if (actionsTab) {
                  setActionsTab(false);
                  setSelectedOrder("");
                } else {
                  router.back();
                }
              }}
            >
              Go Back
            </button>
            <p className=" text-xl md:text-2xl  text-center w-full font-bold mb-2">
              {selectedOrder === ""
                ? "Ongoing Orders"
                : `Order - ${selectedOrder?.orderId || selectedOrder?.id}`}
            </p>
          </div>
          <>
            {!actionsTab ? (
              <div className=" flex flex-col items-center justify-center ">
                {orders?.length === 0 && (
                  <p className=" mt-3">No Ongoing Orders.</p>
                )}{" "}
                {orders?.map((order, index) => {
                  return (
                    <div
                      key={index}
                      className=" mt-4 w-[250px] md:w-[40%] grid grid-cols-3"
                    >
                      <div className=" py-1.5 md:py-0  col-span-3 md:md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                        Order ID - {order?.clientId || order?.id}
                      </div>
                      <button
                        onClick={() => {
                          setActionsTab(true);
                          setSelectedOrder(order);
                        }}
                        className=" col-span-3 md:col-span-1 bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-t-0 md:border-t md:border-l-0"
                      >
                        Actions
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className=" flex flex-col items-center justify-center gap-2  mt-3">
                <Link
                  href={`/PMTHead/actions/CheckImages?qsName=${selectedOrder?.qsName}&clientId=${selectedOrder?.clientId}&clientName=${selectedOrder?.name}&type=view`}
                >
                  <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black min-w-[250px]  md:min-w-[300px]">
                    Upload Delivery Note
                  </button>
                </Link>

                <button
                  onClick={async () => {
                    const okay = confirm(
                      ` Complete ${selectedOrder?.name} - ${selectedOrder?.id} `
                    );
                    try {
                      if (okay) {
                        const tempData = [...orders];
                        const updatedData = tempData.filter((item) => {
                          return item?.id !== selectedOrder?.id;
                        });
                        const tempData2 = driver?.completedOrders
                          ? driver?.completedOrders
                          : [];
                        tempData2.push(selectedOrder);
                        const tempDriverData = {
                          ...driver,
                          ongoingOrders: updatedData,
                          completedOrders: tempData2,
                        };
                        await setDoc(
                          doc(db, "Drivers", `${driver?.name}`),
                          tempDriverData
                        );
                        await deleteDoc(
                          doc(db, "logistics-ongoing", `${activeOrder?.id}`)
                        );
                        await setDoc(
                          doc(db, "logistics-completed", `${activeOrder?.id}`),
                          activeOrder
                        );
                        enqueueSnackbar(
                          ` ${selectedOrder?.name} - ${
                            selectedOrder?.id || selectedOrder?.orderId
                          } Completed`,
                          {
                            variant: "success",
                          }
                        );
                        router.back();
                      }
                    } catch (error) {
                      enqueueSnackbar("Some error occured", {
                        variant: "error",
                      });
                      console.error(error);
                    }
                  }}
                  className=" mt-2 bg-[#94e63d] disabled:bg-gray-300 disabled:text-gray-700 hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-3 px-4 border-black border min-w-[250px]  md:min-w-[300px]"
                >
                  Complete Delivery
                </button>
              </div>
            )}
          </>
        </div>
      )}
    </>
  );
}
