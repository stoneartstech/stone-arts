import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RequestsDisplay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const param = searchParams.get("param");

  const BOQPages = [
    { name: "Measurement Requests from clients", param: "boq" },
    { name: "Pending Measurements", param: "pending-measurements" },
    { name: "Pending Site Quotes", param: "pending-site-quotes" },
    {
      name: "Pending Showroom design/quote requests",
      param: "pending-showroom-quotes",
    },
    {
      name: "Pending Approval from Admin",
      param: "pending-admin-quotes",
    },
    {
      name: "Pending Approval from Client",
      param: "pending-client-quotes",
    },
    { name: "Completed Quotes", param: "completed-quotes" },
    { name: "Rejected Quotes", param: "rejected-quotes" },
  ];
  const page = BOQPages.find((page) => page.param === param);

  const [isQsSelected, setIsQsSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalRequests, setOriginalRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [qs, setQs] = useState(1);

  useEffect(() => {
    const requestsRef = collection(db, "qs" + qs + "-" + page.param);
    const requestsSnapshot = onSnapshot(requestsRef, (snapshot) => {
      const requestsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setOriginalRequests(requestsList);
      setRequests(requestsList);
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
    const qsData = originalRequests.find((qs) => qs.id === qsId);
    await setDoc(doc(db, "qs" + qs + "-pending-client-quotes", qsId), qsData);
    await deleteDoc(doc(db, "qs" + qs + "-" + page.param, qsId));
    alert(`Project ${qsId} Approved `);
    // alert("qs" + qs + "-pending-client-quotes");
  }
  async function handleAdminReject(qsId) {
    const qsData = originalRequests.find((qs) => qs.id === qsId);
    await setDoc(doc(db, "qs" + qs + "-rejected-quotes", qsId), qsData);
    await deleteDoc(doc(db, "qs" + qs + "-" + page.param, qsId));
    alert(`Rejected Project ${qsId}  `);
  }

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
            <p className="text-2xl mx-auto font-bold">{page.name}</p>
          </div>

          <div className="flex flex-col gap-4 mt-8 items-center">
            {!isQsSelected ? (
              <div className=" flex flex-col gap-3">
                {[1, 2, 3].map((e, index) => {
                  return (
                    <p
                      key={index}
                      onClick={() => {
                        setQs(e);
                        setIsQsSelected(true);
                      }}
                      className="bg-slate-300 p-2 rounded-lg text-center min-w-[150px] cursor-pointer "
                    >
                      Qs {e}
                    </p>
                  );
                })}
              </div>
            ) : (
              <>
                {requests.length === 0 && (
                  <p>
                    No {param} for Qs - {qs}
                  </p>
                )}
                {requests.map((request) => (
                  <div
                    key={request["id"]}
                    className={` w-[30%] grid ${
                      param === "pending-admin-quotes"
                        ? "grid-cols-4"
                        : "grid-cols-2"
                    } gap-6 items-center`}
                  >
                    {param === "pending-measurements" ? (
                      <>
                        <Link
                          href={{
                            pathname: "/RequestDetails",
                            query: {
                              title: request["title"],
                              id: request["id"],
                              name: request["name"],
                              description: request["description"],
                              clientFirstName: request["clientFirstName"],
                              clientLastName: request["clientLastName"],
                              clientPhoneNumber: request["clientPhoneNumber"],
                              clientEmail: request["clientEmail"],
                              clientAddress: request["clientAddress"],
                              downloadURL: request["downloadURL"],
                              notes: request["notes"],
                              imageUrl: request["imageUrl"],
                            },
                          }}
                          className="bg-slate-300 p-2 rounded-lg text-center col-span-full sm:col-span-4 "
                        >
                          {request["name"] + " -> " + request["id"]}
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className=" text-center">
                          {request["name"]} - {request["id"]} :
                        </p>
                        <Link
                          href={request?.downloadURL}
                          className="bg-gray-400 p-2 w-fit px-5 rounded-md mr-3 text-center"
                          target="_blank"
                        >
                          View
                        </Link>
                      </>
                    )}
                    {param === "pending-admin-quotes" && (
                      <>
                        <button
                          className={` bg-gray-400 hover:bg-green-400 p-2 rounded-md cursor-pointer `}
                          onClick={() => handleAdminAprove(request.id)}
                        >
                          Approve
                        </button>
                        <button
                          className={` bg-gray-400 hover:bg-red-400 p-2 rounded-md cursor-pointer `}
                          onClick={() => handleAdminReject(request.id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
