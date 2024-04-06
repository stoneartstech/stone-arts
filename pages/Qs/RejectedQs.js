import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function RejectedQs() {
  const router = useRouter();

  const [Measurements, setMeasurements] = useState([]);
  const [originalMeasurements, setOriginalMeasurements] = useState([]);

  const params = useSearchParams();
  var dbName = params.get("param");
  if (dbName.endsWith("pending-measurements")) {
    //remove pending-Measurements from dbName
    dbName = dbName.slice(0, -21);
  }

  useEffect(() => {
    const MeasurementsRef = collection(db, dbName);
    const MeasurementsSnapshot = onSnapshot(MeasurementsRef, (snapshot) => {
      const MeasurementsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      MeasurementsList.forEach((qs) => (qs.infoChecked = false));
      setMeasurements(MeasurementsList);
      setOriginalMeasurements(MeasurementsList);
    });
  }, []);

  const [search, setSearch] = useState("");
  const handleSearch = () => {
    //name or id
    setMeasurements(
      originalMeasurements.filter((qs) => {
        var searchParam = search.toLowerCase();
        return (
          qs.name.toLowerCase().includes(searchParam) ||
          qs.id.toString().includes(searchParam)
        );
      })
    );
  };

  return (
    <div>
      <div className="w-full px-8 flex flex-row justify-between">
        <button
          className="bg-slate-300 p-2 rounded-lg"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-12 my-4">
        <p className="my-4 text-3xl text-center">Rejected Quotes</p>
      </div>
      <div className="flex flex-col gap-4 my-4 ">
        <div className="mx-auto">
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="mx-auto border-2 border-black p-2"
          />
          <buttonq
            className="bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2"
            onClick={handleSearch}
          >
            Search
          </buttonq>
          <div className="bg-slate-300">
            {search &&
              originalMeasurements
                .filter((qs) => {
                  var searchParam = search.toLowerCase();
                  return (
                    qs.name.toLowerCase().includes(searchParam) ||
                    qs.id.toString().includes(searchParam)
                  );
                })
                .slice(0, 10)
                .map((qs) => (
                  <p
                    key={qs.id}
                    onClick={() => {
                      setSearch(qs.name);
                      handleSearch();
                    }}
                    className="p-2 text-black cursor-pointer"
                  >
                    {qs.id} : {qs.name}
                  </p>
                ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-8 items-center">
        {Measurements.map((qs) => (
          <div
            key={qs["id"]}
            className=" w-[70%] grid grid-cols-3 items-center"
          >
            <p className=" text-center">
              {qs["name"]} - {qs["id"]} :
            </p>
            <Link
              href={{
                pathname: "/ViewQuoteDetails",
                query: {
                  id: qs["id"],
                  dbName: dbName,
                  description: qs["description"],
                  clientId: qs["clientId"],
                  clientFirstName: qs["name"],
                  clientLastName: qs["lastName"],
                  clientPhoneNumber: qs["number"],
                  clientEmail: qs["email"],
                  clientAddress: qs["address"],
                  salesPerson: qs["salesPerson"],
                  sourceInfo: qs["sourceInfo"],
                  specificInfo: qs["specificInfo"],
                  status: qs["status"],
                  option: qs["option"],
                  date: qs["date"],
                  aspects: qs["aspects"],
                  address: qs["address"],
                  measurementDataContactPerson:
                    qs["measurementData"].contactPerson,
                  measurementDataCost: qs["measurementData"].cost,
                  measurementDataDate: qs["measurementData"].date,
                  measurementDataSupplyFix: qs["measurementData"].supplyFix,
                  measurementDataTime: qs["measurementData"].time,
                  // downloadURL: qs["downloadURL"],
                },
              }}
              target="_blank"
            >
              <button className="bg-green-400 p-2 rounded-lg text-center">
                Check Info
              </button>
            </Link>
            <Link
              href={qs.downloadURL}
              className="bg-gray-400 w-fit px-7 p-2 rounded-md mr-3 text-center"
              target="_blank"
            >
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
