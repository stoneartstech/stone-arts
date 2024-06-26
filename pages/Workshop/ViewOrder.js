import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DeliveryNote from "./DeliveryNotes";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "@/firebase";
import ViewDeliveryNote from "./ViewDeliveryNotes";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function ViewOrder({ orderType, order, setViewOrder }) {
  const router = useRouter();
  const [viewDeliveryNote, setViewDeliverynote] = useState(false);
  const [addDeliveryNote, setAddDeliverynote] = useState(false);
  const [quoteOrderData, setQuoteOrderData] = useState(false);
  const [consumableData, setConsumableData] = useState(false);
  const [orderImg, setOrderImg] = useState("");
  const [imgURL, setImgURL] = useState(order?.imageUrl ? order?.imageUrl : "");
  const [downloadURL, setDownloadURL] = useState("");
  const [waiting, setWaiting] = useState(false);

  const handleUploadDesign = async () => {
    const file = orderImg;
    const orderId = order?.id;
    try {
      // Upload the file to Firebase Storage at workshop - Non Standard - Pending Order (NSPO)
      const storageRef = ref(storage, `workshop-NS-PO/${orderId}`);
      await uploadBytes(storageRef, file);
      // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      setDownloadURL(downloadURL);
      const quoteOrderData = await setDoc(
        doc(db, "workshop-retail-pending", `${order?.id}`),
        {
          ...order,
          imageUrl: downloadURL,
        }
      );
      enqueueSnackbar("Image Uploaded Successfully", {
        variant: "success",
      });
      setWaiting(false);
      setImgURL(downloadURL);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(`File for client could not be uploaded`, {
        variant: "error",
      });
    }
  };
  useEffect(() => {
    const fetch = async () => {
      if (Number(orderType) === 0) {
        const quoteOrderData = await getDoc(
          doc(db, "DN-quote-orders", `site-${order?.orderId}`)
        );
        const consumableData = await getDoc(
          doc(db, "DN-consumables", `site-${order?.orderId}`)
        );
        setQuoteOrderData(quoteOrderData?.data());
        setConsumableData(consumableData?.data());
        console.log(quoteOrderData?.data(), consumableData?.data());
      } else {
        const quoteOrderData = await getDoc(
          doc(db, "DN-quote-orders", `retail-${order?.orderId}`)
        );
        const consumableData = await getDoc(
          doc(db, "DN-consumables", `retail-${order?.orderId}`)
        );
        setQuoteOrderData(quoteOrderData?.data());
        setConsumableData(consumableData?.data());
        console.log(quoteOrderData?.data(), consumableData?.data());
      }
    };
    fetch();
  }, []);

  return (
    <>
      {addDeliveryNote || viewDeliveryNote ? (
        <>
          {addDeliveryNote ? (
            <DeliveryNote
              orderType={orderType}
              orderID={order?.orderId}
              setAddDeliverynote={setAddDeliverynote}
            />
          ) : (
            <ViewDeliveryNote
              orderType={orderType}
              orderID={order?.orderId}
              quoteOrderData={quoteOrderData}
              consumableData={consumableData}
              setViewDeliverynote={setViewDeliverynote}
            />
          )}
        </>
      ) : (
        <div className=" overscroll-x-hidden">
          <SnackbarProvider
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          />
          <div className="w-full md:pl-6 pr-12 flex justify-between ">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => setViewOrder(false)}
            >
              Go Back
            </button>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl">Check Order</p>
            <div className="flex flex-col sm:flex-row md:p-8 gap-3 md:gap-16 w-full">
              <div className=" grid grid-cols-2 md:grid-cols-5  gap-3 items-center  w-full">
                <p className="mt-2 p-2 bg-white px-2 md:px-4">
                  Date : {order?.date}
                </p>
                <p className="mt-2 p-2 bg-white px-2 md:px-4">
                  Order ID : {order?.orderId}
                </p>
                <p className="mt-2 p-2 bg-white px-2 md:px-4">
                  Client Code : {order?.clientCode}
                </p>
                <p className="mt-2 p-2 bg-white px-2 md:px-4">
                  Invoice Number : {order?.invoiceNumber}
                </p>
                <p className="mt-2 p-2 bg-white px-2 md:px-4">
                  Workshop : {order?.workshop}
                </p>
                <p className="mt-2 p-2 bg-white px-2 md:px-4">
                  Location : {order?.location}
                </p>
                <p className="mt-2 p-2 bg-white px-2 md:px-4">
                  Order Designation : {order?.orderDesignation}
                </p>
                <p className="mt-2 p-2 bg-white px-2 md:px-4">
                  Order Type : {order?.orderType}
                </p>
                <p className="mt-2 p-2 bg-white px-2 md:px-4">
                  Client Name : {order?.name}
                </p>
              </div>
            </div>
            <div className=" flex flex-col md:flex-row gap-3 mt-2">
              <button
                onClick={() => {
                  setViewDeliverynote(true);
                }}
                disabled={!quoteOrderData && !consumableData}
                className=" bg-green-500 disabled:bg-gray-400 disabled:text-gray-700 py-1.5 px-4 text-white font-semibold"
              >
                Check Delivery Note
              </button>
              <button
                onClick={() => {
                  setAddDeliverynote(true);
                }}
                disabled={quoteOrderData && consumableData}
                className=" bg-green-500 disabled:bg-gray-400 disabled:text-gray-700 py-1.5 px-4 text-white font-semibold"
              >
                Add Delivery Note
              </button>
              {order?.orderType?.toLowerCase() !== "standard" && (
                <>
                  {imgURL !== "" ? (
                    <>
                      <a
                        target="_blank"
                        href={imgURL}
                        className=" cursor-pointer text-center  bg-green-500 disabled:bg-gray-400 disabled:text-gray-700 py-1.5 px-4 text-white font-semibold"
                      >
                        View Image
                      </a>
                    </>
                  ) : (
                    <>
                      <input
                        className=" "
                        type="file"
                        onChange={(e) => setOrderImg(e.target.files[0])}
                        id="orderImg"
                        name="orderImg"
                      />
                      <button
                        disabled={waiting || orderImg === ""}
                        onClick={(e) => {
                          setWaiting(true);
                          handleUploadDesign();
                        }}
                        className=" cursor-pointer  bg-green-500 disabled:bg-gray-400 disabled:text-gray-700 py-1.5 px-4 text-white font-semibold"
                      >
                        {waiting ? "uploading" : "Add Image"}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            <div className=" overflow-x-auto w-full">
              <table className="  text-base md:text-base  w-full mt-2 table-auto">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="px-2 border-gray-400 border">Sl. No.</th>
                    <th className="px-2 border-gray-400 border">
                      Product Name
                    </th>
                    <th className="px-2 border-gray-400 border">
                      Product Description
                    </th>
                    <th className="px-2 border-gray-400 border">Size</th>
                    <th className="px-2 border-gray-400 border">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.order?.map((item, index) => (
                    <tr key={index}>
                      <td className="bg-white border border-gray-400 text-center">
                        {index + 1}
                      </td>
                      <td className="bg-white border border-gray-400">
                        {item?.prodName}
                      </td>
                      <td className="bg-white border border-gray-400">
                        {item?.prodDesc}
                      </td>
                      <td className="bg-white border border-gray-400">
                        {item?.Size}
                      </td>
                      <td className="bg-white border border-gray-400">
                        {item?.Qty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
