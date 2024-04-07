import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, storage } from "../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Quote from "./Quote";

export default function PendingMeasurements() {
  const router = useRouter();

  const [Measurements, setMeasurements] = useState([]);
  const [originalMeasurements, setOriginalMeasurements] = useState([]);
  const [isQuote, setIsQuote] = useState(false);
  const [quoteData, setQuoteData] = useState({});
  const [quotePdfUrl, setQuotePdfUrl] = useState({ id: "", link: "" });

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
    if (!downloadURLs[qsId]) {
      alert(`Please try again`);
      return;
    }
    const qsData = Measurements.find((qs) => qs.id === qsId);
    // console.log(qsData2);
    qsData.downloadURL = downloadURLs[qsId];
    var qsData2 = { ...qsData, quotePdf: quotePdfUrl.link };
    await setDoc(
      doc(db, dbName.slice(0, 3) + "-pending-site-quotes", qsId),
      qsData2
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
      {isQuote && (
        <Quote
          setQuotePdfUrl={setQuotePdfUrl}
          quoteData={quoteData}
          setIsQuote={setIsQuote}
          dbName={dbName}
        />
      )}
      <div className="flex flex-col gap-5 mt-8 items-center">
        {Measurements.map((qs) => (
          <div
            key={qs["id"]}
            className=" w-[70%] grid grid-cols-5 items-center"
          >
            {/* {console.log(qs)} */}
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
                onClick={() => handleCheckInfo(qs.id)}
                className="bg-green-400 p-2 rounded-lg text-center"
              >
                Check Info
              </button>
            </Link>
            {quotePdfUrl.link !== "" && qs["id"] === quotePdfUrl.id ? (
              <Link
                href={quotePdfUrl.link}
                target="_blank"
                className="bg-gray-400 hover:bg-gray-500 mb-2 p-2 rounded-lg text-center"
              >
                View Quote
              </Link>
            ) : (
              <button
                onClick={() => {
                  setIsQuote(true);
                  setQuoteData(qs);
                }}
                className="bg-gray-300 hover:bg-gray-400 mb-2 p-2 rounded-lg text-center"
              >
                Generate Quote
              </button>
            )}

            <input
              className=" mx-4"
              disabled={!qs.infoChecked}
              id="measuremnt-image"
              name="measuremnt-image"
              type="file"
              onChange={(e) => handleUploadMeasurement(qs.id, e)}
            />
            <button
              className={`p-2 font-medium rounded-lg text-sm text-center capitalize ${
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
