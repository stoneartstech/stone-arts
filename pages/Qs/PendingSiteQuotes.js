import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, storage } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function PendingSiteQuotes() {
  const router = useRouter();

  const [Measurements, setMeasurements] = useState([]);
  const [originalMeasurements, setOriginalMeasurements] = useState([]);

  const params = useSearchParams();
  var dbName = params.get("param");

  useEffect(() => {
    console.log(dbName);
    const MeasurementsRef = collection(db, dbName);
    const MeasurementsSnapshot = onSnapshot(MeasurementsRef, (snapshot) => {
      const MeasurementsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      MeasurementsList.forEach((qs) => (qs.infoChecked = false));
      MeasurementsList.forEach((qs) => (qs.infoChecked = false));
      console.log(MeasurementsList);
      setMeasurements(MeasurementsList);
      setOriginalMeasurements(MeasurementsList);
    });
  }, []);

  const handleCheckInfo = (qsId) => {
    const updatedMeasurements = Measurements.map((qs) => {
      if (qs.id === qsId) {
        return { ...qs, infoChecked: true };
      }
      return qs;
    });
    setMeasurements(updatedMeasurements);
  };

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
  const [downloadURLs, setDownloadURLs] = useState({});
  const handleUploadMeasurement = async (qsId, event) => {
    const file = event.target.files[0];
    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(storage, `quotes/${qsId}`);
      await uploadBytes(storageRef, file);

      // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      setDownloadURLs((prevDownloadURLs) => ({
        ...prevDownloadURLs,
        [qsId]: downloadURL,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  async function handleSendAdmin(qsId) {
    console.log(downloadURLs);
    if (!downloadURLs[qsId]) {
      alert(`Please try again`);
      return;
    }
    const qsData = Measurements.find((qs) => qs.id === qsId);
    qsData.downloadURL = downloadURLs[qsId];
    await setDoc(
      doc(db, dbName.slice(0, 3) + "-pending-admin-quotes", qsId),
      qsData
    );
    await deleteDoc(doc(db, dbName, qsId));
    alert(`Project ${qsId} sent to Admin`);
  }

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
        <p className="my-4 text-3xl text-center">Pending Site Quotes</p>
      </div>
      <div className="flex flex-col gap-4 my-4 ">
        <div className="mx-auto">
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="mx-auto border-2 border-black p-2"
          />
          <button
            className="bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2"
            onClick={handleSearch}
          >
            Search
          </button>
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
            className=" w-[70%] grid grid-cols-4 items-center"
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
              <button
                onClick={() => handleCheckInfo(qs.id)} // Attach onClick event here
                className="bg-green-400 p-2 rounded-lg text-center"
              >
                Check Info
              </button>
            </Link>
            <input
              className=""
              disabled={!qs.infoChecked}
              id="measuremnt-image"
              name="measuremnt-image"
              type="file"
              onChange={(e) => handleUploadMeasurement(qs.id, e)}
            />
            <button
              className={`p-2 rounded-lg text-sm text-center ${
                qs.infoChecked && downloadURLs[qs.id]
                  ? "bg-green-400"
                  : "bg-red-300"
              }`}
              disabled={!qs.infoChecked}
              onClick={() => handleSendAdmin(qs.id)}
            >
              Send to Admin
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
