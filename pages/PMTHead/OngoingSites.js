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
import Image from "next/image";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function OngoingSites() {
  const [isQsSelected, setIsQsSelected] = useState(false);
  const [loading, setLoading] = useState(true);
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

    // for (let qs = 1; qs <= maxQs; qs++) {
    const requestsRef = collection(db, `PMT-sites-in-progress`);
    const snapshot = await getDocs(requestsRef);
    const requestsList = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    promises.push(requestsList);
    // }

    const results = await Promise.all(promises);
    const combinedArray = results.flat(); // Merge all arrays into a single array
    setRequests(combinedArray);
    return combinedArray;
  }

  useEffect(() => {
    fetchCompletedQuotes()
      .then((combinedArray) => {
        setLoading(false);
        console.log(combinedArray);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [isQsSelected, qs]);

  return (
    <>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
      <div>
        <div className="w-full px-8 flex flex-row justify-between">
          <button
            className="bg-slate-300 p-2 rounded-lg"
            onClick={() => {
              if (actionsTab) {
                return setActionsTab(false);
              } else if (isQsSelected) {
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
              : "Sites In Progress"}
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
                <div className=" mt-4 grid grid-cols-2 flex-col gap-3 ">
                  <Link
                    href={`/PMTHead/actions/CheckImages?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}&type=view`}
                  >
                    <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                      Check Images
                    </button>
                  </Link>
                  <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                    Check Progress
                  </button>
                  <Link href={selectedClient?.quotePdf} target="_blank">
                    <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                      Check Quote
                    </button>
                  </Link>
                  <Link
                    href={`/PMTHead/actions/MaterialPlanUpload?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}&type=view`}
                  >
                    <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                      Check Material Plan
                    </button>
                  </Link>
                  <Link
                    href={`/PMTHead/actions/SitePlanUpload?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}&type=view`}
                  >
                    <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                      Check Site Plan
                    </button>
                  </Link>
                  <Link
                    href={`/PMTHead/actions/JobCards?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}&type=view`}
                  >
                    <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                      Check Job Card
                    </button>
                  </Link>
                  <div className=" flex  flex-col col-span-2 w-full mt-4">
                    <p className=" text-center text-sm mb-0.5">
                      (Site Supervisor)
                    </p>
                    <p className=" bg-white capitalize text-center w-full text-xs md:text-base font-semibold py-1.5 md:py-2.5 px-4 border-black border ">
                      {selectedClient?.supervisor}
                    </p>
                  </div>
                  <div className=" flex  flex-col col-span-2">
                    <button
                      onClick={() => {
                        const okay = confirm(
                          `Mark ${selectedClient?.name} - ${selectedClient?.clientId} as Completed`
                        );
                        try {
                          if (okay) {
                            enqueueSnackbar(
                              ` ${selectedClient?.name} - ${selectedClient?.clientId} Completed`,
                              {
                                variant: "success",
                              }
                            );
                          }
                        } catch (error) {
                          enqueueSnackbar("Some error occured", {
                            variant: "error",
                          });
                          console.error(error);
                        }
                      }}
                      className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-3 px-4 border-black border  w-full"
                    >
                      Complete Project
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
