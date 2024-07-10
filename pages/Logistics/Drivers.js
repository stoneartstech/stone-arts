import { db } from "@/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import React, { useEffect, useState } from "react";

const LogIDashboard = () => {
  const [driversList, setDriversList] = useState([]);
  const [activeTab2, setActiveTab2] = useState(false);
  const [loading, setLoading] = useState(true);

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
  const router = useRouter();

  return (
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
          onClick={() => router.back()}
        >
          Go Back
        </button>
        <p className=" text-center text-lg md:text-2xl font-medium my-3 md:my-0">
          Drivers Daashboard
        </p>
        <Link
          href="/Logistics/AddDriver"
          className="bg-green-500 font-medium text-[14.5px] p-2 rounded-lg text-center md:absolute right-0 top-0"
        >
          Add Drivers
        </Link>
      </div>
      <div className="  p-1 md:p-5 mt-3 rounded-lg ">
        <div className=" flex flex-col px-3 relative ">
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
              {driversList?.length === 0 && (
                <p className=" mt-2">No Drivers Found !!</p>
              )}{" "}
              {driversList?.map((order, index) => {
                return (
                  <div key={index}>
                    <div className=" mt-2.5 md:w-[90%] grid grid-cols-3 md:grid-cols-5">
                      <div className=" py-1.5 md:py-0  col-span-3 md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                        {order?.name}
                      </div>
                      <button
                        onClick={() => {
                          if (activeTab2?.name === order?.name) {
                            setActiveTab2(false);
                          } else {
                            setActiveTab2(order);
                          }
                        }}
                        className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 px-4 border-black border md:border-l-0"
                      >
                        Check Information
                      </button>
                      <button
                        onClick={() => {}}
                        className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 px-4 border-black border border-l-0"
                      >
                        Check Past Deliveries
                      </button>
                      <button
                        onClick={() => {
                          // handleSiteOrders(order.clientId);
                        }}
                        className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 px-4 border-black border border-l-0"
                      >
                        Upload Report
                      </button>
                    </div>
                    {activeTab2 && activeTab2?.name === order?.name && (
                      <div className=" flex flex-col p-2 ">
                        <p>Name: {activeTab2?.name}</p>
                        <p>Description: {activeTab2?.description}</p>
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
  );
};

export default LogIDashboard;
