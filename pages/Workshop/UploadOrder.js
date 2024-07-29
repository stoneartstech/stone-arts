import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function UploadOrder() {
  const searchParams = useSearchParams();
  const showroomName = searchParams.get("showroomName");

  const [loading, setLoading] = useState(true);
  const showroomDbNames = {
    Galleria: "orders",
    Mirage: "mirage-orders",
    Kisumu: "kisumu-orders",
    "Mombasa Road": "mombasa-orders",
  };
  const showroomDbName = showroomDbNames[showroomName];

  const requestShowroomDbNames = {
    Galleria: "clients",
    Mirage: "mirage-clients",
    Kisumu: "kisumu-clients",
    "Mombasa Road": "mombasa-clients",
  };
  const requestShowroomDbName = requestShowroomDbNames[showroomName];

  const router = useRouter();

  const date = new Date().toLocaleDateString();

  const [workshop, setWorkshop] = useState("matasia");
  const [location, setLocation] = useState("");
  const [orderId, setOrderId] = useState(0);
  const [name, setName] = useState("");
  const [orderDesignation, setOrderDesignation] = useState("showroom");
  const [clientCode, setClientCode] = useState("");
  const [orderType, setOrderType] = useState("standard");
  const [jcNumber, setJcNumber] = useState("");

  const getOrderId = async () => {
    try {
      const docRef = doc(db, "orderId", "orderId-SP");
      const fetch = await getDoc(docRef);
      console.log(fetch.data());
      const number = fetch.data();
      if (number !== undefined) {
        setOrderId(number.id);
      }
    } catch (error) {
      console.error("Error fetching order ID:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderId();
  }, []);

  const [order, setOrder] = useState([
    {
      prodName: "",
      prodDesc: "",
      Size: "",
      Qty: "",
    },
  ]);

  const handleAddRow = () => {
    const row = {
      prodName: "",
      prodDesc: "",
      Size: "",
      Qty: "",
    };
    setOrder([...order, row]);
  };
  const handleRemoveRow = (index) => {
    if (order?.length > 1) {
      const list = [...order];
      list.splice(-1);
      setOrder(list);
    }
  };

  return (
    <>
      {!loading && (
        <div>
          <div className="w-full pl-6 pr-12 flex justify-between">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => router.back()}
            >
              Go Back
            </button>
            <SnackbarProvider
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            />
            {/* <Link className='bg-slate-300 hover:bg-slate-500 p-4 rounded-lg'
                            href={{
                                pathname: '/OrderHistory',
                                query: { showroomName: showroomName },
                            }} >
                            <b>Order History</b>
                        </Link> */}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                const orderData = {
                  date,
                  clientCode,
                  orderId,
                  jcNumber,
                  workshop,
                  location,
                  name,
                  orderDesignation,
                  orderType,
                  order,
                  confirmed: false,
                };
                // setDoc(doc(db, showroomDbName, `${orderId}`), orderData);
                setDoc(doc(db, "orderId", "orderId-SP"), { id: orderId + 1 });
                // setDoc(
                //   doc(db, "workshop-site-pending", `${orderId}`),
                //   orderData
                // );
                setDoc(doc(db, "PMT-pending-confirm", `${orderId}`), orderData);
                enqueueSnackbar("Order Sent to admin for confirmation", {
                  variant: "success",
                });
                setTimeout(() => {
                  router.back();
                }, 1500);
              } catch (error) {
                console.error(error);
                enqueueSnackbar("Something Went Wrong", {
                  variant: "error",
                });
              }
            }}
            className="flex flex-col items-center"
          >
            <p className="text-3xl">Upload Order</p>
            <div className="flex flex-col sm:flex-row p-8 gap-16 w-full">
              <div className="flex flex-col w-full">
                <p className="mt-2">Date : {date}</p>
                <p className="mt-2">Order ID : {orderId}</p>
                <p className="mt-4">Client Code</p>
                <div className="flex flex-row gap-2">
                  <input
                    required
                    type="text"
                    value={clientCode}
                    onChange={(e) => setClientCode(e.target.value)}
                    className=" p-2 w-full "
                  />
                </div>
                <p className="mt-2">JC Number</p>
                <input
                  required
                  type="text"
                  value={jcNumber}
                  onChange={(e) => setJcNumber(e.target.value)}
                  className=" p-2 w-full "
                />

                <p className="">Workshop Selection</p>
                <select
                  className="p-2 w-full"
                  onChange={(e) => setWorkshop(e.target.value)}
                >
                  <option value="matasia">Matasia</option>
                  <option value="mombasa">Mombasa Road</option>
                </select>
              </div>
              <div className="flex flex-col w-full">
                <p className="">Location</p>
                <input
                  required
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className=" p-2 w-full"
                />

                <p className="mt-2">Order Designation</p>
                <select
                  className="p-2 w-full"
                  onChange={(e) => setOrderDesignation(e.target.value)}
                >
                  <option value="showroom">Showroom</option>
                  <option value="retail">Retail</option>
                </select>

                <p className="mt-2">Order Type</p>
                <select
                  className="p-2 w-full"
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="standard">Standard</option>
                  <option value="non-standard">Non-Standard</option>
                </select>

                <p className="mt-2">Client Name</p>
                <div className="flex flex-row gap-2">
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 w-full"
                  />
                </div>
              </div>
            </div>
            <table className="w-full mt-6">
              <thead>
                <tr>
                  <th>S. No. </th>
                  <th>Product Name</th>
                  <th>Product Description</th>
                  <th>Size</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center ">
                      <p className=" bg-white p-2">{index + 1}</p>
                    </td>
                    <td>
                      <input
                        required
                        type="text"
                        value={item.prodName}
                        onChange={(e) => {
                          const list = [...order];
                          list[index].prodName = e.target.value;
                          setOrder(list);
                        }}
                        className="p-2 w-full"
                      />
                    </td>
                    <td>
                      <input
                        required
                        type="text"
                        value={item.prodDesc}
                        onChange={(e) => {
                          const list = [...order];
                          list[index].prodDesc = e.target.value;
                          setOrder(list);
                        }}
                        className="p-2 w-full"
                      />
                    </td>
                    <td>
                      <input
                        required
                        type="text"
                        value={item.Size}
                        onChange={(e) => {
                          const list = [...order];
                          list[index].Size = e.target.value;
                          setOrder(list);
                        }}
                        className="p-2 w-full"
                      />
                    </td>
                    <td>
                      <input
                        required
                        type="number"
                        value={item.Qty}
                        onChange={(e) => {
                          const list = [...order];
                          list[index].Qty = e.target.value;
                          setOrder(list);
                        }}
                        className="p-2 w-full"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className=" flex items-center justify-center gap-3 mt-2">
              <button
                className="bg-slate-300 hover:bg-green-500 p-2 rounded-lg"
                type="button"
                onClick={handleAddRow}
              >
                + Add Row
              </button>
              <button
                type="button"
                className="bg-slate-300 hover:bg-red-500 p-2 rounded-lg"
                onClick={() => handleRemoveRow()}
              >
                - Remove Row
              </button>
            </div>
            <button
              disabled={
                date === "" ||
                clientCode === "" ||
                orderId === "" ||
                jcNumber === "" ||
                workshop === "" ||
                location === "" ||
                name === "" ||
                orderDesignation === "" ||
                orderType === "" ||
                order === ""
              }
              type="submit"
              className=" disabled:bg-gray-400 bg-green-400 hover:bg-green-600 p-2 rounded-lg mt-4"
            >
              Send to Admin for Confirmation
            </button>
          </form>
        </div>
      )}
    </>
  );
}
