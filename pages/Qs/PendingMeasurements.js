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

export default function PendingMeasurements() {
  const router = useRouter();

  const [Measurements, setMeasurements] = useState([]);
  const [originalMeasurements, setOriginalMeasurements] = useState([]);

  const params = useSearchParams();
  var dbName = params.get("param");

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
      const storageRef = ref(storage, `measurements/${qsId}`);
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
      doc(db, dbName.slice(0, 3) + "-pending-site-quotes", qsId),
      qsData
    );
    await deleteDoc(doc(db, dbName, qsId));
    alert(`Project ${qsId} sent to pending-site-quotes`);
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
        <p className="my-4 text-3xl text-center">Pending Measurements</p>
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
            className=" w-[70%] grid grid-cols-4 items-center"
          >
            <p className=" text-center">
              {qs["name"]} - {qs["id"]} :
            </p>
            <Link
              href={{
                pathname: "/RequestDetails",
                query: {
                  title: qs["title"],
                  id: qs["id"],
                  name: qs["name"],
                  description: qs["description"],
                  clientFirstName: qs["clientFirstName"],
                  clientLastName: qs["clientLastName"],
                  clientPhoneNumber: qs["clientPhoneNumber"],
                  clientEmail: qs["clientEmail"],
                  clientAddress: qs["clientAddress"],
                  downloadURL: qs["downloadURL"],
                },
              }}
              target="_blank"
            >
              <button
                onClick={() => handleCheckInfo(qs.id)}
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
              className={`p-2 rounded-lg text-sm text-center capitalize ${
                qs.infoChecked && downloadURLs[qs.id]
                  ? "bg-green-400"
                  : "bg-red-300"
              }`}
              disabled={!qs.infoChecked && !downloadURLs[qs.id]}
              onClick={() => handleSendAdmin(qs.id)}
            >
              Send to pending-site-quotes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
