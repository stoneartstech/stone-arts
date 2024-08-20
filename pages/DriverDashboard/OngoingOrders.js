import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "@/firebase";
import Image from "next/image";
import ViewOrder from "../Logistics/ViewOrder";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Link from "next/link";
import OngoingOrders from "./OngoingOrders";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function CompletedOrders() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [upLoading, setUpLoading] = useState(false);
  const [viewSiteInfo, setViewSiteInfo] = useState(false);
  const [driver, setDriver] = useState("");
  const [actionsTab, setActionsTab] = useState(false);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(false);
  const [isUploadDN, setIsUploadDN] = useState(false);
  const [activeOrder, setActiveOrder] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [documents, setDocuments] = useState("");

  const fetchVehicleData = async () => {
    try {
      const result = await getDoc(doc(db, `Drivers/Driver-127`));
      const data = result?.data();

      if (data) {
        setDriver(data);
        if (data?.ongoingOrders) {
          setOrders(data?.ongoingOrders);
        }
        setLoading(false);
      }
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
        doc(db, `logistics-ongoing/${selectedOrder?.id}`)
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

  const handleUploadDN = async (event) => {
    setUpLoading(true);
    try {
      console.log(activeOrder);

      const storageRef = ref(storage, `Logistics-DN/${selectedOrder?.id}/DN`);
      await uploadBytes(storageRef, documents);

      const downloadURL = await getDownloadURL(storageRef);
      await setDoc(doc(db, `logistics-ongoing/${selectedOrder?.id}`), {
        ...activeOrder,
        DN: downloadURL,
      });
      setDocuments({ ...activeOrder, downloadURL });
      setActiveOrder({ ...activeOrder, downloadURL });
      setIsUploadDN(false);
      enqueueSnackbar("DN Uploaded Successfully", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Some Error Occured", {
        variant: "error",
      });
      console.error(error);
    }
    setUpLoading(false);
  };

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
                  {activeOrder?.DN ? (
                    <Link
                      href={activeOrder?.DN}
                      target="_blank"
                      className=" text-center bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black min-w-[250px]  md:min-w-[300px]"
                    >
                      Check Delivery Note
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (isUploadDN) {
                          setIsUploadDN(false);
                        } else {
                          setIsUploadDN(true);
                        }
                      }}
                      className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black min-w-[250px]  md:min-w-[300px]"
                    >
                      Upload Delivery Note
                    </button>
                  )}
                  {isUploadDN && (
                    <div className="flex flex-col min-w-[250px]  md:min-w-[300px]">
                      <p className=" font-medium">
                        Upload Delivery Note
                        <span className=" text-red-600">*</span>
                      </p>
                      <input
                        required
                        type="file"
                        onChange={(e) => {
                          setDocuments(e.target.files[0]);
                        }}
                        className=" p-2 w-full "
                      />
                      <button
                        type="button"
                        disabled={
                          upLoading || documents === "" || activeOrder?.DN
                        }
                        className=" upload-form-btn w-fit"
                        onClick={(event) => {
                          handleUploadDN(event);
                        }}
                      >
                        {upLoading ? "Uploading" : "Upload"}
                      </button>
                    </div>
                  )}
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
                            doc(
                              db,
                              "logistics-completed",
                              `${activeOrder?.id}`
                            ),
                            activeOrder
                          );
                          enqueueSnackbar(
                            ` ${activeOrder?.name} - ${
                              activeOrder?.id || activeOrder?.orderId
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
                    disabled={!activeOrder?.DN}
                    className=" mt-2 bg-[#94e63d] disabled:bg-gray-300 disabled:text-gray-700 hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-3 px-4 border-black border min-w-[250px]  md:min-w-[300px]"
                  >
                    Complete Delivery
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
