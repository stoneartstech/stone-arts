import { db } from "@/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import React, { useEffect, useState } from "react";
import VehicleCost from "./VehicleCost";
import VehicleReport from "./VehicleReport";

const LogIDashboard = () => {
  const [vehiclesList, setVehiclesList] = useState([]);
  const [activeTab, setActiveTab] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewCost, setViewCost] = useState(false);
  const [viewReport, setViewReport] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(false);

  const fetchData = async () => {
    try {
      const vehicleSnapshot = await getDocs(collection(db, "Vehicles"));
      const vehiclesList = vehicleSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehiclesList(vehiclesList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const router = useRouter();
  return (
    <>
      {viewCost ? (
        <VehicleCost vehicle={selectedVehicle} handleBack={setViewCost} />
      ) : viewReport ? (
        <VehicleReport vehicle={selectedVehicle} handleBack={setViewReport} />
      ) : (
        <div>
          <SnackbarProvider
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          />
          <div className=" flex flex-col md:flex-row md:items-center justify-center relative">
            <button
              className="bg-slate-300 p-2 rounded-lg w-fit md:absolute left-0 top-0"
              onClick={() => {
                if (viewCost) {
                  setViewCost(false);
                } else {
                  router.back();
                }
              }}
            >
              Go Back
            </button>
            <p className=" page-heading">Vehicles Dashboard</p>
            <Link
              href="/Logistics/AddVehicle"
              className="bg-green-500 font-medium text-[14.5px] p-2 rounded-lg text-center md:absolute right-0 top-0"
            >
              Add Vehicles
            </Link>
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
                            onClick={() => {
                              if (activeTab?.name === order?.name) {
                                setActiveTab(false);
                              } else {
                                setActiveTab(order);
                              }
                            }}
                            className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 px-4 border-black border md:border-l-0"
                          >
                            Check Information
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVehicle(order);
                              setViewCost(true);
                            }}
                            className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 px-4 border-black border border-l-0"
                          >
                            Upload Cost
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVehicle(order);
                              setViewReport(true);
                            }}
                            className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 px-4 border-black border border-l-0"
                          >
                            Upload Report
                          </button>
                        </div>
                        {activeTab && activeTab?.name === order?.name && (
                          <div className=" flex flex-col p-2 ">
                            <p>Name : {activeTab?.name}</p>
                            <p>
                              Assigned Driver :{" "}
                              {activeTab?.driver
                                ? activeTab?.driver
                                : "Not Assigned"}
                            </p>
                            <p>Description : {activeTab?.description}</p>
                            <div className=" flex flex-col ">
                              <div>
                                <p className=" font-semibold underline">
                                  Assigned Deliveries:
                                </p>
                                {activeTab?.ordersAssigned?.length > 0 ? (
                                  <>
                                    {activeTab?.ordersAssigned?.map(
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
                            </div>
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
    </>
  );
};

export default LogIDashboard;
