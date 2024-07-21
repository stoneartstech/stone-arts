import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, storage } from "../../firebase";
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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function CompletedSites() {
  const [isQsSelected, setIsQsSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionsTab, setActionsTab] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [tempAddress, setTempAddress] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileLink, setFileLink] = useState("");
  const [uploadImage, setUploadImage] = useState("");
  const [requests, setRequests] = useState([]);
  const [qs, setQs] = useState(1);
  const router = useRouter();

  async function fetchCompletedQuotes() {
    setLoading(true);
    const promises = [];
    // let { signedCopy, jobCardClosed, ...rest } = selectedClient;
    // setDoc(doc(db, `PMT-sites-in-progress/${selectedClient?.clientId}`), rest);
    // for (let qs = 1; qs <= maxQs; qs++) {
    const requestsRef = collection(db, `PMT-sites-completed`);
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
  const handleUploadReportImages = async () => {
    setUploading(true);
    try {
      const storageRef = ref(
        storage,
        `PMTImages/OngoingSites/SignedCopy/${selectedClient?.clientId}`
      );
      await uploadBytes(storageRef, uploadImage);

      // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      setFileLink(downloadURL);
      console.log("image Uploaded");
      let tempObj = { ...selectedClient, signedCopy: downloadURL };
      setDoc(
        doc(db, `PMT-sites-in-progress/${selectedClient?.clientId}`),
        tempObj
      );
      setSelectedClient(tempObj);

      enqueueSnackbar(` File Uploaded Successfully`, {
        variant: "success",
      });
      setUploadImage("");
      setUploading(false);
    } catch (error) {
      enqueueSnackbar("Some error occured", {
        variant: "error",
      });
      console.error(error);
      setUploading(false);
    }
  };
  const handleCloseJobCard = async () => {
    try {
      let tempObj = { ...selectedClient, jobCardClosed: true };
      setDoc(
        doc(db, `PMT-sites-in-progress/${selectedClient?.clientId}`),
        tempObj
      );
      setSelectedClient(tempObj);
      enqueueSnackbar(` JobCard Closed Successfully`, {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("Some error occured", {
        variant: "error",
      });
      console.error(error);
    }
  };

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
        <div className="w-full px-3 md:px-8 flex flex-row justify-between">
          <button
            className="bg-slate-300 p-2 rounded-lg"
            onClick={() => {
              if (actionsTab) {
                setSelectedClient("");
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
              : "Sites Completed"}
          </p>
          {selectedClient && (
            <p className=" w-full text-center text-sm mt-0.5 font-medium ">
              Start Date: {selectedClient?.date}, {selectedClient?.time}
            </p>
          )}
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
                      className=" mt-4 w-[250px] md:w-[40%] grid grid-cols-3"
                    >
                      <div className=" py-1.5 md:py-0  col-span-3 md:md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                        {order?.name} - {order?.clientId}
                      </div>
                      <button
                        onClick={() => {
                          setActionsTab(true);
                          setSelectedClient(order);
                        }}
                        className=" col-span-3 md:col-span-1 bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border border-t-0 md:border-t md:border-l-0"
                      >
                        Actions
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className=" flex flex-col items-center justify-center ">
                <div className=" mt-4 grid grid-cols-1 md:grid-cols-2 flex-col gap-2.5 w-fit ">
                  <div className=" flex  flex-col md:col-span-2 w-full">
                    <p className=" bg-white capitalize text-center w-full text-xs md:text-base font-semibold py-1.5 md:py-2.5 px-4 border-black border ">
                      Site Supervisor: {selectedClient?.supervisor}
                    </p>
                  </div>
                  <div className=" flex  flex-col md:col-span-2 w-full">
                    {selectedClient?.address ? (
                      <p className=" bg-white capitalize text-center w-full text-xs md:text-base font-semibold py-1.5 md:py-2.5 px-4 border-black border ">
                        Address: {selectedClient?.address}
                      </p>
                    ) : (
                      <div className=" flex items-center gap-2">
                        <input
                          className=" bg-white w-full text-xs md:text-sm py-1.5 md:py-2.5 px-4 border-black border "
                          type="text"
                          value={tempAddress}
                          onChange={(e) => {
                            setTempAddress(e.target.value);
                          }}
                          placeholder="Add Address"
                        />
                        <button
                          onClick={async () => {
                            try {
                              setDoc(
                                doc(
                                  db,
                                  "PMT-sites-in-progress",
                                  `${selectedClient?.clientId}`
                                ),
                                { ...selectedClient, address: tempAddress }
                              );
                              setLoading(true);
                              fetchCompletedQuotes()
                                .then((combinedArray) => {
                                  setLoading(false);
                                  console.log(combinedArray);
                                })
                                .catch((error) => {
                                  console.error("Error fetching data:", error);
                                });
                              enqueueSnackbar(`Address Added Successfully`, {
                                variant: "success",
                              });
                            } catch (error) {
                              enqueueSnackbar("Some error occured", {
                                variant: "error",
                              });
                              console.error(error);
                            }
                          }}
                          className="py-1.5 md:py-2.5 px-4 border-black border bg-[#94e63d] hover:bg-[#83cb37] font-semibold text-sm"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/PMTHead/actions/CheckImages?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}&type=view`}
                  >
                    <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border min-w-[250px]  md:min-w-[300px] w-full">
                      Check Images
                    </button>
                  </Link>
                  <Link
                    href={`/PMTHead/actions/CheckProgress?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}&type=view`}
                  >
                    <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border min-w-[250px]  md:min-w-[300px] w-full">
                      Check Progress
                    </button>
                  </Link>
                  <Link href={selectedClient?.quotePdf} target="_blank">
                    <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border min-w-[250px]  md:min-w-[300px] w-full">
                      Check Quote
                    </button>
                  </Link>
                  <Link
                    href={`/PMTHead/actions/MaterialPlanUpload?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}&type=view`}
                  >
                    <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border min-w-[250px]  md:min-w-[300px] w-full">
                      Check Material Plan
                    </button>
                  </Link>
                  <Link
                    href={`/PMTHead/actions/SitePlanUpload?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}&type=view`}
                  >
                    <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border min-w-[250px]  md:min-w-[300px] w-full">
                      Check Site Plan
                    </button>
                  </Link>
                  <Link
                    href={`/PMTHead/actions/JobCards?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}&type=view`}
                  >
                    <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border min-w-[250px]  md:min-w-[300px] w-full">
                      Check Job Card
                    </button>
                  </Link>

                  <a
                    href={selectedClient?.signedCopy}
                    target="_blank"
                    type="button"
                    className=" bg-[#94e63d] hover:bg-[#83cb37] text-center text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border min-w-[250px]  md:min-w-[300px] w-full"
                  >
                    View Signed Copy
                  </a>

                  <button
                    disabled={selectedClient?.jobCardClosed}
                    onClick={() => {
                      // handleCloseJobCard();
                    }}
                    className=" bg-[#94e63d] disabled:bg-gray-300 disabled:text-gray-700 hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-full"
                  >
                    {selectedClient?.jobCardClosed
                      ? "Job Card Closed"
                      : "Close Job Card"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
