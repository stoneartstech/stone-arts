import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { db, storage } from "../../firebase";
import { setDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/firebase";
import { IoAddCircle, IoAddCircleOutline } from "react-icons/io5";
import {
  AiFillMinusCircle,
  AiOutlineMinusCircle,
  AiTwotoneFilePdf,
} from "react-icons/ai";
import { Fragment } from "react";
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import { Text, View, Page, Document, StyleSheet } from "@react-pdf/renderer";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function JobCard() {
  const router = useRouter();
  const { query } = router;
  const { qsName, clientId, clientName, type } = query;
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
  const weekEnd = ("0" + currentDate.getDate()).slice(-2);
  const weekStart = ("0" + currentDate.getDate()).slice(-2) - 7;
  //   // console.log(`${date}-${month}-${year}`);

  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);

  const time = hours + "-" + minutes + "-" + seconds;

  // Concatenate date and time components to form the invoice number
  const invoiceNumber = `${day}-${month}-${year}-${hours}-${minutes}`;

  //   alert(invoiceNumber);
  const [supervisorName, setSupervisorName] = useState("");
  const [fundiData, setFundiData] = useState([
    {
      name: "",
    },
  ]);

  const [siteCode, setSiteCode] = useState("");
  const [siteName, setSiteName] = useState("");
  const [JobCardNo, setJobCardNo] = useState("");
  const [QuoteNo, setQuoteNo] = useState("");
  const [QuoteDate, setQuoteDate] = useState("");
  const [SiteLocation, setSiteLocation] = useState("");
  const [Qs, setQs] = useState(qsName);
  const [QuoteApprovedDate, setQuoteApprovedDate] = useState("");
  const [SiteSchedule, setSiteSchedule] = useState("");
  const [SiteStart, setSiteStart] = useState("");
  const [SiteCompletion, setSiteCompletion] = useState("");
  const [SiteSupervisor, setSiteSupervisor] = useState("");
  //   const [fundi, setFuni] = useState(fundiData);

  const [report1, setReport1] = useState([
    {
      SNo: 1,
      Area: "",
      DescriptionOfWork: "",
      Size: "",
      Qty: "",
      Units: "",
      DelNo: "",
      DateOfDel: "",
      QualityByWSM: "",
    },
  ]);

  const handleAddFundi = () => {
    const newFundi = {
      name: "",
    };
    setFundiData([...fundiData, newFundi]);
  };
  const handleRemoveFundi = (index) => {
    if (fundiData.length > 1) {
      const list = [...fundiData];
      list.splice(-1);
      setFundiData(list);
    }
  };
  const handleAddRow1 = () => {
    const row = {
      SNo: report1.length + 1,
      Area: "",
      DescriptionOfWork: "",
      Size: "",
      Qty: "",
      Units: "",
      DelNo: "",
      DateOfDel: "",
      QualityByWSM: "",
    };
    setReport1([...report1, row]);
  };
  const handleRemoveRow1 = (index) => {
    if (report1.length > 1) {
      const list = [...report1];
      list.splice(-1);
      setReport1(list);
    }
  };
  const [report2, setReport2] = useState([
    {
      SNo: 1,
      Area: "",
      DescriptionOfWork: "",
      Size: "",
      Qty: "",
      Units: "",
      DelNo: "",
      DateOfDel: "",
      QualityByWSM: "",
    },
  ]);

  const handleAddRow2 = () => {
    const row = {
      SNo: report1.length + 1,
      Area: "",
      DescriptionOfWork: "",
      Size: "",
      Qty: "",
      Units: "",
      DelNo: "",
      DateOfDel: "",
      QualityByWSM: "",
    };
    setReport2([...report2, row]);
  };
  const handleRemoveRow2 = (index) => {
    if (report2.length > 1) {
      const list = [...report2];
      list.splice(-1);
      setReport2(list);
    }
  };
  const fetchData = async () => {
    const result = await getDoc(
      doc(db, `PMTReports/PendingSiteReport/JobCards/${clientId}`)
    );
    const data = result.data();
    if (data) {
      setSiteCode(data?.siteCode);
      setSiteName(data?.siteName);
      setJobCardNo(data?.JobCardNo);
      setQuoteNo(data?.QuoteNo);
      setQuoteDate(data?.QuoteDate);
      setSiteLocation(data?.SiteLocation);
      setQuoteApprovedDate(data?.QuoteApprovedDate);
      setSiteSchedule(data?.SiteSchedule);
      setSiteStart(data?.SiteStart);
      setSiteCompletion(data?.SiteCompletion);
      setSiteSupervisor(data?.SiteSupervisor);
      setFundiData(data?.FundiData);
      setReport1(data?.StandardData);
      setReport2(data?.NonStandardData);
    }
  };
  useEffect(() => {
    if (type?.toLowerCase() === "view") {
      fetchData();
    }
  }, []);
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
            <Text>Area</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Description Of Work</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Size</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Qty</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Units</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Del No.</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Date of Del</Text>
          </View>
          <View style={[styles.theader, styles.theader2]}>
            <Text>Q. by WSM</Text>
          </View>
        </View>
      );
    };

    const TableBody1 = () => {
      return report1.map((receipt) => (
        <Fragment key={receipt.id}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={[styles.tbody]}>
              <Text>{receipt.SNo}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Area}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.DescriptionOfWork}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Size}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Qty}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Units}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.DelNo}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.DateOfDel}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.QualityByWSM}</Text>
            </View>
          </View>
        </Fragment>
      ));
    };
    const TableBody2 = () => {
      return report2.map((receipt) => (
        <Fragment key={receipt.id}>
          <View style={{ width: "100%", flexDirection: "row" }}>
            <View style={[styles.tbody]}>
              <Text>{receipt.SNo}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Area}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.DescriptionOfWork}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Size}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Qty}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.Units}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.DelNo}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.DateOfDel}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{receipt.QualityByWSM}</Text>
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
              <Text style={styles.invoiceNumber}>siteCode: {siteCode},</Text>
              <Text style={styles.invoiceNumber}>siteName: {siteName},</Text>
              <Text style={styles.invoiceNumber}>JobCardNo: {JobCardNo},</Text>
              <Text style={styles.invoiceNumber}>QuoteNo: {QuoteNo},</Text>
              <Text style={styles.invoiceNumber}>QuoteDate: {QuoteDate},</Text>
              <Text style={styles.invoiceNumber}>
                SiteLocation: {SiteLocation},
              </Text>
              <Text style={styles.invoiceNumber}>Qs: {Qs},</Text>
              <Text style={styles.invoiceNumber}>
                QuoteApprovedDate: {QuoteApprovedDate},
              </Text>
              <Text style={styles.invoiceNumber}>
                SiteSchedule: {SiteSchedule},
              </Text>
              <Text style={styles.invoiceNumber}>SiteStart: {SiteStart},</Text>
              <Text style={styles.invoiceNumber}>
                SiteCompletion: {SiteCompletion},
              </Text>
              <Text style={styles.invoiceNumber}>
                SiteSupervisor: {SiteSupervisor},
              </Text>
              <Text style={styles.invoiceNumber}>
                FundiData:{" "}
                {fundiData.map((item, index) => {
                  return (
                    <Text key={index} style={styles.invoiceNumber}>
                      {`Fundi-${index + 1}`}: {item?.name},
                    </Text>
                  );
                })}
              </Text>
              <Text style={styles.invoiceNumber}>date: {date},</Text>
            </View>
          </View>
        </View>
      );
    };

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <InvoiceTitle />
          <Text style={styles.reportTitle}>
            Job Card-{siteCode} - {siteName}
          </Text>
          <Address />
          <Text style={styles.reportTitle}>Standard</Text>
          <TableHead />
          <TableBody1 />
          <Text style={styles.reportTitle}>Non-Standard</Text>
          <TableHead />
          <TableBody2 />
        </Page>
      </Document>
    );
  };

  return (
    <div>
      {" "}
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
      <div className="w-full md:pl-8">
        <button
          className="bg-slate-300 p-2 rounded-lg"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <p className="mt-2 text-2xl text-center font-bold mb-6">
        {" "}
        {type?.toLowerCase() !== "view" ? "Upload" : "View"}Job Card
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            setDoc(
              doc(db, `PMTReports/PendingSiteReport/JobCards/${clientId}`),
              {
                siteCode: siteCode,
                siteName: siteName,
                JobCardNo: JobCardNo,
                QuoteNo: QuoteNo,
                QuoteDate: QuoteDate,
                SiteLocation: SiteLocation,
                Qs: Qs,
                QuoteApprovedDate: QuoteApprovedDate,
                SiteSchedule: SiteSchedule,
                SiteStart: SiteStart,
                SiteCompletion: SiteCompletion,
                SiteSupervisor: SiteSupervisor,
                FundiData: fundiData,
                StandardData: report1,
                NonStandardData: report2,
                date: date,
              }
            );
            enqueueSnackbar(`Job Card Uploaded Successfully`, {
              variant: "success",
            });
            setTimeout(() => {
              router.back();
            }, 1500);
          } catch (error) {
            enqueueSnackbar("Some error occured", {
              variant: "error",
            });
            console.error(error);
          }
        }}
        className="max-w-full py-4 border border-black px-2 overflow-auto"
      >
        <div>
          <div className=" flex items-center  w-full">
            <div className="  w-full  ">
              {/* {data?.map((item, index) => { */}
              {/* return ( */}
              <div className=" grid grid-cols-1 md:grid-cols-4  w-full  ">
                <div className=" flex flex-col  font-semibold p-0.5 ">
                  <label className=" font-medium capitalize">SiteCode</label>
                  <input
                    required
                    type="text"
                    className=" border border-black w-[200px] p-1.5"
                    value={siteCode}
                    placeholder={"Site Code"}
                    onChange={(e) => {
                      setSiteCode(e.target.value);
                    }}
                  />
                </div>
                <div className=" flex flex-col  font-semibold p-0.5 ">
                  <label className=" font-medium capitalize">Site Name</label>
                  <input
                    required
                    type="text"
                    className=" border border-black w-[200px] p-1.5"
                    value={siteName}
                    placeholder={"Site Name"}
                    onChange={(e) => {
                      setSiteName(e.target.value);
                    }}
                  />
                </div>
                <div className=" flex flex-col  font-semibold p-0.5 ">
                  <label className=" font-medium capitalize">Job Card No</label>
                  <input
                    required
                    type="text"
                    className=" border border-black w-[200px] p-1.5"
                    value={JobCardNo}
                    placeholder={"Job card No"}
                    onChange={(e) => {
                      setJobCardNo(e.target.value);
                    }}
                  />
                </div>
                <div className=" flex flex-col  font-semibold p-0.5 ">
                  <label className=" font-medium capitalize">Quote No</label>
                  <input
                    required
                    type="text"
                    className=" border border-black w-[200px] p-1.5"
                    value={QuoteNo}
                    placeholder={"Quote No"}
                    onChange={(e) => {
                      setQuoteNo(e.target.value);
                    }}
                  />
                </div>
                <div className=" flex flex-col  font-semibold p-0.5 ">
                  <label className=" font-medium capitalize">Quote Date</label>
                  <input
                    required
                    type="date"
                    className=" border border-black w-[200px] p-1.5"
                    value={QuoteDate}
                    placeholder={"Job card No"}
                    onChange={(e) => {
                      setQuoteDate(e.target.value);
                    }}
                  />
                </div>
                <div className=" flex flex-col  font-semibold p-0.5 ">
                  <label className=" font-medium capitalize">
                    Site Location
                  </label>
                  <input
                    required
                    type="text"
                    className=" border border-black w-[200px] p-1.5"
                    value={SiteLocation}
                    placeholder={"Site Location"}
                    onChange={(e) => {
                      setSiteLocation(e.target.value);
                    }}
                  />
                </div>
                <div className=" flex flex-col  font-semibold p-0.5 ">
                  <label className=" font-medium capitalize">Qs</label>
                  <input
                    required
                    type="text"
                    className=" border border-black w-[200px] p-1.5"
                    value={Qs}
                    disabled
                    placeholder={"Qs"}
                    onChange={(e) => {
                      setQs(e.target.value);
                    }}
                  />
                </div>
                <div className=" flex flex-col  font-semibold p-0.5 ">
                  <label className=" font-medium capitalize">
                    Quote Approved Date
                  </label>
                  <input
                    required
                    type="date"
                    className=" border border-black w-[200px] p-1.5"
                    value={QuoteApprovedDate}
                    placeholder={"Job card No"}
                    onChange={(e) => {
                      setQuoteApprovedDate(e.target.value);
                    }}
                  />
                </div>
                <div className=" flex items-center  font-semibold p-0.5 ">
                  <label className=" font-medium capitalize">
                    Site Scheduled ?
                  </label>
                  <input
                    type="checkbox"
                    className=" border border-black  ml-2 p-1.5"
                    value={SiteSchedule}
                    placeholder={"Job card No"}
                    onChange={(e) => {
                      setSiteSchedule((prev) => (prev === true ? false : true));
                    }}
                  />
                </div>
                <div className=" flex flex-col  font-semibold p-0.5 ">
                  <label className=" font-medium capitalize">Site Start</label>
                  <input
                    required
                    type="date"
                    className=" border border-black w-[200px] p-1.5"
                    value={SiteStart}
                    placeholder={"Job card No"}
                    onChange={(e) => {
                      setSiteStart(e.target.value);
                    }}
                  />
                </div>
                <div className=" flex  flex-col font-semibold p-0.5 ">
                  <label className=" font-medium capitalize">
                    Site Completion
                  </label>
                  <input
                    required
                    type="date"
                    className=" border border-black w-[200px] p-1.5"
                    value={SiteCompletion}
                    placeholder={"Site Completion date"}
                    onChange={(e) => {
                      setSiteCompletion(e.target.value);
                    }}
                  />
                </div>
                <div className=" flex  flex-col font-semibold mt-3 border border-black p-3 w-fit h-[200px] overflow-y-auto ">
                  <label className=" font-medium mt-2 mb-1 capitalize">
                    Stone Arts Team
                  </label>
                  <label className=" font-medium capitalize">
                    Site Supervisor
                  </label>
                  <input
                    required
                    type="text"
                    className=" border border-black w-full mb-1 p-1.5"
                    value={SiteSupervisor}
                    placeholder={"Site Supervisor Name"}
                    onChange={(e) => {
                      setSiteSupervisor(e.target.value);
                    }}
                  />
                  {fundiData.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className=" flex mt-0.5 font-semibold w-fit "
                      >
                        <label className=" font-medium mt-2 mb-1 capitalize">
                          Fundi {index + 1}
                        </label>

                        <input
                          required
                          type="text"
                          className=" border border-black w-[200px] p-1.5"
                          value={item.name}
                          placeholder={`Fundi ${index + 1} Name`}
                          onChange={(e) => {
                            const list = [...fundiData];
                            list[index].name = e.target.value;
                            setFundiData(list);
                          }}
                        />
                      </div>
                    );
                  })}
                  <div className=" flex items-center gap-1">
                    <IoAddCircleOutline
                      onClick={handleAddFundi}
                      className=" cursor-pointer text-[19px]"
                    />
                    <AiOutlineMinusCircle
                      onClick={handleRemoveFundi}
                      className=" cursor-pointer text-[19px]"
                    />
                  </div>
                </div>
              </div>
              {/* );
              })} */}
            </div>
          </div>
        </div>
        {/* table 1---------------------------------------------------------------- */}
        <div className=" relative mt-14 pb-4">
          <p className="mt-2 text-2xl text-center font-bold mb-6">
            Standard (Non-Fabrication)
          </p>
          <table className="mt-6 table-auto">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-2 border-gray-400 border">Sl. No.</th>
                <th className="px-2 border-gray-400 border">Area</th>
                <th className="px-2 border-gray-400 border">
                  Description of Work
                </th>
                <th className="px-2 border-gray-400 border">Size</th>
                <th className="px-2 border-gray-400 border">Qty</th>
                <th className="px-2 border-gray-400 border">Units</th>
                <th className="px-2 border-gray-400 border">Del No.</th>
                <th className="px-2 border-gray-400 border">Date of Del </th>
                <th className="px-2 border-gray-400 border">Quality by WSM</th>
              </tr>
            </thead>
            <tbody className="">
              {report1.map((item, index) => (
                <tr key={index}>
                  <td className="bg-white border border-gray-400 text-center p-1">
                    {index + 1}
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.Area}
                      onChange={(e) => {
                        const list = [...report1];
                        list[index].Area = e.target.value;
                        setReport1(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.DescriptionOfWork}
                      onChange={(e) => {
                        const list = [...report1];
                        list[index].DescriptionOfWork = e.target.value;
                        setReport1(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.Size}
                      onChange={(e) => {
                        const list = [...report1];
                        list[index].Size = e.target.value;
                        setReport1(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="number"
                      value={item.Qty}
                      onChange={(e) => {
                        const list = [...report1];
                        list[index].Qty = e.target.value;
                        setReport1(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.Units}
                      onChange={(e) => {
                        const list = [...report1];
                        list[index].Units = e.target.value;
                        setReport1(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.DelNo}
                      onChange={(e) => {
                        const list = [...report1];
                        list[index].DelNo = e.target.value;
                        setReport1(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="date"
                      value={item.DateOfDel}
                      onChange={(e) => {
                        const list = [...report1];
                        list[index].DateOfDel = e.target.value;
                        setReport1(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.QualityByWSM}
                      onChange={(e) => {
                        const list = [...report1];
                        list[index].QualityByWSM = e.target.value;
                        setReport1(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {type?.toLowerCase() !== "view" && (
            <>
              <button
                type="button"
                className="bg-slate-400 mt-2 font-semibold text-sm hover:bg-green-500 p-2.5 rounded-lg"
                onClick={handleAddRow1}
              >
                + Add Row
              </button>
              <button
                type="button"
                className="bg-slate-400 mt-2 ml-2 font-semibold text-sm hover:bg-red-500 p-2.5 rounded-lg"
                onClick={handleRemoveRow1}
              >
                Remove Row
              </button>
            </>
          )}
        </div>
        {/* table 2---------------------------------------------------------------- */}
        <div className=" relative mt-1 pb-4">
          <p className="mt-2 text-2xl text-center font-bold mb-6">
            Non-Standard (Fabrication)
          </p>
          <table className="mt-6 table-auto">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-2 border-gray-400 border">Sl. No.</th>
                <th className="px-2 border-gray-400 border">Area</th>
                <th className="px-2 border-gray-400 border">
                  Description of Work
                </th>
                <th className="px-2 border-gray-400 border">Size</th>
                <th className="px-2 border-gray-400 border">Qty</th>
                <th className="px-2 border-gray-400 border">Units</th>
                <th className="px-2 border-gray-400 border">Del No.</th>
                <th className="px-2 border-gray-400 border">Date of Del </th>
                <th className="px-2 border-gray-400 border">Quality by WSM</th>
              </tr>
            </thead>
            <tbody className="">
              {report2.map((item, index) => (
                <tr key={index}>
                  <td className="bg-white border border-gray-400 text-center p-1">
                    {index + 1}
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.Area}
                      onChange={(e) => {
                        const list = [...report2];
                        list[index].Area = e.target.value;
                        setReport2(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.DescriptionOfWork}
                      onChange={(e) => {
                        const list = [...report2];
                        list[index].DescriptionOfWork = e.target.value;
                        setReport2(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.Size}
                      onChange={(e) => {
                        const list = [...report2];
                        list[index].Size = e.target.value;
                        setReport2(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="number"
                      value={item.Qty}
                      onChange={(e) => {
                        const list = [...report2];
                        list[index].Qty = e.target.value;
                        setReport2(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.Units}
                      onChange={(e) => {
                        const list = [...report2];
                        list[index].Units = e.target.value;
                        setReport2(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.DelNo}
                      onChange={(e) => {
                        const list = [...report2];
                        list[index].DelNo = e.target.value;
                        setReport2(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="date"
                      value={item.DateOfDel}
                      onChange={(e) => {
                        const list = [...report2];
                        list[index].DateOfDel = e.target.value;
                        setReport2(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      required
                      type="text"
                      value={item.QualityByWSM}
                      onChange={(e) => {
                        const list = [...report2];
                        list[index].QualityByWSM = e.target.value;
                        setReport2(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {type?.toLowerCase() !== "view" && (
            <>
              <button
                type="button"
                className="bg-slate-400 mt-2 font-semibold text-sm hover:bg-green-500 p-2.5 rounded-lg"
                onClick={handleAddRow2}
              >
                + Add Row
              </button>
              <button
                type="button"
                className="bg-slate-400 mt-2 ml-2 font-semibold text-sm hover:bg-red-500 p-2.5 rounded-lg"
                onClick={handleRemoveRow2}
              >
                Remove Row
              </button>
            </>
          )}
        </div>
        <div className=" flex items-end justify-end">
          {type?.toLowerCase() !== "view" && (
            <button
              disabled={
                report1[0]?.Area === "" ||
                report2[0]?.Area === "" ||
                (siteCode ||
                  siteName ||
                  JobCardNo ||
                  QuoteNo ||
                  QuoteDate ||
                  SiteLocation ||
                  Qs ||
                  QuoteApprovedDate ||
                  SiteStart ||
                  SiteCompletion ||
                  SiteSupervisor) === ""
              }
              type="submit"
              className="bg-green-400 hover:bg-green-600 disabled:bg-gray-400 disabled:text-gray-700 disabled:border-gray-300 border border-black py-2 px-16 font-semibold"
            >
              Submit
            </button>
          )}
          {report1[0]?.Area !== "" &&
            report2[0]?.Area !== "" &&
            (siteCode &&
              siteName &&
              JobCardNo &&
              QuoteNo &&
              QuoteDate &&
              SiteLocation &&
              Qs &&
              QuoteApprovedDate &&
              SiteStart &&
              SiteCompletion &&
              SiteSupervisor) !== "" && (
              <PDFDownloadLink
                document={<Invoice />}
                fileName={`${"JobCard" + "-" + siteName + "-" + siteCode}.pdf`}
              >
                <AiTwotoneFilePdf className=" text-[40px] cursor-pointer " />
              </PDFDownloadLink>
            )}
        </div>
      </form>
    </div>
  );
}
