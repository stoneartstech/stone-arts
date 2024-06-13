import React, { Fragment, useEffect, useState } from "react";
import { DataGrid, useGridApiContext } from "@mui/x-data-grid";
import {
  IoAddSharp,
  IoBarChartSharp,
  IoReorderThreeOutline,
  IoTabletLandscapeSharp,
} from "react-icons/io5";
import Head from "next/head";
import { AiOutlineBorderlessTable } from "react-icons/ai";
import { Text, View, Page, Document, StyleSheet } from "@react-pdf/renderer";
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import Link from "next/link";
import CreateSalesOrder from "./createSalesOrder";
import { useRouter } from "next/router";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { useParams } from "next/navigation";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "number", headerName: "Number", width: 70 },
  { field: "tag", headerName: "Tag", width: 70 },
  { field: "dateAndTime", headerName: "Date and Time", width: 130 },
  { field: "customer", headerName: "Customer", width: 130 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "quantityStatus", headerName: "Quantity Status", width: 130 },
  { field: "shippingStatus", headerName: "Shipping Status", width: 130 },
  { field: "paymentStatus", headerName: "Payment Status", width: 130 },
  { field: "amount", headerName: "Amount", width: 130 },
  { field: "totalAmount", headerName: "Total Amount", width: 130 },
  { field: "unpaidAmt", headerName: "Unpaid Amount", width: 130 },
  { field: "advanceAmt", headerName: "Advance Amount", width: 130 },
  { field: "warehouse", headerName: "Warehouse", width: 130 },
];

const rows = [
  {
    id: 1,
    tag: "",
    number: "SO-00007",
    dateAndTime: "04/03/2023 14:12",
    customer: "PC WORLD LLC",
    status: "completed",
    quantityStatus: "fulfilled",
    shippingStatus: "Shipped",
    paymentStatus: "PAID",
    amount: 185.99,
    totalAmount: 199.99,
    unpaidAmt: 23,
    advanceAmt: 67,
    warehouse: "Main Warehouse",
  },
  {
    id: 2,
    tag: "",
    number: "SO-00008",
    dateAndTime: "09/02/2023 14:12",
    customer: "Synergy LLC",
    status: "pacekd",
    quantityStatus: "no quantity",
    shippingStatus: "ready for shipping",
    paymentStatus: "partly-advance",
    amount: 385.99,
    totalAmount: 449.99,
    unpaidAmt: 233,
    advanceAmt: 67,
    warehouse: "Main Warehouse",
  },
  {
    id: 3,
    tag: "",
    number: "SO-00008",
    dateAndTime: "04/03/2023 14:12",
    customer: "iugyhf LLC",
    status: "approved",
    quantityStatus: "Available Quantity",
    shippingStatus: "partly-shipped",
    paymentStatus: "advance payment",
    amount: 185.99,
    totalAmount: 199.99,
    unpaidAmt: 23,
    advanceAmt: 67,
    warehouse: "Main Warehouse",
  },
  {
    id: 4,
    tag: "",
    number: "SO-00009",
    dateAndTime: "04/09/2025 14:12",
    customer: "oiuy LLC",
    status: "completed",
    quantityStatus: "fulfilled",
    shippingStatus: "Shipped",
    paymentStatus: "PAID",
    amount: 78655.99,
    totalAmount: 348769.99,
    unpaidAmt: 8763,
    advanceAmt: 6787,
    warehouse: "Main Warehouse",
  },
  {
    id: 5,
    tag: "",
    number: "SO-00011",
    dateAndTime: "28/03/2023 14:12",
    customer: "lkjhgfD LLC",
    status: "completed",
    quantityStatus: "fulfilled",
    shippingStatus: "Shipped",
    paymentStatus: "PAID",
    amount: 185.99,
    totalAmount: 199.99,
    unpaidAmt: 23,
    advanceAmt: 67,
    warehouse: "Main Warehouse",
  },
  {
    id: 6,
    tag: "",
    number: "SO-00007",
    dateAndTime: "04/03/2023 14:12",
    customer: "PC WORLD LLC",
    status: "completed",
    quantityStatus: "fulfilled",
    shippingStatus: "Shipped",
    paymentStatus: "PAID",
    amount: 185.99,
    totalAmount: 199.99,
    unpaidAmt: 23,
    advanceAmt: 67,
    warehouse: "Main Warehouse",
  },
  {
    id: 7,
    tag: "",
    number: "SO-00007",
    dateAndTime: "04/03/2023 14:12",
    customer: "PC WORLD LLC",
    status: "completed",
    quantityStatus: "fulfilled",
    shippingStatus: "Shipped",
    paymentStatus: "PAID",
    amount: 185.99,
    totalAmount: 199.99,
    unpaidAmt: 23,
    advanceAmt: 67,
    warehouse: "Main Warehouse",
  },
  {
    id: 8,
    tag: "",
    number: "SO-00007",
    dateAndTime: "04/03/2023 14:12",
    customer: "PC WORLD LLC",
    status: "completed",
    quantityStatus: "fulfilled",
    shippingStatus: "Shipped",
    paymentStatus: "PAID",
    amount: 185.99,
    totalAmount: 199.99,
    unpaidAmt: 23,
    advanceAmt: 67,
    warehouse: "Main Warehouse",
  },
];

