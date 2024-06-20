import { PDFDownloadLink } from "@react-pdf/renderer";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillFilePdf, AiOutlineFilePdf } from "react-icons/ai";
import { Text, View, Page, Document, StyleSheet } from "@react-pdf/renderer";
import { Fragment } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function ViewDeliveryNote({
  orderID,
  setViewDeliverynote,
  quoteOrderData,
  consumableData,
}) {
  const router = useRouter();

  const [viewMenu, setViewMenu] = useState(true);
  const [viewQuoteOrder, setViewQuoteOrder] = useState(true);

  const [DNNo, setDNNo] = useState(orderID);
  const [toLocation1, setToLocation1] = useState("");
  const [fromLocation1, setFromLocation1] = useState("");
  const date = new Date().toLocaleString();
  const [quoteOrder, setQuoteOrder] = useState([
    {
      prodDesc: "",
      Qty: "",
      Size: "",
      Unit: "",
      Weight: "",
    },
  ]);
  const [consumanleOrder, setConsumableOrder] = useState([
    {
      prodDesc: "",
      Qty: "",
    },
  ]);

  const handleAdQuotedRow = () => {
    const row = {
      prodDesc: "",
      Qty: "",
      Size: "",
      Unit: "",
      Weight: "",
    };
    setQuoteOrder([...quoteOrder, row]);
  };
  const handleAdConsumeabledRow = () => {
    const row = {
      prodDesc: "",
      Qty: "",
    };
    setConsumableOrder([...consumanleOrder, row]);
  };
  const handleRemoveQuoteRow = (index) => {
    const list = [...quoteOrder];
    if (quoteOrder?.length > 1) {
      list.splice(-1);
      setQuoteOrder(list);
    }
  };
  const handleRemoveConsumableRow = (index) => {
    const list = [...consumanleOrder];
    if (consumanleOrder?.length > 1) {
      list.splice(-1);
      setConsumableOrder(list);
    }
  };
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
      <div>
        <div className="w-full md:pl-6 pr-12 flex justify-between">
          <button
            className="bg-slate-300 p-2 rounded-lg"
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
          <p className="text-3xl">Check Delivery Note</p>
          {viewMenu && (
            <div className=" flex flex-col gap-2 mt-6">
              <button
                onClick={() => {
                  setViewMenu(false);
                  setViewQuoteOrder(true);
                }}
                className=" bg-blue-500 hover:bg-blue-600 py-2 px-8 text-white font-semibold"
              >
                Quote Order
              </button>
              <button
                onClick={() => {
                  setViewMenu(false);
                  setViewQuoteOrder(false);
                }}
                className=" bg-blue-500 hover:bg-blue-600 py-2 px-8 text-white font-semibold"
              >
                Consumables
              </button>
            </div>
          )}
          {!viewMenu && (
            <>
              {viewQuoteOrder ? (
                <div className=" w-full mt-4 text-sm md:text-base">
                  <div className=" flex items-center justify-center">
                    <button
                      onClick={() => {
                        setViewMenu(false);
                        setViewQuoteOrder(true);
                      }}
                      className={`${
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
                      className={`${
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
                    <table className="w-full table-auto ">
                      <thead className=" bg-blue-400 text-white">
                        <tr>
                          <th>Sl. No. </th>
                          <th>Product Description</th>
                          <th>Quantity</th>
                          <th>Size</th>
                          <th>Unit</th>
                          <th>Weight (Tonnes)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quoteOrderData?.quoteOrder?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center ">
                              <p className=" bg-white w-full p-2">
                                {index + 1}
                              </p>
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
                                className="p-2 w-full"
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
                                className="p-2 w-full"
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
                                className="p-2 w-full"
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
                                className="p-2 w-full"
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
                                className="p-2 w-full"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!quoteOrderData?.confirmed && (
                      <button
                        className="bg-green-400 disabled:bg-gray-400 hover:bg-green-600 font-semibold p-2 px-6 rounded-lg mt-4"
                        onClick={() => {
                          const orderData = {
                            ...quoteOrderData,
                            confirmed: true,
                          };
                          // console.log(orderData);
                          setDoc(
                            doc(db, "DN-quote-orders", `${orderID}`),
                            orderData
                          );
                          alert("QuoteOrder Confirmed");
                          router.back();
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
                      className={`${
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
                      className={`${
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
                    <table className="w-full">
                      <thead className=" bg-blue-400 text-white">
                        <tr>
                          <th>Sl. No. </th>
                          <th>Product Description</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consumableData?.consumanleOrder.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center ">
                              <p className=" bg-white w-full p-2">
                                {index + 1}
                              </p>
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
                                className="p-2 w-full"
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
                                className="p-2 w-full"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!consumableData?.confirmed && (
                      <button
                        className="bg-green-400 disabled:bg-gray-400 hover:bg-green-600 font-semibold p-2 px-6 rounded-lg mt-4"
                        onClick={() => {
                          const orderData = {
                            ...consumableData,
                            confirmed: true,
                          };
                          // console.log(orderData);
                          setDoc(
                            doc(db, "DN-consumables", `${orderID}`),
                            orderData
                          );
                          alert("ConsumableOrder Confirmed");
                          router.back();
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
