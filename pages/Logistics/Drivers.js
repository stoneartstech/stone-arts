import { db } from "@/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import React, { useEffect, useState } from "react";

const LogIDashboard = () => {
  const [driversList, setDriversList] = useState([]);
  const [activeTab2, setActiveTab2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [viewLocation, setViewLocation] = useState(false);
  const [location, setLocation] = useState(false);
  const [mapSrc, setMapSrc] = useState(false);

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

  const fetchLocation = async (order) => {
    if (viewLocation) {
      setViewLocation(false);
    } else {
      setLocationLoading(true);
      setViewLocation(true);
      const result = await getDoc(doc(db, `Location/${order?.name}`));
      const data = result?.data();
      setLocation(data?.data[0]);
      const tempMapSrc = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13237.430834774336!2d${data?.data[0]?.location?.longitude}!3d${data?.data[0]?.location?.latitude}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2sin!4v1624021545745!5m2!1sen!2sin`;
      setMapSrc(tempMapSrc);
      setLocationLoading(false);
    }
  };
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
          Drivers Dashboard
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
                    <div className=" mt-2.5 md:w-[90%] grid grid-cols-4 md:grid-cols-6">
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
                      <button
                        onClick={() => {
                          if (activeTab2?.name === order?.name) {
                            setActiveTab2(false);
                          } else {
                            setActiveTab2(order);
                          }
                          fetchLocation(order);
                        }}
                        className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 px-4 border-black border border-l-0"
                      >
                        View Location
                      </button>
                    </div>
                    {activeTab2 &&
                      activeTab2?.name === order?.name &&
                      viewLocation && (
                        <>
                          {locationLoading ? (
                            <div className=" w-full flex items-center justify-center">
                              <Image
                                width={50}
                                height={50}
                                src="/loading.svg"
                                alt="Loading ..."
                              />
                            </div>
                          ) : (
                            <iframe
                              // src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7424.569250233742!2d83.90222299045429!3d21.49656863719359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a213da4ec28af2d%3A0xb33a5cc9af8c33c7!2sVeer%20Surendra%20Sai%20University%20of%20Technology!5e0!3m2!1sen!2sin!4v1723975537291!5m2!1sen!2sin`}
                              src={mapSrc}
                              height="350"
                              className=" w-[90%]"
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                          )}
                        </>
                      )}
                    {activeTab2 &&
                      activeTab2?.name === order?.name &&
                      !viewLocation && (
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
