import { PDFDownloadLink } from "@react-pdf/renderer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillFilePdf, AiOutlineFilePdf } from "react-icons/ai";
import { Text, View, Page, Document, StyleSheet } from "@react-pdf/renderer";
import { Fragment } from "react";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import Image from "next/image";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function DeliveryNote({
  orderType,
  orderID,
  setAddDeliverynote,
}) {
  const router = useRouter();

  const [viewMenu, setViewMenu] = useState(true);
  const [viewQuoteOrder, setViewQuoteOrder] = useState(true);
  const [loading, setLoading] = useState(true);
  const [DNNo, setDNNo] = useState(orderID);
  const [allProducts, setAllProducts] = useState([]);
  const [productsArr, setProductsArr] = useState([]);
  const [warehouseArr, setWarehouseArr] = useState([]);
  const date = new Date().toLocaleString();

  const fetchData = async (warehouseList) => {
    setLoading(true);
    const allShowroomData = [];
    try {
      for (const showroom of warehouseList) {
        const querySnapshot = await getDocs(
          collection(db, `erpag/Inventory`, showroom)
        );
        const requests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        allShowroomData.push({
          warehouseName: showroom,
          data: requests,
        });
        // console.log(1, allShowroomData);
      }
      const allData = allShowroomData.flatMap((entry) =>
        entry.data.map((client) => ({
          ...client,
          showroomName: entry.warehouseName,
        }))
      );
      // console.log(2, allData);
      setAllProducts(allData);
      const ids = allData.map((item) => {
        return { id: item?.id, name: item?.name };
      });
      console.log(3, ids);
      setProductsArr(ids);
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouse = async () => {
    try {
      const warehouses = await getDoc(doc(db, `erpag`, "AllWarehouses"));
      if (warehouses.data()?.data) {
        const valuesArray = warehouses.data()?.data?.map((obj) => obj.value);
        fetchData(valuesArray.sort());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);
  // Quote Order Section --------------------------------------------------
  const QuoteOrderSection = () => {
    const [toLocation1, setToLocation1] = useState("");
    const [fromLocation1, setFromLocation1] = useState("");
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
    const handleAdQuotedRow = () => {
      const row = {
        prodName: "",
        prodDesc: "",
        Qty: "",
        Size: "",
        Unit: "",
        Weight: "",
      };
      setQuoteOrder([...quoteOrder, row]);
    };
    const handleRemoveQuoteRow = (index) => {
      const list = [...quoteOrder];
      if (quoteOrder?.length > 1) {
        list.splice(-1);
        setQuoteOrder(list);
      }
    };
    // invoice component to be used for printing pdf file ------------------
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
              <Text>Prod. Name</Text>
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
        return quoteOrder.map((receipt, index) => (
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
      const Address = () => {
        return (
          <View style={styles.titleContainer}>
            <View style={styles.spaceBetween}>
              <View>
                <Text style={styles.invoiceNumber}>Date & Time - {date}</Text>
                <Text style={styles.invoiceNumber}>DN No. - {DNNo}</Text>
                <Text style={styles.invoiceNumber}>
                  From Location- {fromLocation1}
                </Text>
                <Text style={styles.invoiceNumber}>
                  To Location- {toLocation1}
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
            <Address />
            <TableHead />
            <TableBody />
          </Page>
        </Document>
      );
    };
    return (
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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const orderData = {
                date,
                DNNo,
                toLocation1,
                fromLocation1,
                quoteOrder,
                confirmed: false,
              };
              const updateStock = async () => {
                const combinedData = [];
                for (const order of quoteOrder) {
                  const matchingProduct = allProducts.filter(
                    (item) => item?.id === order?.prodName
                  )[0];
                  const { showroomName, id, quantity, ...rest } =
                    matchingProduct;
                  await setDoc(
                    doc(
                      db,
                      `erpag/Inventory/${showroomName}`,
                      `${order?.prodName}`
                    ),
                    {
                      ...rest,
                      quantity: Number(quantity) - Number(order?.Qty),
                    }
                  );
                }
              };
              updateStock();
              if (Number(orderType) === 0) {
                setDoc(
                  doc(db, "DN-quote-orders", `site-${orderID}`),
                  orderData
                );
              } else {
                setDoc(
                  doc(db, "DN-quote-orders", `retail-${orderID}`),
                  orderData
                );
              }
              enqueueSnackbar("QuoteOrder Sent to admin for confirmation", {
                variant: "success",
              });
              setTimeout(() => {
                setAddDeliverynote(false);
              }, 3500);
            } catch (error) {
              enqueueSnackbar("Some error occured", {
                variant: "error",
              });
            }
          }}
          className="flex flex-col items-center overflow-x-auto"
        >
          <div className="flex flex-col sm:flex-row pb-7 gap-16 w-full">
            <div className="flex flex-col w-full">
              <div className=" flex flex-col md:grid grid-cols-2 md:gap-4 ">
                <div>
                  <p className="mt-2">Date :</p>
                  <input
                    type="text"
                    value={date}
                    disabled
                    onChange={(e) => {}}
                    className=" p-2 disabled:bg-white w-full  "
                  />
                </div>
                <div>
                  <p className="mt-2">DN No.</p>
                  <input
                    type="text"
                    value={DNNo}
                    disabled
                    onChange={(e) => setDNNo(e.target.value)}
                    className=" p-2 disabled:bg-white w-full "
                  />
                </div>
              </div>

              <p className=" mt-3">From (dropdown for the site locations)</p>
              <select
                className=" p-2 w-full "
                value={fromLocation1}
                onChange={(e) => setFromLocation1(e.target.value)}
              >
                <option value="">select from site locations</option>
                <option value="location1">Loaction 1</option>
                <option value="location2">Location 2</option>
              </select>
              <p className=" mt-3">To (dropdown for the site locations)</p>
              <select
                className=" p-2 w-full"
                value={toLocation1}
                onChange={(e) => setToLocation1(e.target.value)}
              >
                <option value="">select To site locations</option>
                <option value="location1">Loaction 1</option>
                <option value="location2">Location 2</option>
              </select>
            </div>
          </div>
          <div className=" w-full">
            <table className=" custom-table ">
              <thead className=" custom-table-head">
                <tr>
                  <th className=" custom-table-row">Sl. No. </th>
                  <th className=" custom-table-row">Product Name</th>
                  <th className=" custom-table-row">Product Description</th>
                  <th className=" custom-table-row">Qty. Avl.</th>
                  <th className=" custom-table-row">Quantity</th>
                  <th className=" custom-table-row">Size</th>
                  <th className=" custom-table-row">Unit</th>
                  <th className=" custom-table-row">Weight (Tonnes)</th>
                </tr>
              </thead>
              <tbody>
                {quoteOrder.map((item, index) => (
                  <tr key={index}>
                    <td className=" custom-table-data text-center ">
                      <p className=" bg-white w-full p-2">{index + 1}</p>
                    </td>
                    <td>
                      <select
                        type="text"
                        value={item.prodName}
                        onChange={(e) => {
                          const list = [...quoteOrder];
                          list[index].prodName = e.target.value;
                          list[index].Unit = allProducts.filter((item) => {
                            return item?.id === [...quoteOrder][index].prodName;
                          })[0]?.UOM;
                          setQuoteOrder(list);
                        }}
                        className="custom-table-input"
                      >
                        <option value={""}>Select Product</option>
                        {productsArr?.map((item, index) => {
                          return (
                            <option key={index} value={item?.id}>
                              {item?.name}
                            </option>
                          );
                        })}
                      </select>
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
                        className="custom-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        disabled
                        value={Number(
                          allProducts.filter((item) => {
                            return item?.id === [...quoteOrder][index].prodName;
                          })[0]?.quantity
                        )}
                        onChange={(e) => {
                          const list = [...quoteOrder];
                          list[index].Qty = e.target.value;
                          setQuoteOrder(list);
                        }}
                        className="custom-table-input disabled:bg-white"
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={item.Qty}
                        required
                        min="1"
                        max={
                          allProducts.filter((item) => {
                            return item?.id === [...quoteOrder][index].prodName;
                          })[0]?.quantity
                        }
                        onChange={(e) => {
                          const list = [...quoteOrder];
                          list[index].Qty = e.target.value;
                          setQuoteOrder(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.Size}
                        required
                        onChange={(e) => {
                          const list = [...quoteOrder];
                          list[index].Size = e.target.value;
                          setQuoteOrder(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={
                          allProducts.filter((item) => {
                            return item?.id === [...quoteOrder][index].prodName;
                          })[0]?.UOM
                        }
                        disabled
                        onChange={(e) => {
                          const list = [...quoteOrder];
                          list[index].Unit = allProducts.filter((item) => {
                            return item?.id === [...quoteOrder][index].prodName;
                          })[0]?.UOM;
                          setQuoteOrder(list);
                        }}
                        className="custom-table-input disabled:bg-white"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.Weight}
                        required
                        onChange={(e) => {
                          const list = [...quoteOrder];
                          list[index].Weight = e.target.value;
                          setQuoteOrder(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="  w-full flex items-center justify-center gap-3 mt-2">
              <button
                type="button"
                className="add-row-btn"
                onClick={handleAdQuotedRow}
              >
                + Add Row
              </button>
              <button
                className="delete-row-btn"
                type="button"
                onClick={() => handleRemoveQuoteRow()}
              >
                Remove
              </button>
            </div>
            <div className="  w-full flex items-center justify-center">
              <button
                disabled={fromLocation1 === "" || toLocation1 === ""}
                type="submit"
                className="bg-green-400 disabled:bg-gray-400 hover:bg-green-600 font-semibold p-2 px-6 rounded-lg mt-4"
              >
                Send to Admin for Confirmation
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };
  // Consumable Section --------------------------------------------------
  const ConsumableSection = ({}) => {
    const [toLocation1, setToLocation1] = useState("");
    const [fromLocation1, setFromLocation1] = useState("");
    const [consumanleOrder, setConsumableOrder] = useState([
      {
        prodName: "",
        prodDesc: "",
        Qty: "",
      },
    ]);

    const handleAdConsumeabledRow = () => {
      const row = {
        prodName: "",
        prodDesc: "",
        Qty: "",
      };
      setConsumableOrder([...consumanleOrder, row]);
    };
    const handleRemoveConsumableRow = (index) => {
      const list = [...consumanleOrder];
      if (consumanleOrder?.length > 1) {
        list.splice(-1);
        setConsumableOrder(list);
      }
    };
    // invoice component to be used for printing pdf file ------------------
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
              <Text>Prod. Name</Text>
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

      const TableBody2 = () => {
        return consumanleOrder.map((receipt, index) => (
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
                  From Location- {fromLocation1}
                </Text>
                <Text style={styles.invoiceNumber}>
                  To Location- {toLocation1}
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
            <Address />
            <TableHead />
            <TableBody2 />
          </Page>
        </Document>
      );
    };
    return (
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
              <div className=" flex flex-col md:grid grid-cols-2 md:gap-4 ">
                <div>
                  <p className="mt-2">Date :</p>
                  <input
                    type="text"
                    value={date}
                    disabled
                    onChange={(e) => {}}
                    className=" p-2 disabled:bg-white w-full  "
                  />
                </div>
                <div>
                  <p className="mt-2">DN No.</p>
                  <input
                    type="text"
                    value={DNNo}
                    disabled
                    onChange={(e) => setDNNo(e.target.value)}
                    className=" p-2 disabled:bg-white w-full "
                  />
                </div>
              </div>

              <p className=" mt-3">From (dropdown for the site locations)</p>
              <select
                className="p-2 w-full "
                value={fromLocation1}
                onChange={(e) => setFromLocation1(e.target.value)}
              >
                <option value="">select from site locations</option>
                <option value="location1">Loaction 1</option>
                <option value="location2">Location 2</option>
              </select>
              <p className=" mt-3">To (dropdown for the site locations)</p>
              <select
                className="p-2 w-full "
                value={toLocation1}
                onChange={(e) => setToLocation1(e.target.value)}
              >
                <option value="">select To site locations</option>
                <option value="location1">Loaction 1</option>
                <option value="location2">Location 2</option>
              </select>
            </div>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const orderData = {
                  date,
                  DNNo,
                  toLocation1,
                  fromLocation1,
                  consumanleOrder,
                  confirmed: false,
                };

                const updateStock = async () => {
                  const combinedData = [];
                  for (const order of consumanleOrder) {
                    const matchingProduct = allProducts.filter(
                      (item) => item?.id === order?.prodName
                    )[0];
                    const { showroomName, id, quantity, ...rest } =
                      matchingProduct;
                    await setDoc(
                      doc(
                        db,
                        `erpag/Inventory/${showroomName}`,
                        `${order?.prodName}`
                      ),
                      {
                        ...rest,
                        quantity: Number(quantity) - Number(order?.Qty),
                      }
                    );
                  }
                };
                updateStock();
                if (Number(orderType) === 0) {
                  setDoc(
                    doc(db, "DN-consumables", `site-${orderID}`),
                    orderData
                  );
                } else {
                  setDoc(
                    doc(db, "DN-consumables", `retail-${orderID}`),
                    orderData
                  );
                }
                // setDoc(doc(db, "DN-consumables", `${orderID}`), orderData);
                enqueueSnackbar("DN Sent to admin for confirmation", {
                  variant: "success",
                });
                setTimeout(() => {
                  setAddDeliverynote(false);
                }, 3500);
              } catch (error) {
                enqueueSnackbar("Some error occured", {
                  variant: "error",
                });
              }
            }}
            className=" w-full overflow-x-auto"
          >
            <table className="custom-table">
              <thead className=" custom-table-head">
                <tr>
                  <th className=" custom-table-row">Sl. No. </th>
                  <th className=" custom-table-row">Product Name</th>
                  <th className=" custom-table-row">Product Description</th>
                  <th className=" custom-table-row">Avl. Qty.</th>
                  <th className=" custom-table-row">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {consumanleOrder.map((item, index) => (
                  <tr key={index}>
                    <td className=" custom-table-data text-center ">
                      <p className=" bg-white w-full p-2">{index + 1}</p>
                    </td>
                    <td>
                      <select
                        type="text"
                        value={item.prodName}
                        onChange={(e) => {
                          const list = [...consumanleOrder];
                          list[index].prodName = e.target.value;
                          setConsumableOrder(list);
                        }}
                        className="custom-table-input"
                      >
                        <option value={""}>Select Product</option>
                        {productsArr?.map((item, index) => {
                          return (
                            <option key={index} value={item?.id}>
                              {item?.name}
                            </option>
                          );
                        })}
                      </select>
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
                        className="custom-table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        disabled
                        value={Number(
                          allProducts.filter((item) => {
                            return (
                              item?.id === [...consumanleOrder][index].prodName
                            );
                          })[0]?.quantity
                        )}
                        onChange={(e) => {
                          const list = [...consumanleOrder];
                          list[index].Qty = e.target.value;
                          setConsumableOrder(list);
                        }}
                        className="custom-table-input disabled:bg-white"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.Qty}
                        required
                        min="1"
                        max={
                          allProducts.filter((item) => {
                            return (
                              item?.id === [...consumanleOrder][index].prodName
                            );
                          })[0]?.quantity
                        }
                        onChange={(e) => {
                          const list = [...consumanleOrder];
                          list[index].Qty = e.target.value;
                          setConsumableOrder(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="  flex items-center justify-center gap-3 mt-2">
              <button
                type="button"
                className="add-row-btn"
                onClick={handleAdConsumeabledRow}
              >
                + Add Row
              </button>
              <button
                className="delete-row-btn"
                type="button"
                onClick={() => handleRemoveConsumableRow()}
              >
                Remove
              </button>
            </div>
            <div className="  flex items-center justify-center">
              <button
                disabled={fromLocation1 === "" || toLocation1 === ""}
                type="submit"
                className="bg-green-400 disabled:bg-gray-400 hover:bg-green-600 font-semibold p-2 px-6 rounded-lg mt-4"
              >
                Send to Admin for Confirmation
              </button>
            </div>
          </form>
        </div>
      </div>
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
      {loading ? (
        <div className=" w-full flex items-center justify-center">
          <Image width={50} height={50} src="/loading.svg" alt="Loading ..." />
        </div>
      ) : (
        <div>
          <div className="w-full md:pl-6 pr-12 flex justify-between">
            <button
              className=" go-back-btn"
              onClick={() => {
                if (!viewMenu) {
                  setViewMenu(true);
                } else {
                  setAddDeliverynote(false);
                }
              }}
            >
              Go Back
            </button>
          </div>
          <div className="flex flex-col items-center">
            <p className="page-heading">Delivery Note</p>
            {viewMenu && (
              <div className=" flex flex-col gap-2 md:mt-6">
                <button
                  onClick={() => {
                    setViewMenu(false);
                    setViewQuoteOrder(true);
                  }}
                  className=" bg-blue-500 hover:bg-blue-600 py-2 px-8 text-white font-semibold text-sm md:text-base"
                >
                  Quote Order
                </button>
                <button
                  onClick={() => {
                    setViewMenu(false);
                    setViewQuoteOrder(false);
                  }}
                  className=" bg-blue-500 hover:bg-blue-600 py-2 px-8 text-white font-semibold text-sm md:text-base"
                >
                  Consumables
                </button>
              </div>
            )}
            {!viewMenu && (
              <>
                {viewQuoteOrder ? <QuoteOrderSection /> : <ConsumableSection />}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
