import { PDFDownloadLink } from "@react-pdf/renderer";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillFilePdf, AiOutlineFilePdf } from "react-icons/ai";
import { Text, View, Page, Document, StyleSheet } from "@react-pdf/renderer";
import { Fragment } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function ViewDeliveryNote({
  orderType,
  orderID,
  setViewDeliverynote,
  quoteOrderData,
  consumableData,
  action,
}) {
  const router = useRouter();
  console.log("q", quoteOrderData);
  console.log("c", consumableData);
  const [viewMenu, setViewMenu] = useState(true);
  const [viewQuoteOrder, setViewQuoteOrder] = useState(true);

  const [DNNo, setDNNo] = useState(orderID);
  const [toLocation1, setToLocation1] = useState("");
  const [fromLocation1, setFromLocation1] = useState("");
  const date = new Date().toLocaleString();
  const [quoteOrder, setQuoteOrder] = useState([
    {
      prodName: "",
      prodDesc: "",
      Qty: "",
      Size: "",
      Unit: "",
      Weight: "",
    },
  ]);
  const [consumanleOrder, setConsumableOrder] = useState([
    {
      prodName: "",
      prodDesc: "",
      Qty: "",
    },
  ]);

  const Invoice = () => {
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

      invoiceNumber: { fontSize: 11, fontWeight: "bold" },

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
            <Text>Sl. No.</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Prod. Desc.</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Qty.</Text>
          </View>
          {viewQuoteOrder && (
            <>
              <View style={[styles.theader, styles.theader2]}>
                <Text>Size</Text>
              </View>
              <View style={[styles.theader, styles.theader2]}>
                <Text>Units</Text>
              </View>
              <View style={[styles.theader, styles.theader2]}>
                <Text>Weight(Tonnes)</Text>
              </View>
            </>
          )}
        </View>
      );
    };

    const TableBody = () => {
      return quoteOrderData?.quoteOrder?.map((receipt, index) => (
        <Fragment key={receipt.id}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={styles.tbody}>
              <Text>{index + 1}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.prodName}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.prodDesc}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Qty}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Size}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Unit}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Weight}</Text>
            </View>
          </View>
        </Fragment>
      ));
    };
    const TableBody2 = () => {
      return consumableData?.consumanleOrder?.map((receipt, index) => (
        <Fragment key={receipt.id}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={styles.tbody}>
              <Text>{index + 1}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.prodName}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.prodDesc}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Qty}</Text>
            </View>
          </View>
        </Fragment>
      ));
    };

    const Address = () => {
      return (
        <View style={styles.titleContainer}>
          <View style={styles.spaceBetween}>
            <View>
              <Text style={styles.invoiceNumber}>Date & Time - {date}</Text>
              <Text style={styles.invoiceNumber}>DN No. - {DNNo}</Text>
              <Text style={styles.invoiceNumber}>
                From Location- {quoteOrderData?.fromLocation1}
              </Text>
              <Text style={styles.invoiceNumber}>
                To Location- {quoteOrderData?.toLocation1}
              </Text>
            </View>
          </View>
        </View>
      );
    };
    const Address2 = () => {
      return (
        <View style={styles.titleContainer}>
          <View style={styles.spaceBetween}>
            <View>
              <Text style={styles.invoiceNumber}>Date & Time - {date}</Text>
              <Text style={styles.invoiceNumber}>DN No. - {DNNo}</Text>
              <Text style={styles.invoiceNumber}>
                From Location- {consumableData?.fromLocation1}
              </Text>
              <Text style={styles.invoiceNumber}>
                To Location- {consumableData?.toLocation1}
              </Text>
            </View>
          </View>
        </View>
      );
    };

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <InvoiceTitle />
          {viewQuoteOrder ? (
            <View>
              <Text>Quote Order (order ID:{orderID})</Text>
            </View>
          ) : (
            <View>
              <Text>Consumable Order (order ID:{orderID})</Text>
            </View>
          )}
          {viewQuoteOrder ? <Address /> : <Address2 />}
          <TableHead />
          {viewQuoteOrder ? <TableBody /> : <TableBody2 />}
        </Page>
      </Document>
    );
  };
  return (
    <>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
      <div>
        <div className="w-full md:pl-6 pr-12 flex justify-between">
          <button
            className=" go-back-btn"
            onClick={() => {
              if (!viewMenu) {
                setViewMenu(true);
              } else {
                setViewDeliverynote(false);
              }
            }}
          >
            Go Back
          </button>
        </div>
        <div className="flex flex-col items-center">
          <p className="page-heading">Check Delivery Note</p>
          {viewMenu && (
            <div className=" flex flex-col gap-2 md:mt-6">
              <button
                onClick={() => {
                  setViewMenu(false);
                  setViewQuoteOrder(true);
                }}
                disabled={!quoteOrderData}
                className=" bg-blue-500 disabled:bg-gray-400 disabled:text-gray-600 hover:bg-blue-600 py-2 px-8 text-white font-semibold text-sm md:text-base"
              >
                Quote Order
              </button>
              <button
                onClick={() => {
                  setViewMenu(false);
                  setViewQuoteOrder(false);
                }}
                disabled={!consumableData}
                className=" bg-blue-500 disabled:bg-gray-400 disabled:text-gray-600 hover:bg-blue-600 py-2 px-8 text-white font-semibold text-sm md:text-base"
              >
                Consumables
              </button>
            </div>
          )}
          {!viewMenu && (
            <>
              {viewQuoteOrder ? (
                <div className=" w-full md:mt-4 text-sm md:text-base">
                  <div className=" flex items-center justify-center">
                    <button
                      onClick={() => {
                        setViewMenu(false);
                        setViewQuoteOrder(true);
                      }}
                      disabled={!quoteOrderData}
                      className={`
                        disabled:bg-gray-400 disabled:text-gray-600 ${
                          viewQuoteOrder
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        } hover:bg-blue-400 hover:text-white py-2 px-6 md:px-8  font-semibold`}
                    >
                      Quote Order
                    </button>
                    <button
                      onClick={() => {
                        setViewMenu(false);
                        setViewQuoteOrder(false);
                      }}
                      disabled={!consumableData}
                      className={`disabled:bg-gray-400 disabled:text-gray-600 ${
                        !viewQuoteOrder
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      } hover:bg-blue-400 hover:text-white py-2 px-8 font-semibold`}
                    >
                      Consumables
                    </button>
                  </div>
                  <div className=" flex items-center justify-end">
                    <PDFDownloadLink
                      document={<Invoice />}
                      fileName={`OrderId-${orderID}-Quote-Order.pdf`}
                    >
                      <AiOutlineFilePdf
                        title="Get PDF"
                        className=" text-[36px] cursor-pointer"
                      />
                    </PDFDownloadLink>
                  </div>
                  <div className="flex flex-col items-center overflow-x-auto">
                    <div className="flex flex-col sm:flex-row pb-7 gap-16 w-full">
                      <div className="flex flex-col w-full">
                        <p
                          className={`mt-2 w-fit px-4 py-2  ${
                            quoteOrderData?.confirmed
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        >
                          Confirmed :{" "}
                          <span className=" uppercase">
                            {String(quoteOrderData?.confirmed)}
                          </span>
                        </p>
                        <div className=" grid grid-cols-2 gap-4 ">
                          <div>
                            <p className="mt-2">Date :</p>
                            <input
                              type="text"
                              value={quoteOrderData?.date}
                              disabled
                              onChange={(e) => {}}
                              className=" p-2 disabled:bg-white w-full  "
                            />
                          </div>
                          <div>
                            <p className="mt-2">DN No.</p>
                            <input
                              type="text"
                              value={quoteOrderData?.DNNo}
                              disabled
                              onChange={(e) => setDNNo(e.target.value)}
                              className=" p-2 w-full  disabled:bg-white "
                            />
                          </div>
                        </div>

                        <p className=" mt-3">From</p>
                        <input
                          type="text"
                          value={quoteOrderData?.fromLocation1}
                          disabled
                          onChange={(e) => setDNNo(e.target.value)}
                          className=" p-2 w-full  disabled:bg-white "
                        />
                        <p className=" mt-3">To</p>
                        <input
                          type="text"
                          value={quoteOrderData?.toLocation1}
                          disabled
                          onChange={(e) => setDNNo(e.target.value)}
                          className=" p-2 w-full  disabled:bg-white "
                        />
                      </div>
                    </div>
                    <table className="custom-table w-full ml-[150px] ">
                      <thead className=" custom-table-head">
                        <tr>
                          <th className=" custom-table-row">Sl. No. </th>
                          <th className=" custom-table-row">Product Name</th>
                          <th className=" custom-table-row">
                            Product Description
                          </th>
                          <th className=" custom-table-row">Quantity</th>
                          <th className=" custom-table-row">Size</th>
                          <th className=" custom-table-row">Unit</th>
                          <th className=" custom-table-row">Weight (Tonnes)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quoteOrderData?.quoteOrder?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center custom-table-data ">
                              <p className=" ">{index + 1}</p>
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.prodName}
                                onChange={(e) => {
                                  const list = [...quoteOrder];
                                  list[index].prodName = e.target.value;
                                  setQuoteOrder(list);
                                }}
                                className=" custom-table-input"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.prodDesc}
                                onChange={(e) => {
                                  const list = [...quoteOrder];
                                  list[index].prodDesc = e.target.value;
                                  setQuoteOrder(list);
                                }}
                                className=" custom-table-input"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.Qty}
                                onChange={(e) => {
                                  const list = [...quoteOrder];
                                  list[index].Qty = e.target.value;
                                  setQuoteOrder(list);
                                }}
                                className=" custom-table-input"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.Size}
                                onChange={(e) => {
                                  const list = [...quoteOrder];
                                  list[index].Size = e.target.value;
                                  setQuoteOrder(list);
                                }}
                                className=" custom-table-input"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.Unit}
                                onChange={(e) => {
                                  const list = [...quoteOrder];
                                  list[index].Unit = e.target.value;
                                  setQuoteOrder(list);
                                }}
                                className=" custom-table-input"
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={item.Weight}
                                onChange={(e) => {
                                  const list = [...quoteOrder];
                                  list[index].Weight = e.target.value;
                                  setQuoteOrder(list);
                                }}
                                className=" custom-table-input"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!quoteOrderData?.confirmed &&
                      action?.toLowerCase() !== "view" && (
                        <button
                          className="bg-green-400 disabled:bg-gray-400 hover:bg-green-600 font-semibold p-2 px-6 rounded-lg mt-4"
                          onClick={() => {
                            try {
                              const orderData = {
                                ...quoteOrderData,
                                confirmed: true,
                              };
                              // console.log(orderData);
                              if (Number(orderType) === 0) {
                                setDoc(
                                  doc(db, "DN-quote-orders", `site-${orderID}`),
                                  orderData
                                );
                              } else {
                                setDoc(
                                  doc(
                                    db,
                                    "DN-quote-orders",
                                    `retail-${orderID}`
                                  ),
                                  orderData
                                );
                              }
                              enqueueSnackbar("QuoteOrder Confirmed", {
                                variant: "success",
                              });
                              setTimeout(() => {
                                router.back();
                              }, 3500);
                            } catch (error) {
                              enqueueSnackbar("Some error occured", {
                                variant: "error",
                              });
                            }
                          }}
                        >
                          Confirm
                        </button>
                      )}
                  </div>
                </div>
              ) : (
                <div className=" w-full mt-4 text-sm md:text-base">
                  {/* consumables ---------------------------------------------------------------------------------------------- */}
                  <div className=" flex items-center justify-center">
                    <button
                      onClick={() => {
                        setViewMenu(false);
                        setViewQuoteOrder(true);
                      }}
                      disabled={!quoteOrderData}
                      className={` disabled:bg-gray-400 disabled:text-gray-600 ${
                        viewQuoteOrder
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      } hover:bg-blue-400  hover:text-white py-2 px-6 md:px-8  font-semibold`}
                    >
                      Quote Order
                    </button>
                    <button
                      onClick={() => {
                        setViewMenu(false);
                        setViewQuoteOrder(false);
                      }}
                      disabled={!consumableData}
                      className={` disabled:bg-gray-400 disabled:text-gray-600 ${
                        !viewQuoteOrder
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      } hover:bg-blue-400 hover:text-white py-2 px-8 font-semibold`}
                    >
                      Consumables
                    </button>
                  </div>
                  <div className=" flex items-center justify-end">
                    <PDFDownloadLink
                      document={<Invoice />}
                      fileName={`OrderId-${orderID}-Consumable-Order.pdf`}
                    >
                      <AiOutlineFilePdf
                        title="Get PDF"
                        className=" text-[36px] cursor-pointer"
                      />
                    </PDFDownloadLink>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex flex-col sm:flex-row pb-7 gap-16 w-full">
                      <div className="flex flex-col w-full">
                        <p
                          className={`mt-2 w-fit px-4 py-2  ${
                            consumableData?.confirmed
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        >
                          Confirmed :{" "}
                          <span className=" uppercase">
                            {String(quoteOrderData?.confirmed)}
                          </span>
                        </p>
                        <div className=" grid grid-cols-2 gap-4 ">
                          <div>
                            <p className="mt-2">Date :</p>
                            <input
                              type="text"
                              value={consumableData?.date}
                              disabled
                              onChange={(e) => {}}
                              className=" p-2 disabled:bg-white w-full  "
                            />
                          </div>
                          <div>
                            <p className="mt-2">DN No.</p>
                            <input
                              type="text"
                              value={consumableData?.DNNo}
                              disabled
                              onChange={(e) => setDNNo(e.target.value)}
                              className=" p-2 w-full  disabled:bg-white "
                            />
                          </div>
                        </div>

                        <p className=" mt-3">
                          From (dropdown for the site locations)
                        </p>
                        <input
                          type="text"
                          value={consumableData?.fromLocation1}
                          disabled
                          onChange={(e) => setDNNo(e.target.value)}
                          className=" p-2 w-full  disabled:bg-white "
                        />
                        <p className=" mt-3">
                          To (dropdown for the site locations)
                        </p>
                        <input
                          type="text"
                          value={consumableData?.toLocation1}
                          disabled
                          onChange={(e) => setDNNo(e.target.value)}
                          className=" p-2 w-full  disabled:bg-white "
                        />
                      </div>
                    </div>
                    <table className=" custom-table">
                      <thead className=" custom-table-head">
                        <tr>
                          <th className=" custom-table-row">Sl. No. </th>
                          <th className=" custom-table-row">Product Name</th>
                          <th className=" custom-table-row">
                            Product Description
                          </th>
                          <th className=" custom-table-row">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumableData?.consumanleOrder.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center custom-table-data ">
                              <p className=" ">{index + 1}</p>
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.prodName}
                                onChange={(e) => {
                                  const list = [...consumanleOrder];
                                  list[index].prodName = e.target.value;
                                  setConsumableOrder(list);
                                }}
                                className=" custom-table-input"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.prodDesc}
                                onChange={(e) => {
                                  const list = [...consumanleOrder];
                                  list[index].prodDesc = e.target.value;
                                  setConsumableOrder(list);
                                }}
                                className=" custom-table-input"
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                value={item.Qty}
                                onChange={(e) => {
                                  const list = [...consumanleOrder];
                                  list[index].Qty = e.target.value;
                                  setConsumableOrder(list);
                                }}
                                className=" custom-table-input"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!consumableData?.confirmed &&
                      action?.toLowerCase() !== "view" && (
                        <button
                          className="bg-green-400 disabled:bg-gray-400 hover:bg-green-600 font-semibold p-2 px-6 rounded-lg mt-4"
                          onClick={() => {
                            try {
                              const orderData = {
                                ...consumableData,
                                confirmed: true,
                              };
                              // console.log(orderData);
                              if (Number(orderType) === 0) {
                                setDoc(
                                  doc(db, "DN-consumables", `site-${orderID}`),
                                  orderData
                                );
                              } else {
                                setDoc(
                                  doc(
                                    db,
                                    "DN-consumables",
                                    `retail-${orderID}`
                                  ),
                                  orderData
                                );
                              }
                              enqueueSnackbar("ConsumableOrder Confirmed", {
                                variant: "success",
                              });
                              setTimeout(() => {
                                router.back();
                              }, 3500);
                            } catch (error) {
                              enqueueSnackbar("Some error occured", {
                                variant: "error",
                              });
                            }
                          }}
                        >
                          Confirm
                        </button>
                      )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