const Header = ({ Invoice1, handleCreateSalesOrder }) => {
  const bulkOptions = [
    { name: "Print", action: "print" },
    { name: "Save to GDRIVE", action: "gdrive" },
    { name: "Mail To", action: "mailto" },
    { name: "Download", action: "download" },
  ];

  return (
    <div className=" flex w-full py-2 items-center justify-between">
      <div className=" relative">
        <Link href="/erpag/createSalesOrder">
          <button
            onClick={() => {
              handleCreateSalesOrder();
            }}
            className=" flex items-center gap-1 bg-green-400 py-2 px-4 rounded-md text-sm font-medium"
          >
            <IoAddSharp />
            Create
          </button>
        </Link>
        {/* {isBulkMenu && (
          <div className=" absolute top-11 -right-7 shadow-sm shadow-black/60 bg-white flex flex-col z-30 text-sm ">
            {bulkOptions?.map((item, index) => {
            //   return (
            <PDFDownloadLink document={<Invoice1 />} fileName={`pdf-quote.pdf`}>
              <p className=" py-2 px-6 min-w-max cursor-pointer hover:bg-blue-400">
                Download
              </p>
            </PDFDownloadLink>
            );
            })}
          </div>
        )} */}
      </div>
      <div className=" flex items-center gap-2">
        <button className=" flex items-center gap-1 bg-gray-300 py-2 px-4 rounded-md">
          <AiOutlineBorderlessTable />
          View
        </button>
        <button className=" flex items-center gap-1 bg-gray-300 py-2 px-4 rounded-md">
          <IoBarChartSharp />
          Chart
        </button>
        <button className=" flex items-center gap-1 bg-gray-300 py-2 px-4 rounded-md">
          <IoReorderThreeOutline />
          More
        </button>
      </div>
    </div>
  );
};
const Invoice = () => {
  const Invoice2 = () => {
    const styles = StyleSheet.create({
      page: {
        fontSize: 11,
        paddingTop: 20,
        paddingLeft: 40,
        paddingRight: 40,
        lineHeight: 1.5,
        flexDirection: "column",
      },

      spaceBetween: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#3E3E3E",
      },

      titleContainer: { flexDirection: "row", marginTop: 24 },

      logo: { width: 90 },

      reportTitle: { fontSize: 16, textAlign: "center" },

      addressTitle: { fontSize: 11, fontStyle: "bold" },

      invoice: { fontWeight: "bold", fontSize: 20 },

      invoicetag: "",
      number: { fontSize: 11, fontWeight: "bold" },

      address: { fontWeight: 400, fontSize: 10 },

      theader: {
        marginTop: 20,
        fontSize: 10,
        fontStyle: "bold",
        paddingTop: 4,
        paddingLeft: 7,
        flex: 1,
        height: 20,
        backgroundColor: "#3b82f6",
        borderColor: "whitesmoke",
        borderRightWidth: 1,
        borderBottomWidth: 1,
      },

      theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

      tbody: {
        fontSize: 9,
        paddingTop: 4,
        paddingLeft: 7,
        flex: 1,
        borderColor: "whitesmoke",
        borderRightWidth: 1,
        borderBottomWidth: 1,
      },

      total: {
        fontSize: 9,
        paddingTop: 4,
        paddingLeft: 7,
        flex: 1.5,
        borderColor: "#ffedd5",
        borderBottomWidth: 1,
      },

      tbody2: { flex: 2, borderRightWidth: 1 },
    });

    const InvoiceTitle = () => {
      return (
        <View style={styles.titleContainer}>
          <View style={styles.spaceBetween}>
            <Text style={styles.reportTitle}>Stone Arts</Text>
          </View>
        </View>
      );
    };

    const TableHead = () => {
      return (
        <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Sl No.</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>ID</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Number</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Tag</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Date and Time</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Customer</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Status</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Quantity Status</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Shipping Status</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Payment Status</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Amount</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Total Amount</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Unpaid Amount</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Advance Amount</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Warehouse</Text>
          </View>
        </View>
      );
    };

    const TableBody = () => {
      return rows?.map((receipt, index) => (
        <Fragment key={index}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={[styles.tbody]}>
              <Text>{receipt.id}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.number}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.invoiceDate}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.salesOrder}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.dateAndTime}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.customer}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.status}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.amount}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.totalAmount}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.warehouse}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.paymentStatus}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.unpaidAmt}</Text>
            </View>
          </View>
        </Fragment>
      ));
    };

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <InvoiceTitle />
          <TableHead />
          <TableBody />
        </Page>
      </Document>
    );
  };
  const [isCreateSalesOrder, setIsCreateSalesOrder] = useState(false);
  const [editSalesOrder, setEditSalesOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {
    uploadInvoice,
    address,
    aspects,
    clientCode,
    clientId,
    email,
    id,
    name,
    number,
    option,
    showroom,
    sourceInfo,
    specificInfo,
  } = router.query;
  // alert(uploadInvoice);

  const today = new Date();
  const date =
    today.getDate() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    today.getFullYear();
  // Extract date components
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Add leading zero if necessary
  const day = ("0" + currentDate.getDate()).slice(-2);

  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);

  const time = hours + "-" + minutes + "-" + seconds;

  useEffect(() => {
    if (uploadInvoice === true || uploadInvoice === "true") {
      setIsCreateSalesOrder(true);
    }
    const fetch = onSnapshot(
      collection(db, "erpag/reports/salesOrder"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        // setData(reports[0]?.);
        console.log(reports);
        var newObjectsArray = [];
        reports.forEach((item) => {
          const updatedItem = item.data.map((obj) => ({
            ...obj,
            ...item[0]?.details,
          }));
          newObjectsArray.push(updatedItem);
        });
        console.log(newObjectsArray);
        setData(newObjectsArray);
        setLoading(false);
      }
    );
    return fetch;
  }, []);
  const handleCreateSalesOrder = () => {
    setIsCreateSalesOrder((prev) => (prev === true ? false : true));
  };
  const handEditSalesOrder = () => {
    setEditSalesOrder((prev) => (prev === true ? false : true));
  };

  return (
    <div div className="">
      {loading ? (
        <div className=" w-full h-full flex items-center justify-center">
          Loading...
        </div>
      ) : (
        <div className=" overflow-x-auto w-full h-full">
          <div className=" flex w-full py-2 items-center justify-between">
            <div className=" relative flex items-center gap-2">
              <button
                onClick={() => {
                  if (isCreateSalesOrder || editSalesOrder) {
                    setEditSalesOrder(false);
                    setIsCreateSalesOrder(false);
                    return;
                  } else {
                    router.back();
                    return;
                  }
                }}
                className=" flex items-center gap-1 bg-gray-400 py-2 px-4 rounded-md text-sm font-medium"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  handleCreateSalesOrder();
                }}
                className=" flex items-center gap-1 bg-green-400 py-2 px-4 rounded-md text-sm font-medium"
              >
                <IoAddSharp />
                Create
              </button>
              {!isCreateSalesOrder && !editSalesOrder && (
                <PDFDownloadLink
                  document={<Invoice2 />}
                  fileName={`pdf-quote.pdf`}
                >
                  <button
                    onClick={() => {
                      handleCreateSalesOrder();
                    }}
                    className=" flex items-center gap-1 bg-green-400 py-2 px-4 rounded-md text-sm font-medium"
                  >
                    Download
                  </button>
                </PDFDownloadLink>
              )}
            </div>
          </div>
          {isCreateSalesOrder || editSalesOrder ? (
            <>
              {editSalesOrder ? (
                <CreateSalesOrder
                  compType="edit"
                  handleClose={handEditSalesOrder}
                  selectedOrder={selectedOrder}
                />
              ) : (
                <CreateSalesOrder
                  compType={"create"}
                  clientId={clientId}
                  handleClose={handleCreateSalesOrder}
                />
              )}
            </>
          ) : (
            <>
              <table className="table-auto overscroll-x-auto">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    {columns?.map((column, index) => {
                      return (
                        <th
                          key={index}
                          title={column?.headerName}
                          className="px-2 border-gray-400 border"
                        >
                          {column?.headerName}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="">
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td className="bg-white  border border-gray-400 text-center">
                        <input
                          disabled
                          className="w-full px-2 border-none outline-none"
                          title={item[0]?.id}
                          value={item[0]?.id}
                        />
                      </td>
                      <td className="bg-white  relative border border-gray-400 text-center">
                        <p
                          onClick={() => {
                            setSelectedOrder(item);
                            setEditSalesOrder(true);
                          }}
                          className=" absolute wf h-full inset-0 "
                        ></p>
                        <input
                          disabled
                          className="w-full px-2 font-medium underline cursor-pointer hover:text-blue-600 border-none outline-none"
                          title={item[0]?.number}
                          value={item[0]?.number}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center">
                        <input
                          disabled
                          className="w-full px-2 border-none outline-none"
                          title={item[0]?.tag}
                          value={item[0]?.tag}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center">
                        <input
                          disabled
                          className="w-fit text-center px-2 border-none outline-none"
                          title={item[0]?.dateAndTime}
                          value={item[0]?.dateAndTime}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center">
                        <input
                          disabled
                          className="w-full px-2 border-none outline-none"
                          title={item[0]?.customer}
                          value={item[0]?.customer}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center">
                        <input
                          disabled
                          className={`w-full px-2 ${
                            item[0]?.status?.toLowerCase() === "completed"
                              ? "bg-green-400"
                              : item[0]?.status?.toLowerCase() === "packed"
                              ? " bg-yellow-300"
                              : item[0]?.status?.toLowerCase() === "approved"
                              ? " bg-blue-400"
                              : ""
                          } border-none outline-none`}
                          title={item[0]?.status}
                          value={item[0]?.status}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center">
                        <input
                          disabled
                          className={`w-full px-2 ${
                            item[0]?.quantityStatus?.toLowerCase() ===
                            "fulfilled"
                              ? "bg-green-400"
                              : item[0]?.quantityStatus?.toLowerCase() ===
                                "no quantity"
                              ? " bg-red-300"
                              : item[0]?.quantityStatus?.toLowerCase() ===
                                "available quantity"
                              ? " bg-blue-400"
                              : ""
                          } border-none outline-none`}
                          title={item[0]?.quantityStatus}
                          value={item[0]?.quantityStatus}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center relative">
                        <p
                          className={` w-full px-2 ${
                            item[0]?.shippingStatus?.toLowerCase() === "shipped"
                              ? " w-full bg-green-400"
                              : item[0]?.shippingStatus?.toLowerCase() ===
                                "ready for shipping"
                              ? " "
                              : item[0]?.shippingStatus?.toLowerCase() ===
                                "partly-shipped"
                              ? " w-[50px] bg-yellow-300"
                              : ""
                          }  h-full absolute z-40 inset-0 `}
                        ></p>
                        <input
                          disabled
                          className="w-full px-2 absolute inset-0 z-50 bg-transparent border-none outline-none"
                          title={item[0]?.shippingStatus}
                          value={item[0]?.shippingStatus}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center">
                        <input
                          disabled
                          className={`w-full px-2 ${
                            item[0]?.paymentStatus?.toLowerCase() === "paid"
                              ? "bg-green-400"
                              : item[0]?.paymentStatus?.toLowerCase() ===
                                "partly-advance"
                              ? " bg-yellow-200"
                              : item[0]?.paymentStatus?.toLowerCase() ===
                                "advance-payment"
                              ? " bg-blue-400"
                              : item[0]?.paymentStatus?.toLowerCase() ===
                                "unpaid"
                              ? " bg-red-400"
                              : ""
                          } border-none outline-none`}
                          title={item[0]?.paymentStatus}
                          value={item[0]?.paymentStatus}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center">
                        <input
                          disabled
                          className="w-full px-2 border-none outline-none"
                          title={item[0]?.amount}
                          value={item[0]?.amount}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center">
                        <input
                          disabled
                          className="w-full px-2 border-none outline-none"
                          title={item[0]?.totalAmount}
                          value={item[0]?.totalAmount}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center">
                        <input
                          disabled
                          className="w-full px-2 border-none outline-none"
                          title={item[0]?.unpaidAmt}
                          value={item[0]?.unpaidAmt}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center">
                        <input
                          disabled
                          className="w-full px-2 border-none outline-none"
                          title={item[0]?.advanceAmt}
                          value={item[0]?.advanceAmt}
                        />
                      </td>
                      <td className="bg-white border border-gray-400 text-center">
                        <input
                          disabled
                          className="w-full px-2 border-none outline-none"
                          title={item[0]?.warehouse}
                          value={item[0]?.warehouse}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default Invoice;
