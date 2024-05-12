// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import {
//   collection,
//   deleteDoc,
//   doc,
//   onSnapshot,
//   setDoc,
// } from "firebase/firestore";
// import { db } from "@/firebase";

// const filterList = [
//   {
//     id: 0,
//     name: "All",
//   },
//   {
//     id: 1,
//     name: "Standard",
//   },
//   {
//     id: 2,
//     name: "Non-Standard",
//   },
// ];
// export default function PendingSites() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState(0);
//   const [pendingSiteOrders, setPendingSiteOrders] = useState([]);
//   const [pendingRetailOrders, setPendingRetailOrders] = useState([]);

//   useEffect(() => {
//     const fetch = onSnapshot(
//       collection(db, "workshop-site-pending"),
//       (snapshot) => {
//         var reports = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setPendingSiteOrders(reports);
//       }
//     );
//     const fetch2 = onSnapshot(
//       collection(db, "workshop-retail-pending"),
//       (snapshot) => {
//         var reports = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setPendingRetailOrders(reports);
//       }
//     );

//     setLoading(false);
//     return fetch, fetch2;
//   }, []);

//   const handleSiteOrders = async (clientId) => {
//     try {
//       const report = pendingSiteOrders.filter((i) => {
//         return i?.clientId === clientId;
//       });
//       // console.log(report);
//       await setDoc(doc(db, `workshop-site-completed/${clientId}`), report[0]);
//       await deleteDoc(doc(db, `workshop-site-pending/${clientId}`));
//       alert("Uploaded");
//     } catch (error) {
//       console.log(error);
//       alert("Try again Later !! ");
//     }
//   };
//   const handleRetailOrders = async (clientId) => {
//     try {
//       const report = pendingRetailOrders.filter((i) => {
//         return i?.clientId === clientId;
//       });
//       // console.log(report);
//       await setDoc(doc(db, `workshop-retail-completed/${clientId}`), report[0]);
//       await deleteDoc(doc(db, `workshop-retail-pending/${clientId}`));
//       alert("Uploaded");
//     } catch (error) {
//       console.log(error);
//       alert("Try again Later !! ");
//     }
//   };

//   return (
//     <div>
//       <div className="w-full relative md:px-8 flex flex-col md:flex-row justify-between">
//         <button
//           className="bg-slate-300 p-2 md:absolute left-10 rounded-lg w-fit"
//           onClick={() => router.back()}
//         >
//           Go Back
//         </button>
//         <p className="text-xl md:text-2xl  text-center w-full font-bold mb-2">
//           Sites Not Assigned Yet
//         </p>
//         <div></div>
//       </div>

