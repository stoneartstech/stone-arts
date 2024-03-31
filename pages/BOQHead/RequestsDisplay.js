import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
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
    { name: "Pending Approval from Admin", param: "pending-admin-approval" },
    { name: "Pending Approval from Client", param: "pending-client-approval" },
    { name: "Rejected Quotes", param: "rejected-quotes" },
  ];
  const page = BOQPages.find((page) => page.param === param);

  const [loading, setLoading] = useState(false);
  const [originalRequests, setOriginalRequests] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const requestsRef = collection(db, page.param);
    const requestsSnapshot = onSnapshot(requestsRef, (snapshot) => {
      const requestsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setOriginalRequests(requestsList);
      setRequests(requestsList);
    });
  }, []);

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

  return (
    <>
      {!loading && (
        <div>
          <div className="w-full px-8 flex flex-row justify-between">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
          <div className="flex flex-col mt-4">
            <p className="text-2xl mx-auto font-bold">{page.name}</p>
          </div>

          <div className="flex flex-col gap-4 mt-8 items-center">
            {requests.map((request) => (
              <Link
                key={request["id"]}
                href={{
                  pathname: "/RequestDetails",
                  query: {
                    id: request["id"],
                    name: request["name"],
                    description: request["description"],
                    clientFirstName: design["clientFirstName"],
                    clientLastName: design["clientLastName"],
                    clientPhoneNumber: design["clientPhoneNumber"],
                    clientEmail: design["clientEmail"],
                    clientAddress: design["clientAddress"],
                    downloadURL: design["downloadURL"],
                    notes: design["notes"],
                    imageUrl: design["imageUrl"],
                  },
                }}
                className="bg-slate-300 p-2 rounded-lg text-center sm:w-1/3"
              >
                {request["name"] + " -> " + request["id"]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
