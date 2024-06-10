import React, { Fragment, useEffect, useState } from "react";
import {
  IoAddSharp,
  IoBarChartSharp,
  IoReorderThreeOutline,
} from "react-icons/io5";
import { AiOutlineBorderlessTable } from "react-icons/ai";
import { Text, View, Page, Document, StyleSheet } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Link from "next/link";
import CreatePurchase from "./createPurchase";
import EditPurchase from "./editPurchase";
import { useRouter } from "next/router";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "number", headerName: "Number", width: 70 },
  { field: "tag", headerName: "Tag", width: 70 },
  { field: "dateAndTime", headerName: "Date and Time", width: 130 },
  { field: "supplier", headerName: "Supplier", width: 130 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "paymentStatus", headerName: "Payment Status", width: 130 },
  { field: "totalAmount", headerName: "Total Amount", width: 130 },
  { field: "unpaidAmt", headerName: "Unpaid Amount", width: 130 },
];

const Header = ({ Invoice1, handleCreatePurchase }) => {
  return (
    <div className=" flex w-full py-2 items-center justify-between">
      <div className=" relative">
        <Link href="/erpag/createPurchase">
          <button
            onClick={() => {
              handleCreatePurchase();
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
            <Text>Supplier</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Status</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Payment Status</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Total Amount</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Unpaid Amount</Text>
          </View>
        </View>
      );
    };

    const TableBody = () => {
      return data?.map((receipt, index) => (
        <Fragment key={index}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={[styles.tbody]}>
              <Text>{index + 1}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt?.details?.number}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt?.details?.tag}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt?.details?.dateAndTime}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt?.details?.supplier}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt?.details?.orderStatus}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt?.details?.paymentStatus}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt?.total}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt?.unpaid}</Text>
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
  const [isCreatePurchase, setIsCreatePurchase] = useState(false);
  const [editPurchase, setEditPurchase] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetch = onSnapshot(
      collection(db, "erpag/reports/purchase"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        console.log(reports);
        setData(reports);
        setLoading(false);
      }
    );
    return fetch;
  }, []);
  const handleCreatePurchase = () => {
    setIsCreatePurchase((prev) => (prev === true ? false : true));
  };
  const handEditPurchase = () => {
    setEditPurchase((prev) => (prev === true ? false : true));
  };
  const router = useRouter();
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
                  if (isCreatePurchase || editPurchase) {
                    setEditPurchase(false);
                    setIsCreatePurchase(false);
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
                  setEditPurchase(false);
                  handleCreatePurchase();
                }}
                className=" flex items-center gap-1 bg-green-400 py-2 px-4 rounded-md text-sm font-medium"
              >
                <IoAddSharp />
                Create
              </button>
              {!isCreatePurchase && !editPurchase && (
                <PDFDownloadLink
                  document={<Invoice2 />}
                  fileName={`Purchase-List.pdf`}
                >
                  <button className=" flex items-center gap-1 bg-green-400 py-2 px-4 rounded-md text-sm font-medium">
                    Download
                  </button>
                </PDFDownloadLink>
              )}
            </div>
          </div>
          {isCreatePurchase || editPurchase ? (
            <>
              {editPurchase ? (
                <EditPurchase
                  compType="edit"
                  handleClose={handEditPurchase}
                  selectedOrder={selectedOrder}
                />
              ) : (
                <CreatePurchase
                  compType={"create"}
                  handleClose={handleCreatePurchase}
                />
              )}
            </>
          ) : (
            <>
              {data?.length > 0 ? (
                <table className="table-auto w-full overscroll-x-auto">
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
                            title={index + 1}
                            value={index + 1}
                          />
                        </td>
                        <td className="bg-white  relative group border border-gray-400 text-center">
                          <p
                            onClick={() => {
                              setSelectedOrder(item);
                              setEditPurchase(true);
                            }}
                            className=" absolute wf group h-full cursor-pointer inset-0 "
                          ></p>
                          <input
                            disabled
                            className="w-full px-2 font-medium underline cursor-pointer group-hover:text-blue-600 hover:text-blue-600 border-none outline-none"
                            title={item?.details?.number}
                            value={item?.details?.number}
                          />
                        </td>
                        <td className="bg-white border border-gray-400 text-center">
                          <input
                            disabled
                            className="w-full px-2 border-none outline-none"
                            title={item?.details?.tag}
                            value={item?.details?.tag}
                          />
                        </td>
                        <td className="bg-white border border-gray-400 text-center">
                          <input
                            disabled
                            className="w-fit text-center px-2 border-none outline-none"
                            title={item?.details?.dateAndTime}
                            value={item?.details?.dateAndTime}
                          />
                        </td>
                        <td className="bg-white border border-gray-400 text-center">
                          <input
                            disabled
                            className="w-full px-2 border-none outline-none"
                            title={item?.details?.supplier}
                            value={item?.details?.supplier}
                          />
                        </td>
                        <td className="bg-white border border-gray-400 text-center">
                          <input
                            disabled
                            className={`w-full px-2 ${
                              item?.details?.status?.toLowerCase() ===
                              "completed"
                                ? "bg-green-400"
                                : item?.details?.status?.toLowerCase() ===
                                  "packed"
                                ? " bg-yellow-300"
                                : item?.details?.status?.toLowerCase() ===
                                  "approved"
                                ? " bg-blue-400"
                                : ""
                            } border-none outline-none`}
                            title={item?.details?.orderStatus}
                            value={item?.details?.orderStatus}
                          />
                        </td>
                        <td className="bg-white border border-gray-400 text-center">
                          <input
                            disabled
                            className={`w-full px-2 ${
                              item?.details?.paymentStatus?.toLowerCase() ===
                              "paid"
                                ? "bg-green-400"
                                : item?.details?.paymentStatus?.toLowerCase() ===
                                  "partly-advance"
                                ? " bg-yellow-200"
                                : item?.details?.paymentStatus?.toLowerCase() ===
                                  "advance-payment"
                                ? " bg-blue-400"
                                : item?.details?.paymentStatus?.toLowerCase() ===
                                  "unpaid"
                                ? " bg-red-400"
                                : ""
                            } border-none outline-none`}
                            title={item?.details?.paymentStatus}
                            value={item?.details?.paymentStatus}
                          />
                        </td>
                        <td className="bg-white border border-gray-400 text-center">
                          <input
                            disabled
                            className="w-full px-2 border-none outline-none"
                            title={item?.total}
                            value={item?.total}
                          />
                        </td>
                        <td className="bg-white border border-gray-400 text-center">
                          <input
                            disabled
                            className="w-full px-2 border-none outline-none"
                            title={item?.unpaid}
                            value={item?.unpaid}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className=" w-full text-center">No Purchases are Done</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default Invoice;
