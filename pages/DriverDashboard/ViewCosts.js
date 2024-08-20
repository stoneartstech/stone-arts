import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import Image from "next/image";
import ViewOrder from "../Logistics/ViewOrder";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Link from "next/link";
import OngoingOrders from "./OngoingOrders";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function ViewCosts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [upLoading, setUpLoading] = useState(false);
  const [viewSiteInfo, setViewSiteInfo] = useState(false);
  const [driver, setDriver] = useState("");
  const [actionsTab, setActionsTab] = useState(false);
  const [orders, setOrders] = useState([]);
  const [uploadType, setUploadType] = useState(false);
  const [activeOrder, setActiveOrder] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [documents, setDocuments] = useState("");
  const [price, setPrice] = useState("");
  const [costDate, setCostDate] = useState("");
  const [docs, setDocs] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [viewDocs, setViewDocs] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(false);

  const fetchVehicleData = async () => {
    try {
      const result = await getDoc(doc(db, `Drivers/Driver-127`));
      const data = result?.data();
      if (data) {
        setDriver(data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
    }
  };
  const fetchCosts = async () => {
    setLoading(true);
    try {
      const result = await getDocs(
        collection(db, `Logistics-Costs/Driver-127/${uploadType}`)
      );
      const data = result?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      console.log(data);
      if (data.length > 0) {
        setDocs(data);
      }
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
      setLoading(false);
    }
  };

  const date = new Date().toISOString();

  useEffect(() => {
    fetchVehicleData();
  }, []);

  useEffect(() => {
    fetchCosts();
  }, [uploadType]);

  return (
    <>
      {viewSiteInfo ? (
        <ViewOrder
          orderType={activeOrder?.type}
          order={activeOrder}
          setViewOrder={setViewSiteInfo}
        />
      ) : (
        <div>
          <SnackbarProvider
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          />
          <div className="w-full relative md:px-8 flex flex-col md:flex-row justify-between">
            <button
              className="bg-slate-300 p-2 md:absolute left-10 rounded-lg w-fit text-sm md:text-base "
              onClick={() => {
                if (viewDocs) {
                  setViewDocs(false);
                } else if (isUpload) {
                  setIsUpload(false);
                } else {
                  router.back();
                }
              }}
            >
              Go Back
            </button>
            <p className=" text-xl md:text-2xl  text-center w-full font-bold mb-2">
              {!viewDocs ? "View Costs" : uploadType + " Costs"}
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
              {viewDocs ? (
                <div className=" md:px-7 pt-5">
                  {selectedDoc ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
                        <div className="flex flex-col min-w-[250px]  md:min-w-[300px]">
                          <p className=" font-medium">
                            Date
                            <span className=" text-red-600">*</span>
                          </p>
                          <input
                            required
                            type="date"
                            value={selectedDoc?.date}
                            disabled
                            onChange={(e) => {
                              setCostDate(e.target.value);
                            }}
                            className=" p-2 w-full "
                          />
                        </div>
                        <div className="flex flex-col min-w-[250px]  md:min-w-[300px]">
                          <p className=" font-medium">
                            {uploadType} Price
                            <span className=" text-red-600">*</span>
                          </p>
                          <input
                            required
                            type="number"
                            value={selectedDoc?.price}
                            disabled
                            onChange={(e) => {
                              setPrice(e.target.value);
                            }}
                            className=" p-2 w-full "
                          />
                        </div>
                        <div className="flex flex-col min-w-[250px]  md:min-w-[300px]">
                          <p className=" font-medium">
                            Uploaded {uploadType} Cost
                            <span className=" text-red-600">*</span>
                          </p>
                          <Link
                            href={selectedDoc?.cost}
                            target="_blank"
                            className=" upload-form-btn w-fit"
                          >
                            View Doc
                          </Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      {docs?.length <= 0 ? (
                        <p className=" text-center w-full mt-4">
                          No Documents Found
                        </p>
                      ) : (
                        <div className=" w-full flex flex-col items-center mt-3">
                          {docs?.map((order, index) => {
                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  setIsUpload(true);
                                  setSelectedDoc(order);
                                }}
                                className="main-btn"
                              >
                                {order?.uploadDate?.split("T")[0]} -{" "}
                                {order?.uploadDate?.split("T")[1]}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className=" flex flex-col items-center justify-center gap-2  mt-3">
                  {[
                    "Maintainance",
                    "Fuelling",
                    "Servicing",
                    "Traffic-Offence",
                    "ODO",
                  ]?.map((item, index) => {
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setViewDocs(true);
                          setUploadType(item);
                        }}
                        className="main-btn"
                      >
                        {item} Cost
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