//       <div className="flex flex-col mt-7">
//         <div className="flex flex-col items-center">
//           {pendingRetailOrders?.filter((i) => {
//             if (filter === 0) {
//               return i;
//             } else if (filter === 1) {
//               return i.standard === true;
//             } else {
//               return i.standard !== true;
//             }
//           }).length === 0 && <p className=" mt-3">No Orders Found !!</p>}{" "}
//           {pendingRetailOrders
//             ?.filter((i) => {
//               if (filter === 0) {
//                 return i;
//               } else if (filter === 1) {
//                 return i.standard === true;
//               } else {
//                 return i.standard !== true;
//               }
//             })
//             ?.map((order, index) => {
//               return (
//                 <div
//                   key={index}
//                   className=" mt-4 md:w-[65%] grid grid-cols-7 md:grid-cols-7"
//                 >
//                   <div className=" py-1.5 md:py-0  text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
//                     {order?.name} - {order?.clientId}
//                   </div>
//                   <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-l-0">
//                     Check Quote
//                   </button>
//                   <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border md:border-l-0">
//                     Upload Master Plan
//                   </button>
//                   <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border md:border-l-0">
//                     Upload Site Plan
//                   </button>
//                   <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border md:border-l-0">
//                     Assign People
//                   </button>
//                   <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border md:border-l-0">
//                     Create Job Card
//                   </button>
//                   <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border md:border-l-0">
//                     Start Project
//                   </button>
//                 </div>
//               );
//             })}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PendingSites() {
  const [isQsSelected, setIsQsSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionsTab, setActionsTab] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [originalRequests, setOriginalRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [qs, setQs] = useState(1);
  const router = useRouter();

  async function fetchCompletedQuotes() {
    const qsRef = doc(db, "qs-count", "qs-count");
    const maxQsCount = await getDoc(qsRef);
    const maxQs = maxQsCount.data()["qs-count"]
      ? maxQsCount.data()["qs-count"]
      : 1;

    const promises = [];

    for (let qs = 1; qs <= maxQs; qs++) {
      const requestsRef = collection(db, `qs${qs}-completed-quotes`);
      const snapshot = await getDocs(requestsRef);
      const requestsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        qsName: `qs${qs}`,
      }));
      promises.push(requestsList);
    }

    const results = await Promise.all(promises);
    const combinedArray = results.flat(); // Merge all arrays into a single array
    setRequests(combinedArray);
    return combinedArray;
  }

  useEffect(() => {
    fetchCompletedQuotes()
      .then((combinedArray) => {
        console.log(combinedArray);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [isQsSelected, qs]);

  const handleSearch = () => {
    //name or id
    setRequests(
      originalRequests.filter((request) => {
        var searchParam = search.toLowerCase();
        return (
          request.name.toLowerCase().includes(searchParam) ||
          request.id.toString().includes(searchParam)
        );
      })
    );
  };
  const [search, setSearch] = useState("");

  async function handleAdminAprove(qsId) {
    // alert("qs" + qs + "-pending-client-quotes");
  }
  async function handleAdminReject(qsId) {}

  return (
    <>
      {!loading && (
        <div>
          <div className="w-full px-8 flex flex-row justify-between">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => {
                if (isQsSelected) {
                  return setIsQsSelected(false);
                } else {
                  router.back();
                }
              }}
            >
              Go Back
            </button>
          </div>
          <div className="flex flex-col mt-4">
            <p className="text-2xl mx-auto capitalize font-bold">
              {selectedClient !== ""
                ? `${selectedClient?.name} - ${selectedClient?.clientId} Actions`
                : "Sites Not Assigned Yet"}
            </p>
          </div>
          {!actionsTab ? (
            <div className=" flex flex-col items-center justify-center ">
              {requests?.length === 0 && (
                <p className=" mt-3">No Results Found !!</p>
              )}{" "}
              {requests?.map((order, index) => {
                return (
                  <div
                    key={index}
                    className=" mt-4 md:w-[40%] grid grid-cols-3"
                  >
                    <div className=" py-1.5 md:py-0  col-span-3 md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                      {order?.name} - {order?.clientId}
                    </div>
                    <button
                      onClick={() => {
                        setActionsTab(true);
                        setSelectedClient(order);
                      }}
                      className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border md:border-l-0"
                    >
                      Actions
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className=" flex flex-col items-center justify-center ">
              <div className=" mt-4 flex flex-col gap-3 ">
                <Link href={selectedClient?.quotePdf} target="_blank">
                  <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                    Check Quote
                  </button>
                </Link>
                <Link
                  href={`/PMTHead/actions/MaterialPlanUpload?qsName=${selectedClient?.qsName}&clientName=${selectedClient?.name}+${selectedClient?.lastname}`}
                >
                  <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                    Upload Material Plan
                  </button>
                </Link>
                <Link
                  href={`/PMTHead/actions/SitePlanUpload?qsName=${selectedClient?.qsName}&clientName=${selectedClient?.name}+${selectedClient?.lastname}`}
                >
                  <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                    Upload Site Plan
                  </button>
                </Link>
                <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                  Assign People
                </button>
                <Link
                  href={`/PMTHead/actions/JobCards?qsName=${selectedClient?.qsName}&clientName=${selectedClient?.name}+${selectedClient?.lastname}`}
                >
                  <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                    Create Job Card
                  </button>
                </Link>
                <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                  Start Project
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
