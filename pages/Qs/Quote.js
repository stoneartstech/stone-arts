import { useEffect, useRef, useState } from "react";
import { AiTwotoneFilePdf } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import { Text, View, Page, Document, StyleSheet } from "@react-pdf/renderer";
import { Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { deleteDoc } from "firebase/firestore";

export default function Quote({ setQuotePdfUrl, quoteData, setIsQuote }) {
  const targetRef = useRef();

  const [total, setTotal] = useState(0);
  const [rowCount, setRowCount] = useState(1);

  const [data, setData] = useState([
    {
      id: 1,
      image: "",
      description: "",
      size: "",
      type: "",
      quantity: "",
      unit: "",
      rate: "",
      amount: "",
      discount: "",
      total: "",
    },
  ]);

  const calculateSumTotal = () => {
    const sum = data.reduce((accumulator, row) => {
      const total = parseFloat(row.total);
      return isNaN(total) ? accumulator : accumulator + total;
    }, 0);
    setTotal(sum);
  };

  const addRow = () => {
    const newRow = {
      id: rowCount + 1,
      image: "",
      description: "",
      size: "",
      type: "",
      quantity: "",
      unit: "",
      rate: "",
      amount: "",
      discount: "",
      total: "",
    };
    setData([...data, newRow]);
    setRowCount(rowCount + 1);
    console.log(data);
  };

  const handleQuoteChange = (e, id) => {
    const { name, value } = e.target;
    setData((prevData) =>
      prevData.map((row) => (row.id === id ? { ...row, [name]: value } : row))
    );
  };

  useEffect(() => {
    calculateSumTotal();
  }, [handleQuoteChange, rowCount]);

  const CurrDate = new Date();

  const handleUploadQuoteImages = async (qsId, event) => {
    const file = event.target.files[0];
    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(
        storage,
        `QuoteImages/${quoteData.id} + "-" + ${qsId}`
      );
      await uploadBytes(storageRef, file);

      // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      // await console.log(downloadURL);
      await deleteDoc((prevData) =>
        prevData.map((row) =>
          row.id === qsId ? { ...row, image: downloadURL } : row
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const params = useSearchParams();
  var dbName = params.get("param");

  const handleShare = async (url, blob) => {
    try {
      const storageRef = ref(
        storage,
        `PdfQuotes/${dbName.slice(0, 3)}/${quoteData.id}.pdf`
      );

      // // Upload the blob to Firebase Storage
      const uploadTaskSnapshot = await uploadBytes(storageRef, blob);

      // // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      setQuotePdfUrl({ id: quoteData.id, link: downloadURL });
      // alert(downloadURL);
      alert("Uploaded");
    } catch (error) {
      console.log(error);
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
            <Text>Desc.</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Size</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Ar. Type</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Quantity</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Unit</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Rate</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Amount</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Discount</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Total</Text>
          </View>
        </View>
      );
    };

    const TableBody = () => {
      return data.map((receipt) => (
        <Fragment key={receipt.id}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={[styles.tbody]}>
              <Text>{receipt.id}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.description}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.size}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.type}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.quantity}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.unit}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.rate}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.amount}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.discount}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.total}</Text>
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
              <Text style={styles.invoiceNumber}>
                P. INV - {quoteData?.id}/{CurrDate.getFullYear()}
              </Text>
              <Text style={styles.invoiceNumber}>
                DATE - {CurrDate.getDate()}/{CurrDate.getMonth() + 1}/
                {CurrDate.getFullYear()}
              </Text>
              <Text style={styles.invoiceNumber}>
                Client Name- {quoteData?.name} {quoteData?.lastname}
              </Text>
              <Text style={styles.invoiceNumber}>
                Location- {quoteData?.address}
              </Text>
            </View>
          </View>
        </View>
      );
    };

    const TableTotal = () => {
      return (
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={styles.total}>
            <Text>Total</Text>
          </View>
          <View style={styles.total}>
            <Text> $ {total}</Text>
          </View>
          <View style={styles.tbody}>
            <Text>Grand Total</Text>
          </View>
          <View style={styles.tbody}>
            <Text>$ {total - 100 + total * 0.16}</Text>
          </View>
        </View>
      );
    };

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <InvoiceTitle />
          <Address />
          <TableHead />
          <TableBody />
          <TableTotal />
        </Page>
      </Document>
    );
  };

  return (
    <>
      <div className=" absolute inset-0 z-50 flex items-center justify-center w-full min-h-[100vh] h-fit bg-black/60">
        <div className=" actual-receipt min-w-[90%] min-h-[90vh] relative h-fit p-7 bg-white flex flex-col justify-center items-center">
          <IoClose
            onClick={() => {
              setIsQuote(false);
            }}
            className=" absolute top-0.5 right-0.5 text-[27px] text-black cursor-pointer "
          />

          <div className=" flex-col flex gap-3 py-5 px-7 border border-black w-full">
            <p className=" wf text-center font-medium text-lg">Quote</p>
            <div className=" flex items-center justify-between">
              <div className=" flex flex-col gap-3">
                <p className=" font-semibold">
                  P. INV
                  <span className=" font-medium px-2 py-1 ml-2 border-[1.5px] border-black">
                    {quoteData?.id}/{CurrDate.getFullYear()}
                  </span>
                </p>
                <p className=" font-semibold">
                  DATE
                  <span className=" font-medium px-2 py-1 ml-2 border-[1.5px] border-black">
                    {CurrDate.getDate()}/{CurrDate.getMonth() + 1}/
                    {CurrDate.getFullYear()}
                  </span>
                </p>
              </div>
              <PDFDownloadLink
                document={<Invoice />}
                fileName={`${quoteData.id + "-" + quoteData.name}-quote.pdf`}
              >
                <AiTwotoneFilePdf className=" text-[40px] cursor-pointer " />
              </PDFDownloadLink>
            </div>
            <div className=" flex flex-col gap-3 mt-5">
              <p className=" font-semibold">
                Client Name:
                <span className=" font-medium px-2 py-1 ml-2 border-[1.5px] border-black">
                  {quoteData?.name} {quoteData?.lastname}
                </span>
              </p>
              {/* {console.log(quoteData)} */}
              <p className=" font-semibold">
                Site Location:
                <span className=" font-medium px-2 py-1 ml-2 border-[1.5px] border-black">
                  {quoteData?.address}
                </span>
              </p>
            </div>
            <div className=" flex items-center justify-between">
              <button
                onClick={addRow}
                className=" bg-green-400 hover:bg-green-500 w-fit rounded-md text-white font-semibold py-1 px-5"
              >
                Add Row
              </button>
              <BlobProvider document={<Invoice />}>
                {({ url, blob }) => (
                  <button
                    onClick={() => handleShare(url, blob)}
                    className=" bg-green-400 hover:bg-green-500 w-fit rounded-md
                    text-white font-semibold py-1 px-5"
                  >
                    {/* {console.log(blob)} */}
                    Upload
                  </button>
                )}
              </BlobProvider>
            </div>
            <table>
              <thead className=" text-[14.5px] bg-blue-500 text-white ">
                <tr>
                  <th className=" px-3 py-2 border border-white">Serial No.</th>
                  <th className=" px-3 border border-white">Image Upload</th>
                  <th className=" px-3 border border-white">Description</th>
                  <th className=" px-3 border border-white">Size</th>
                  <th className=" px-3 border border-white">
                    Article Type(retail/measurement )
                  </th>
                  <th className=" px-3 border border-white">Quantity</th>
                  <th className=" px-3 border border-white">Unit</th>
                  <th className=" px-3 border border-white">Rate</th>
                  <th className=" px-3 border border-white">Amount</th>
                  <th className=" px-3 border border-white">Discount</th>
                  <th className=" px-3 border border-white">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className=" even:bg-slate-300 odd:bg-slate-200"
                    >
                      <td className=" text-center border border-white ">
                        {item.id}
                      </td>
                      <td className=" flex items-center justify-center border border-white">
                        <input
                          className=" w-[100px]  "
                          type="file"
                          id={`image-${item}`}
                          name="image"
                          value={item.name}
                          onChange={(e) => {
                            handleUploadQuoteImages(item.id, e);
                          }}
                          autoComplete="off"
                        />
                      </td>
                      <td className="mx-auto border border-white ">
                        <input
                          className=" border border-black text-sm w-[80px]  "
                          type="text"
                          id="description"
                          name="description"
                          value={item.name}
                          onChange={(e) => handleQuoteChange(e, item.id)}
                          autoComplete="off"
                        />
                      </td>
                      <td className="mx-auto border border-white ">
                        <input
                          className=" border border-black text-sm w-[80px]  "
                          type="text"
                          id="size"
                          name="size"
                          value={item.name}
                          onChange={(e) => handleQuoteChange(e, item.id)}
                          autoComplete="off"
                        />
                      </td>
                      <td className=" ">
                        <input
                          className=" border border-black mx-auto text-sm w-[250px]  "
                          type="text"
                          id="type"
                          name="type"
                          value={item.name}
                          onChange={(e) => handleQuoteChange(e, item.id)}
                          autoComplete="off"
                        />
                      </td>
                      <td className=" mx-auto border border-white ">
                        <input
                          className=" border border-black text-sm w-[80px]  "
                          type="text"
                          id="quantity"
                          name="quantity"
                          value={item.name}
                          onChange={(e) => handleQuoteChange(e, item.id)}
                          autoComplete="off"
                        />
                      </td>
                      <td className="mx-auto border border-white ">
                        <input
                          className=" border border-black text-sm w-[80px]  "
                          type="text"
                          id="unit"
                          name="unit"
                          value={item.name}
                          onChange={(e) => handleQuoteChange(e, item.id)}
                          autoComplete="off"
                        />
                      </td>
                      <td className="mx-auto border border-white ">
                        <input
                          className=" border border-black text-sm w-[80px]  "
                          type="text"
                          id="rate"
                          name="rate"
                          value={item.name}
                          onChange={(e) => handleQuoteChange(e, item.id)}
                          autoComplete="off"
                        />
                      </td>
                      <td className="mx-auto border border-white ">
                        <input
                          className=" border border-black text-sm w-[80px]  "
                          type="text"
                          id="amount"
                          name="amount"
                          value={item.name}
                          onChange={(e) => handleQuoteChange(e, item.id)}
                          autoComplete="off"
                        />
                      </td>
                      <td className="mx-auto border border-white ">
                        <input
                          className=" border border-black text-sm w-[80px]  "
                          type="text"
                          id="discount"
                          name="discount"
                          value={item.name}
                          onChange={(e) => handleQuoteChange(e, item.id)}
                          autoComplete="off"
                        />
                      </td>
                      <td className="">
                        <input
                          className=" border border-black text-sm w-[100px]  "
                          type="text"
                          id="total"
                          name="total"
                          value={item.name}
                          onChange={(e) => handleQuoteChange(e, item.id)}
                          autoComplete="off"
                        />
                      </td>
                    </tr>
                  );
                })}

                <tr className=" bg-orange-100">
                  <td>Total</td>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
                    return <td key={index}></td>;
                  })}
                  <td className=" text-center">$ {total}</td>
                </tr>
                <tr className=" bg-orange-100">
                  <td>Discount</td>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
                    return <td key={index}></td>;
                  })}
                  <td className=" text-center">-{total !== 0 ? 100 : 0}</td>
                </tr>
                <tr className=" bg-orange-100">
                  <td>VAT(16%)</td>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
                    return <td key={index}></td>;
                  })}
                  <td className=" text-center">+{(0.16 * total).toFixed(2)}</td>
                </tr>
                <tr className=" bg-orange-100">
                  <td className=" font-bold">Grand Total</td>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => {
                    return <td key={index}></td>;
                  })}
                  <td className=" font-bold text-center">
                    ${total !== 0 ? total - 100 + 0.16 * total : "0"}
                  </td>
                </tr>
              </tbody>
            </table>

            <p className=" font-semibold text-xs text-center mt-2">
              <a href="/Conditions.pdf" target="_blank">
                Conditions Apply
              </a>
              <a download="Conditions" href="/Conditions.pdf" target="_blank">
                -<span className=" ">Download file here</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
