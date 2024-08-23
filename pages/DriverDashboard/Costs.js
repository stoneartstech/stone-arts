import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "@/firebase";
import Image from "next/image";
import ViewOrder from "../Logistics/ViewOrder";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Link from "next/link";
import OngoingOrders from "./OngoingOrders";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function Costs() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [upLoading, setUpLoading] = useState(false);
  const [viewSiteInfo, setViewSiteInfo] = useState(false);
  const [driver, setDriver] = useState("");
  const [actionsTab, setActionsTab] = useState(false);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [uploadType, setUploadType] = useState(false);
  const [activeOrder, setActiveOrder] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [documents, setDocuments] = useState("");
  const [price, setPrice] = useState("");
  const [costDate, setCostDate] = useState("");

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

  const date = new Date().toISOString();

  useEffect(() => {
    fetchVehicleData();
  }, []);

  const handleUpload = async (event) => {
    setUpLoading(true);
    try {
      console.log(activeOrder);

      const storageRef = ref(
        storage,
        `Logistics-Costs/${driver?.name}/${uploadType}/${date}`
      );
      await uploadBytes(storageRef, documents);

      const downloadURL = await getDownloadURL(storageRef);
      await setDoc(
        doc(db, `Logistics-Costs/${driver?.name}/${uploadType}/${date}`),
        {
          uploadDate: date,
          price,
          date: costDate,
          cost: downloadURL,
        }
      );
      setIsUpload(false);
      enqueueSnackbar(`${uploadType} Cost Uploaded Successfully`, {
        variant: "success",
      });
      setPrice("");
      setCostDate("");
    } catch (error) {
      enqueueSnackbar("Some Error Occured", {
        variant: "error",
      });
      console.error(error);
    }
    setUpLoading(false);
  };

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
                if (isUpload) {
                  setIsUpload(false);
                } else {
                  if (actionsTab) {
                    setActionsTab(false);
                    setSelectedOrder("");
                  } else {
                    router.back();
                  }
                }
              }}
            >
              Go Back
            </button>
            <p className=" text-xl md:text-2xl  text-center w-full font-bold mb-2">
              Upload Costs
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
              {isUpload ? (
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
                        value={costDate}
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
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                        }}
                        className=" p-2 w-full "
                      />
                    </div>
                    <div className="flex flex-col min-w-[250px]  md:min-w-[300px]">
                      <p className=" font-medium">
                        Upload {uploadType} Cost
                        <span className=" text-red-600">*</span>
                      </p>
                      <input
                        required
                        type="file"
                        onChange={(e) => {
                          setDocuments(e.target.files[0]);
                        }}
                        className=" p-2 w-full "
                      />
                      <button
                        type="button"
                        disabled={upLoading || documents === ""}
                        className=" upload-form-btn w-fit"
                        onClick={(event) => {
                          handleUpload(event);
                        }}
                      >
                        {upLoading ? "Uploading" : "Upload"}
                      </button>
                    </div>
                  </div>
                </>
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
                          setIsUpload(true);
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
