import React, { useState } from "react";
import { useRouter } from "next/router";
import { db, storage } from "@/firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { collection, onSnapshot } from "firebase/firestore";
import {
  CheckDeliveryNotes,
  CheckProgressImages,
  CheckSiteImages,
} from "./Qs/components/ViewQuoteComponents";

export default function ViewQuoteDetails() {
  const router = useRouter();
  const {
    id,
    dbName,
    description,
    clientId,
    clientFirstName,
    clientLastName,
    clientPhoneNumber,
    clientEmail,
    clientAddress,
    salesPerson,
    sourceInfo,
    specificInfo,
    status,
    option,
    date,
    aspects,
    address,
    measurementDataContactPerson,
    measurementDataCost,
    measurementDataDate,
    measurementDataSupplyFix,
    measurementDataTime,
  } = router.query;

  const [loading, setLoading] = useState(false);
  const [downloadSiteImgURLs, setDownloadSiteImgURLs] = useState(false);
  const [downloadProgressImgURLs, setDownloadProgressImgURLs] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [isSiteImages, setIsSiteImages] = useState(false);
  const [isProgressImages, setIsProgressImages] = useState(false);
  const [isDeliveryNotes, setIsDeliveryNotes] = useState(false);

  const checkQuote = async () => {
    try {
      setLoading(true);
      const storageRef = ref(
        storage,
        `PdfQuotes/${dbName.slice(0, 3)}/${id}.pdf`
      );

      // // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      if (downloadURL) setLoading(false);
      router.push(downloadURL);
    } catch (error) {
      console.log(error);
      alert("No Quotes Available");
      router.reload();
    }
  };

  const checkSiteImages = async () => {
    try {
      setLoading(true);
      const folderRef = ref(storage, `SiteImages/${dbName.slice(0, 3)}/${id}`);
      const folderContent = await listAll(folderRef);
      const downloadURLs1 = [];
      await Promise.all(
        folderContent.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          downloadURLs1.push(url);
        })
      );
      setDownloadSiteImgURLs(downloadURLs1);
      setLoading(false);
      setIsSiteImages(true);
    } catch (error) {
      console.log(error);
      alert("Try again Later !!");
    }
  };
  const checkProgressImages = async () => {
    try {
      setLoading(true);
      const folderRef = ref(
        storage,
        `ProgressImages/${dbName.slice(0, 3)}/${id}`
      );
      const folderContent = await listAll(folderRef);
      const downloadURLs1 = [];
      await Promise.all(
        folderContent.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          downloadURLs1.push(url);
        })
      );
      setDownloadProgressImgURLs(downloadURLs1);
      setLoading(false);
      setIsProgressImages(true);
    } catch (error) {
      console.log(error);
      alert("Try again Later !!");
    }
  };
  const checkDeliveryNotes = async () => {
    try {
      setLoading(true);
      const deliveryNotesRef = collection(
        db,
        `DeliveryNotes/${dbName.slice(0, 3)}/${id}`
      );
      const DeliveryNoteSnapshot = onSnapshot(deliveryNotesRef, (snapshot) => {
        const notesList = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setDeliveryNotes(notesList);
      });
      setLoading(false);
      setIsDeliveryNotes(true);
      // console.log(deliveryNotes);
    } catch (error) {
      console.log(error);
      alert("Try again Later !!");
    }
  };

  return (
    <>
      {!loading && (
        <div>
          {isSiteImages && (
            <CheckSiteImages
              id={id}
              dbName={dbName}
              downloadSiteImgURLs={downloadSiteImgURLs}
              setDownloadSiteImgURLs={setDownloadSiteImgURLs}
              setIsSiteImages={setIsSiteImages}
            />
          )}
          {isProgressImages && (
            <CheckProgressImages
              id={id}
              dbName={dbName}
              downloadProgressImgURLs={downloadProgressImgURLs}
              setDownloadProgressImgURLs={setDownloadProgressImgURLs}
              setIsProgressImages={setIsProgressImages}
            />
          )}
          {isDeliveryNotes && (
            <CheckDeliveryNotes
              id={id}
              dbName={dbName}
              deliveryNotes={deliveryNotes}
              setDeliveryNotes={setDeliveryNotes}
              setIsDeliveryNotes={setIsDeliveryNotes}
            />
          )}
          <div className="w-full px-8 flex flex-row justify-between"></div>
          <div className="flex flex-col">
            <p className="text-3xl mx-auto font-semibold mb-2">Quote Details</p>
          </div>
          <div className=" w-full px-[10%] mt-5 grid grid-cols-3 ">
            <div className=" flex items-center justify-center">
              <div className=" bg-gray-300 text-lg flex flex-col h-full w-fit p-5 rounded-md ">
                <h2 className=" font-bold mb-3 capitalize text-xl">
                  Information
                </h2>
                <p>Id : {id}</p>
                <p>Type : {option}</p>
                <p>Aspects : {aspects}</p>
                <p>Sales Person : {salesPerson}</p>
                <p>Source Info. : {sourceInfo}</p>
                <p>Specific Info. : {specificInfo}</p>
                <p>Date : {date}</p>
              </div>
            </div>
            <div className=" flex items-center justify-center">
              <div className=" text-lg flex flex-col w-fit h-full p-5 rounded-md bg-gray-300">
                <h2 className=" font-bold mb-3 capitalize text-xl">
                  Client Details
                </h2>
                <p>Client Id : {clientId}</p>
                <p>Name : {clientFirstName}</p>
                <p>Last Name : {clientLastName}</p>
                <p>Address : {address}</p>
                <p>Number : {clientPhoneNumber}</p>
                <p>Email : {clientEmail}</p>
              </div>
            </div>
            <div className=" flex items-center justify-center">
              <div className=" text-lg flex flex-col w-fit h-full p-5 rounded-md bg-gray-300 ">
                <h2 className=" font-bold mb-3 capitalize text-xl">
                  {option} - Details
                </h2>
                <p>Contact Person : {measurementDataContactPerson}</p>
                <p>Cost : {measurementDataCost}</p>
                <p>Date : {measurementDataDate}</p>
                <p>Supply Fix : {measurementDataSupplyFix}</p>
                <p>Time : {measurementDataTime}</p>
              </div>
            </div>
          </div>
          <div className=" w-full flex px-[10%] flex-wrap gap-5 items-center justify-center mt-5">
            <button
              onClick={() => {
                checkQuote();
              }}
              className=" bg-[#90f24e] hover:bg-[#89db4f] border border-black px-14 py-3 font-medium "
            >
              Check Quote
            </button>
            {!loading ? (
              <button
                onClick={() => {
                  checkDeliveryNotes();
                }}
                className=" bg-[#90f24e] hover:bg-[#89db4f]  border border-black px-14 py-3 font-medium "
              >
                Check Delivery Notes
              </button>
            ) : (
              "Loading"
            )}
            <button
              onClick={() => {}}
              className=" bg-[#90f24e] hover:bg-[#89db4f] border border-black px-14 py-3 font-medium "
            >
              Check Team Members
            </button>
            {!loading ? (
              <button
                onClick={() => {
                  checkProgressImages();
                }}
                className=" bg-[#90f24e] hover:bg-[#89db4f] border border-black px-14 py-3 font-medium "
              >
                Check Progress Images
              </button>
            ) : (
              "Loading"
            )}
            {!loading ? (
              <button
                onClick={() => {
                  checkSiteImages();
                }}
                className=" bg-[#90f24e] hover:bg-[#89db4f] border border-black px-14 py-3 font-medium "
              >
                Check Site Images
              </button>
            ) : (
              "Loading"
            )}
          </div>
        </div>
      )}
    </>
  );
}
