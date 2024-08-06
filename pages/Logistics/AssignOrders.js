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
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function AssignOrders() {
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
  const [assignDriverTab, setAssignDriverTab] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(false);
  const [activeTab1, setActiveTab1] = useState(false);
  const [checkDeliveries, setCheckDeliveries] = useState(false);
  const [checkDeliveries1, setCheckDeliveries1] = useState(false);

  const [driver, setDriver] = useState("");

  const [driversList, setDriversList] = useState([]);

  const fetchData = async () => {
    try {
      const driverSnapshot = await getDocs(collection(db, "Drivers"));
      const driversList = driverSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDriversList(driversList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchVehicleData = () => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, "Vehicles"),
        (vehicleSnapshot) => {
          const vehiclesList = vehicleSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVehiclesList(vehiclesList);
          console.log(vehiclesList);
        }
      );

      // Return the unsubscribe function to stop listening to changes when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
    }
  };
  useEffect(() => {
    fetchVehicleData();
    const fetch = onSnapshot(collection(db, "logistics-assign"), (snapshot) => {
      var reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(reports);
      setLoading(false);
    });
    return fetch;
  }, []);

  const handleAssignOrder = async (vehicle) => {
    const isOKay = confirm(`Confirm Assigning Vehicle `);
    if (isOKay) {
      try {
        // adding new order to orderAssigned Array------------------------------
        const tempArr = vehicle?.ordersAssigned ? vehicle?.ordersAssigned : [];
        tempArr.push({ id: activeOrder?.id, name: activeOrder?.name });
        const tempData = {
          ...vehicle,
          isAssigned: true,
          ordersAssigned: tempArr,
        };
        const tempDriver = driversList.filter(
          (item) => item?.name === vehicle?.driver
        )[0];
        const tempDriverArr = tempDriver?.pendingOrder
          ? tempDriver?.pendingOrder
          : [];
        tempDriverArr.push({ id: activeOrder?.id, name: activeOrder?.name });
        const tempDriverData = {
          ...tempDriver,
          isAssigned: true,
          pendingOrders: tempDriverArr,
        };
        // adding new vehicle to assignedVehicle Array-------------------------
        const tempArr2 = activeOrder?.assignedVehicle
          ? activeOrder?.assignedVehicle
          : [];
        tempArr2.push({ ...tempData });
        await setDoc(doc(db, "logistics-pending", `${activeOrder?.id}`), {
          ...activeOrder,
          assignedVehicle: tempArr2,
        });
        await deleteDoc(doc(db, "logistics-assign", `${activeOrder?.id}`));
        // await deleteDoc(doc(db, "logistics-pending", `${activeOrder?.id}`));
        setActiveOrder({ ...activeOrder, assignedVehicle: tempArr2 });
        await setDoc(doc(db, "Vehicles", `${vehicle?.name}`), tempData);
        await setDoc(doc(db, "Drivers", `${tempDriver?.name}`), tempDriverData);
        enqueueSnackbar("Vehicle Assigned Successfully", {
          variant: "success",
        });
        setAssignDriverTab(false);
        router.back();
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Something Went Wrong", {
          variant: "error",
        });
      }
    }
  };

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
                    <>
                      <div className="flex flex-col items-center">
                        <p className=" font-semibold underline">
                          Assigned Vehicles
                        </p>
                        {activeOrder?.assignedVehicle?.length > 0 ? (
                          <>
                            {activeOrder?.assignedVehicle?.map(
                              (vehicle, index) => {
                                return (
                                  <div key={index}>
                                    <div className=" mt-2.5 grid grid-cols-3 md:grid-cols-4">
                                      <div className=" py-1.5 md:py-0  col-span-3 md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                                        {vehicle?.name}
                                      </div>
                                      <button
                                        onClick={() => {
                                          if (checkDeliveries) {
                                            if (
                                              activeTab?.name === vehicle?.name
                                            ) {
                                              setActiveTab(vehicle);
                                              setCheckDeliveries(false);
                                            } else {
                                              setActiveTab(vehicle);
                                              setCheckDeliveries(false);
                                            }
                                          } else {
                                            if (
                                              activeTab?.name === vehicle?.name
                                            ) {
                                              setActiveTab(false);
                                            } else {
                                              setActiveTab(vehicle);
                                            }
                                          }
                                        }}
                                        className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-3 px-4 border-black border "
                                      >
                                        Check Vehicle
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (checkDeliveries) {
                                            if (
                                              activeTab?.name === vehicle?.name
                                            ) {
                                              setActiveTab(false);
                                              setCheckDeliveries(false);
                                            } else {
                                              setActiveTab(vehicle);
                                              setCheckDeliveries(true);
                                            }
                                          } else {
                                            setActiveTab(vehicle);
                                            setCheckDeliveries(true);
                                          }
                                        }}
                                        className=" bg-[#94e63d] hover:bg-[#83cb37] col-span-2 md:col-span-1 text-xs md:text-sm font-semibold py-3 px-4 border-black border border-l-0"
                                      >
                                        Check Assigned Deliveries
                                      </button>
                                    </div>
                                    {activeTab &&
                                      activeTab?.name === vehicle?.name && (
                                        <div className=" flex flex-col p-2 ">
                                          {checkDeliveries ? (
                                            <div>
                                              <p className=" font-semibold underline">
                                                Assigned Deliveries:
                                              </p>
                                              {activeTab?.ordersAssigned?.map(
                                                (item, index) => {
                                                  return (
                                                    <p key={index}>
                                                      Name: Order-{item?.id}
                                                    </p>
                                                  );
                                                }
                                              )}
                                            </div>
                                          ) : (
                                            <>
                                              <p>Name: {activeTab?.name}</p>
                                              <p>
                                                Assigned Driver :{" "}
                                                {activeTab?.driver
                                                  ? activeTab?.driver
                                                  : "Not Assigned"}
                                              </p>
                                              <p>
                                                Description:{" "}
                                                {activeTab?.description}
                                              </p>
                                            </>
                                          )}
                                        </div>
                                      )}
                                  </div>
                                );
                              }
                            )}
                          </>
                        ) : (
                          <p>No Vehicles Assigned</p>
                        )}
                      </div>

                      <div className="flex flex-col items-center mt-4">
                        <p className=" font-semibold underline">
                          Assign New Vehicles
                        </p>
                        {vehiclesList?.length === 0 && (
                          <p className=" mt-2">No Vehicles Found !!</p>
                        )}{" "}
                        {vehiclesList?.map((vehicle, index) => {
                          return (
                            <div key={index}>
                              <div className=" mt-2.5 grid grid-cols-3 md:grid-cols-5">
                                <div className=" py-1.5 md:py-0  col-span-3 md:col-span-1 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                                  {vehicle?.name}
                                </div>
                                <button
                                  disabled={vehicle?.isAssigned}
                                  onClick={() => {
                                    setActiveTab1(vehicle);
                                    if (!vehicle?.driver) {
                                      enqueueSnackbar("Driver not Assigned", {
                                        variant: "warning",
                                      });
                                    } else {
                                      handleAssignOrder(vehicle);
                                    }
                                  }}
                                  className=" bg-[#94e63d] disabled:bg-gray-400 disabled:text-gray-600 hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-3 px-4 border-black border md:border-l-0"
                                >
                                  Assign Delivery
                                </button>
                                <button
                                  onClick={() => {
                                    if (checkDeliveries1) {
                                      if (activeTab1?.name === vehicle?.name) {
                                        setActiveTab1(vehicle);
                                        setCheckDeliveries1(false);
                                      } else {
                                        setActiveTab1(vehicle);
                                        setCheckDeliveries1(false);
                                      }
                                    } else {
                                      if (activeTab1?.name === vehicle?.name) {
                                        setActiveTab1(false);
                                      } else {
                                        setActiveTab1(vehicle);
                                      }
                                    }
                                  }}
                                  className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-3 px-4 border-black border border-l-0"
                                >
                                  Check Vehicle
                                </button>
                                <button
                                  disabled={vehicle?.isAssigned}
                                  onClick={() => {
                                    if (activeTab1?.name === vehicle?.name) {
                                      setActiveTab1(false);
                                      setAssignDriverTab(false);
                                    } else {
                                      setCheckDeliveries1(false);
                                      setActiveTab1(vehicle);
                                      setAssignDriverTab(true);
                                    }
                                  }}
                                  className={`${
                                    vehicle?.driver
                                      ? "bg-[#94e63d]"
                                      : " bg-red-400"
                                  } text-xs md:text-sm disabled:bg-gray-400 disabled:text-gray-600 font-semibold py-3 px-4 border-black border border-l-0`}
                                >
                                  {vehicle?.driver
                                    ? `Driver : ${vehicle?.driver}`
                                    : "Assign Driver"}
                                </button>
                                <button
                                  onClick={() => {
                                    if (checkDeliveries1) {
                                      if (activeTab1?.name === vehicle?.name) {
                                        setActiveTab1(false);
                                        setCheckDeliveries1(false);
                                      } else {
                                        setActiveTab1(vehicle);
                                        setCheckDeliveries1(true);
                                      }
                                    } else {
                                      setActiveTab1(vehicle);
                                      setCheckDeliveries1(true);
                                    }
                                  }}
                                  className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-3 px-4 border-black border border-l-0"
                                >
                                  Check Assigned Deliveries
                                </button>
                              </div>
                              {!assignDriverTab &&
                                activeTab1 &&
                                activeTab1?.name === vehicle?.name && (
                                  <div className=" flex flex-col p-2 ">
                                    {checkDeliveries1 ? (
                                      <div>
                                        <p className=" font-semibold underline">
                                          Assigned Deliveries:
                                        </p>
                                        {activeTab1?.ordersAssigned?.length >
                                        0 ? (
                                          <>
                                            {activeTab1?.ordersAssigned?.map(
                                              (item, index) => {
                                                return (
                                                  <p key={index}>
                                                    Name: Order-{item?.id}
                                                  </p>
                                                );
                                              }
                                            )}
                                          </>
                                        ) : (
                                          <p>No orders Assigned</p>
                                        )}
                                      </div>
                                    ) : (
                                      <>
                                        <p>Name: {activeTab1?.name}</p>
                                        <p>
                                          Assigned Driver :{" "}
                                          {activeTab?.driver
                                            ? activeTab?.driver
                                            : "Not Assigned"}
                                        </p>
                                        <p>
                                          Description: {activeTab1?.description}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                )}
                              {assignDriverTab &&
                                activeTab1 &&
                                activeTab1?.name === vehicle?.name && (
                                  <form
                                    onSubmit={async (e) => {
                                      e.preventDefault();
                                      try {
                                        const data = {
                                          date: activeTab1?.date,
                                          name: activeTab1?.name,
                                          driver,
                                          description: activeTab1?.description,
                                        };
                                        const driverData = {
                                          date: selectedDriver?.date,
                                          name: selectedDriver?.name,
                                          description:
                                            selectedDriver?.description,
                                          assignedVehicle: activeTab1?.name,
                                        };
                                        setDoc(
                                          doc(
                                            db,
                                            "Vehicles",
                                            `${activeTab1?.name}`
                                          ),
                                          data
                                        );
                                        setDoc(
                                          doc(
                                            db,
                                            "Drivers",
                                            `${selectedDriver?.name}`
                                          ),
                                          driverData
                                        );
                                        enqueueSnackbar(
                                          "Driver Added Successfully",
                                          {
                                            variant: "success",
                                          }
                                        );
                                        setDriver("");
                                      } catch (error) {
                                        console.error(error);
                                        enqueueSnackbar(
                                          "Something Went Wrong",
                                          {
                                            variant: "error",
                                          }
                                        );
                                      }
                                    }}
                                    className=" flex flex-col p-2 "
                                  >
                                    <p className="mt-2">Assign Driver</p>
                                    <select
                                      value={driver}
                                      onChange={(e) => {
                                        setDriver(e.target.value);
                                        let tempDriver = driversList.filter(
                                          (item) => item.name === e.target.value
                                        )[0];
                                        setSelectedDriver(tempDriver);
                                        // console.log(tempDriver);
                                      }}
                                      className=" p-2 w-full "
                                    >
                                      <option value="">Select a Driver</option>
                                      {driversList?.map((driver, index) => {
                                        return (
                                          <option
                                            key={index}
                                            value={driver?.name}
                                          >
                                            {driver?.name}
                                          </option>
                                        );
                                      })}
                                    </select>
                                    <button
                                      disabled={driver === ""}
                                      type="submit"
                                      className=" w-fit font-semibold text-sm bg-green-400 hover:bg-green-600 p-2 rounded-lg mt-4"
                                    >
                                      Assign Driver
                                    </button>
                                  </form>
                                )}
                            </div>
                          );
                        })}
                      </div>
                    </>
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
