import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DeliveryNote from "./DeliveryNotes";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "@/firebase";
import ViewDeliveryNote from "./ViewDeliveryNotes";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Image from "next/image";

export default function ViewOrder({ orderType, order, setViewOrder, action }) {
  const router = useRouter();
  const [viewDeliveryNote, setViewDeliverynote] = useState(false);
  const [addDeliveryNote, setAddDeliverynote] = useState(false);
  const [quoteOrderData, setQuoteOrderData] = useState(false);
  const [consumableData, setConsumableData] = useState(false);
  const [orderImg, setOrderImg] = useState("");
  const [imgURL, setImgURL] = useState(order?.imageUrl ? order?.imageUrl : "");
  const [downloadURL, setDownloadURL] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
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
        setLoading(false);
        console.log(quoteOrderData?.data(), consumableData?.data());
      }
    };
    fetch();
  }, []);

  return (
    <>
      {loading ? (
        <div className=" w-full flex items-center justify-center">
          <Image width={50} height={50} src="/loading.svg" alt="Loading ..." />
        </div>
      ) : (
        <>
          {addDeliveryNote || viewDeliveryNote ? (
            <>
              {addDeliveryNote ? (
                <DeliveryNote
                  orderType={orderType}
                  orderID={order?.orderId}
                  setAddDeliverynote={setAddDeliverynote}
                  action={String(action)}
                />
              ) : (
                <ViewDeliveryNote
                  orderType={orderType}
                  orderID={order?.orderId}
                  quoteOrderData={quoteOrderData}
                  consumableData={consumableData}
                  setViewDeliverynote={setViewDeliverynote}
                  action={String(action)}
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
                  className=" go-back-btn"
                  onClick={() => setViewOrder(false)}
                >
                  Go Back
                </button>
              </div>
              <div className="flex flex-col items-center">
                <p className=" page-heading">Check Order</p>
                <div className="flex flex-col sm:flex-row md:p-8 gap-3 md:gap-16 w-full">
                  <div className=" grid grid-cols-2 md:grid-cols-5  gap-3 items-center  w-full text-sm md:text-base">
                    <p className="mt-2 p-2 bg-white px-2 md:px-4 h-full">
                      Date : {order?.date}
                    </p>
                    <p className="mt-2 p-2 bg-white px-2 md:px-4 h-full">
                      Order ID : {order?.orderId}
                    </p>
                    <p className="mt-2 p-2 bg-white px-2 md:px-4 h-full">
                      Client Code : {order?.clientCode}
                    </p>
                    <p className="mt-2 p-2 bg-white px-2 md:px-4 h-full">
                      Invoice Number : {order?.invoiceNumber}
                    </p>
                    <p className="mt-2 p-2 bg-white px-2 md:px-4 h-full">
                      Workshop : {order?.workshop}
                    </p>
                    <p className="mt-2 p-2 bg-white px-2 md:px-4 h-full">
                      Location : {order?.location}
                    </p>
                    <p className="mt-2 p-2 bg-white px-2 md:px-4 h-full">
                      Order Designation : {order?.orderDesignation}
                    </p>
                    <p className="mt-2 p-2 bg-white px-2 md:px-4 h-full">
                      Order Type : {order?.orderType}
                    </p>
                    <p className="mt-2 p-2 bg-white px-2 md:px-4 h-full">
                      Client Name : {order?.name}
                    </p>
                  </div>
                </div>
                <div className=" flex flex-col md:flex-row gap-1 md:gap-3 mt-3 md:mt-2">
                  <button
                    onClick={() => {
                      setViewDeliverynote(true);
                    }}
                    disabled={!quoteOrderData && !consumableData}
                    className=" upload-form-btn"
                  >
                    Check Delivery Note
                  </button>
                  {action?.toLowerCase() !== "view" && (
                    <button
                      onClick={() => {
                        setAddDeliverynote(true);
                      }}
                      disabled={quoteOrderData && consumableData}
                      className=" upload-form-btn"
                    >
                      Add Delivery Note
                    </button>
                  )}
                  {order?.orderType?.toLowerCase() !== "standard" && (
                    <>
                      {imgURL !== "" ? (
                        <>
                          <a
                            target="_blank"
                            href={imgURL}
                            className=" cursor-pointer text-center  upload-form-btn"
                          >
                            View Image
                          </a>
                        </>
                      ) : (
                        <>
                          {action?.toLowerCase() !== "view" && (
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
                                className=" cursor-pointer  upload-form-btn"
                              >
                                {waiting ? "uploading" : "Add Image"}
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
                <div className=" overflow-x-auto w-full">
                  <table className="  custom-table">
                    <thead className="custom-table-head">
                      <tr>
                        <th className="custom-table-row">Sl. No.</th>
                        <th className="custom-table-row">Product Name</th>
                        <th className="custom-table-row">
                          Product Description
                        </th>
                        <th className="custom-table-row">Size</th>
                        <th className="custom-table-row">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order?.order?.map((item, index) => (
                        <tr key={index}>
                          <td className="custom-table-data text-center">
                            {index + 1}
                          </td>
                          <td className="custom-table-data">
                            {item?.prodName}
                          </td>
                          <td className="custom-table-data">
                            {item?.prodDesc}
                          </td>
                          <td className="custom-table-data">{item?.Size}</td>
                          <td className="custom-table-data">{item?.Qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
