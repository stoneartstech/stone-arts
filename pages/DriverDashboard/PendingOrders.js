import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
  const [viewSiteInfo, setViewSiteInfo] = useState(false);
  const [driver, setDriver] = useState("");
  const [actionsTab, setActionsTab] = useState(false);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(false);
  const [activeTab, setActiveTab] = useState(false);
  const [activeOrder, setActiveOrder] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [upLoading, setUpLoading] = useState(false);
  const [isUploadDN, setIsUploadDN] = useState(false);
  const [documents, setDocuments] = useState("");

  const fetchVehicleData = async () => {
    try {
      const result = await getDoc(doc(db, `Drivers/Driver-127`));
      const data = result?.data();
      if (data) {
        setDriver(data);
        if (data?.pendingOrders) {
          setOrders(data?.pendingOrders);
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

  const handleUploadDN = async (event) => {
    setUpLoading(true);
    try {
      console.log(activeOrder);

      const storageRef = ref(storage, `Logistics-DN/${selectedOrder?.id}/DN`);
      await uploadBytes(storageRef, documents);

      const downloadURL = await getDownloadURL(storageRef);
      await setDoc(doc(db, `logistics-pending/${selectedOrder?.id}`), {
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
                ? "Pending Orders"
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
                    <p className=" mt-3">No Pending Orders.</p>
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
                  <button
                    onClick={() => {
                      if (activeTab === 0) {
                        setActiveTab(false);
                      } else {
                        setActiveTab(0);
                      }
                    }}
                    className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black min-w-[250px]  md:min-w-[300px]"
                  >
                    Check Information
                  </button>
                  {activeTab === 0 && (
                    <div className=" flex flex-col min-w-[250px]  md:min-w-[300px] py-2">
                      {" "}
                      <p className="">Client Name : {activeOrder?.name}</p>
                      <p className="">
                        Client Code : {activeOrder?.clientCode}
                      </p>
                      <p className="">Location : {activeOrder?.location}</p>
                      <p className="">Date : {activeOrder?.date}</p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (activeTab === 1) {
                        setActiveTab(false);
                      } else {
                        setActiveTab(1);
                      }
                    }}
                    className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black min-w-[250px]  md:min-w-[300px]"
                  >
                    Check Products
                  </button>
                  {activeTab === 1 && (
                    <div className=" overflow-x-auto w-full">
                      <table className="  text-base md:text-base  w-full mt-2 table-auto">
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
                          {activeOrder?.order?.map((item, index) => (
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
                  <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black min-w-[250px]  md:min-w-[300px]">
                    Upload Proof
                  </button>
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
                        ` Start ${selectedOrder?.name} - ${selectedOrder?.id} `
                      );
                      try {
                        if (okay) {
                          const tempData = [...orders];
                          const updatedData = tempData.filter((item) => {
                            return item?.id !== selectedOrder?.id;
                          });
                          const tempData2 = driver?.ongoingOrders
                            ? driver?.ongoingOrders
                            : [];
                          tempData2.push(selectedOrder);
                          const tempDriverData = {
                            ...driver,
                            pendingOrders: updatedData,
                            ongoingOrders: tempData2,
                          };
                          await setDoc(
                            doc(db, "Drivers", `${driver?.name}`),
                            tempDriverData
                          );
                          await setDoc(
                            doc(db, "logistics-ongoing", `${activeOrder?.id}`),
                            activeOrder
                          );
                          enqueueSnackbar(
                            ` ${selectedOrder?.name} - ${
                              selectedOrder?.id || selectedOrder?.orderId
                            } Started`,
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
                    Start Delivery
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
