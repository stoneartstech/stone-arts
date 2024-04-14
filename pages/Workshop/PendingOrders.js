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
  const [filter, setFilter] = useState(0);
  const [pendingSiteOrders, setPendingSiteOrders] = useState([]);
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
    try {
      const report = pendingSiteOrders.filter((i) => {
        return i?.clientId === clientId;
      });
      // console.log(report);
      await setDoc(doc(db, `workshop-site-completed/${clientId}`), report[0]);
      await deleteDoc(doc(db, `workshop-site-pending/${clientId}`));
      alert("Uploaded");
    } catch (error) {
      console.log(error);
      alert("Try again Later !! ");
    }
  };
  const handleRetailOrders = async (clientId) => {
    try {
      const report = pendingRetailOrders.filter((i) => {
        return i?.clientId === clientId;
      });
      // console.log(report);
      await setDoc(doc(db, `workshop-retail-completed/${clientId}`), report[0]);
      await deleteDoc(doc(db, `workshop-retail-pending/${clientId}`));
      alert("Uploaded");
    } catch (error) {
      console.log(error);
      alert("Try again Later !! ");
    }
  };

  return (
    <div>
      <div className="w-full relative md:px-8 flex flex-col md:flex-row justify-between">
        <button
          className="bg-slate-300 p-2 md:absolute left-10 rounded-lg w-fit"
          onClick={() => router.back()}
        >
          Go Back
        </button>
        <p className="text-xl md:text-2xl  text-center w-full font-bold mb-2">
          Workshop Home Page
        </p>
        <div></div>
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
      <div className="flex flex-col mt-7">
        <p className=" text-lg md:text-2xl mx-auto font-semibold underline mb-2">
          Pending Site Orders
        </p>
        <div className="flex flex-col items-center">
          {pendingSiteOrders?.filter((i) => {
            if (filter === 0) {
              return i;
            } else if (filter === 1) {
              return i.standard === true;
            } else {
              return i.standard !== true;
            }
          }).length === 0 && <p className=" mt-3">No Orders Found !!</p>}{" "}
          {pendingSiteOrders
            ?.filter((i) => {
              if (filter === 0) {
                return i;
              } else if (filter === 1) {
                return i.standard === true;
              } else {
                return i.standard !== true;
              }
            })
            ?.map((order, index) => {
              return (
                <div
                  key={index}
                  className=" mt-4 md:w-[70%] grid grid-cols-3 md:grid-cols-5"
                >
                  <div className=" py-1.5 md:py-0  col-span-3 md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                    {order?.name} - {order?.clientId}
                  </div>
                  <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border md:border-l-0">
                    Check Orders
                  </button>
                  <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0">
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
                </div>
              );
            })}
        </div>
      </div>
      <div className="flex flex-col mt-7">
        <p className="text-2xl mx-auto font-semibold underline mb-2">
          Pending Retail Orders
        </p>
        <div className="flex flex-col items-center">
          {pendingRetailOrders?.filter((i) => {
            if (filter === 0) {
              return i;
            } else if (filter === 1) {
              return i.standard === true;
            } else {
              return i.standard !== true;
            }
          }).length === 0 && <p className=" mt-3">No Orders Found !!</p>}{" "}
          {pendingRetailOrders
            ?.filter((i) => {
              if (filter === 0) {
                return i;
              } else if (filter === 1) {
                return i.standard === true;
              } else {
                return i.standard !== true;
              }
            })
            ?.map((order, index) => {
              return (
                <div
                  key={index}
                  className=" mt-4 md:w-[70%] grid grid-cols-3 md:grid-cols-5"
                >
                  <div className=" py-1.5 md:py-0  col-span-3 md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                    {order?.name} - {order?.clientId}
                  </div>
                  <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border md:border-l-0">
                    Check Orders
                  </button>
                  <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0">
                    Check Quote
                  </button>
                  <button
                    onClick={() => {
                      handleRetailOrders(order.clientId);
                    }}
                    className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0"
                  >
                    Complete Order
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
