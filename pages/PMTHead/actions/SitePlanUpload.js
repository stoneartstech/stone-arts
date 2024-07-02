import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { db, storage } from "../../firebase";
import { setDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/firebase";
import GanttChart from "./GanttChart";
import { AiOutlineDotChart } from "react-icons/ai";
import { IoBarChart } from "react-icons/io5";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

export default function MaterialPlanUpload() {
  const router = useRouter();
  const { query } = router;
  const { qsName, clientId, clientName, type } = query;
  const [siteName, setSiteName] = useState("");
  const [isChart, setIsChart] = useState(false);
  const [siteCode, setSiteCode] = useState("");
  const [designerName, setDesignereName] = useState("");
  const [siteSupervisorName, setSiteSupervisorName] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [fileArr, setFileArr] = useState("");
  const today = new Date();
  const date1 =
    today.getDate() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    today.getFullYear();
  // Extract date components
  const [date, setDate] = useState(date1);
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
  const [report, setReport] = useState([
    {
      No: 1,
      MaterialName: "",
      Description: "",
      StartDate: "",
      EndDate: "",
      Duration: "",
      Progress: 50,
      Unit: "",
      Qty: "",
    },
  ]);
  const fetchData = async () => {
    const result = await getDoc(
      doc(db, `PMTReports/PendingSiteReport/SitePlan/${clientId}`)
    );
    const data = result.data();
    if (data) {
      setSiteName(data?.siteName);
      setSiteCode(data?.siteCode);
      setDesignereName(data?.designerName);
      setSiteSupervisorName(data?.siteSupervisorName);
      setFileLink(data?.fileLink);
      setDate(data?.date);
      setReport(data?.data);
    }
  };
  useEffect(() => {
    if (type?.toLowerCase() === "view") {
      fetchData();
    }
  }, []);
  const handleAddRow = () => {
    const row = {
      No: report.length + 1,
      MaterialName: "",
      Description: "",
      StartDate: "",
      EndDate: "",
      Duration: "",
      Progress: 50,
      Unit: "",
      Qty: "",
    };
    setReport([...report, row]);
  };
  const handleRemoveRow = (index) => {
    const list = [...report];
    list.splice(-1);
    setReport(list);
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
        <div className="w-full md:pl-8">
          <button
            className="bg-slate-300 p-2 rounded-lg mb-2"
            onClick={() => {
              if (isChart) {
                setIsChart(false);
              } else {
                router.back();
              }
            }}
          >
            Go Back
          </button>
        </div>
        {isChart ? (
          <GanttChart report={report} />
        ) : (
          <>
            <p className="mt-2 text-2xl text-center font-bold mb-6">
              {type?.toLowerCase() !== "view" ? "Upload" : "View"} Site Plan
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                try {
                  setDoc(
                    doc(
                      db,
                      `PMTReports/PendingSiteReport/SitePlan/${clientId}`
                    ),
                    {
                      siteName: siteName,
                      siteCode: siteCode,
                      clientName: clientName,
                      designerName: designerName,
                      qsName: qsName,
                      siteSupervisorName: siteSupervisorName,
                      data: report,
                      fileLink: fileLink,
                      date: date,
                    }
                  );
                  // console.log(report);
                  enqueueSnackbar(` Plan Uploaded Successfully`, {
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
                <div className=" flex items-center justify-between">
                  <div className="  grid md:grid-cols-3 md:gap-2  w-full  ">
                    <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                      <label className=" font-medium">Site Name</label>
                      <input
                        required
                        type="text"
                        className=" border border-black w-[200px] p-1.5"
                        value={siteName}
                        placeholder="Site Name"
                        onChange={(e) => {
                          setSiteName(e.target.value);
                        }}
                      />
                    </div>
                    <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                      <label className=" font-medium">Site Code</label>
                      <input
                        required
                        type="text"
                        className=" border border-black w-[200px] p-1.5"
                        value={siteCode}
                        placeholder="Site Code"
                        onChange={(e) => {
                          setSiteCode(e.target.value);
                        }}
                      />
                    </div>
                    <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                      <label className=" font-medium">Client Name</label>
                      <p className=" border border-black w-[200px] p-1.5">
                        {clientName}
                      </p>
                    </div>
                    <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                      <label className=" font-medium">Designer Name</label>
                      <input
                        required
                        type="text"
                        className=" border border-black w-[200px] p-1.5"
                        value={designerName}
                        placeholder="Designer Name"
                        onChange={(e) => {
                          setDesignereName(e.target.value);
                        }}
                      />
                    </div>
                    <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                      <label className=" font-medium">Qs Name</label>
                      <p className=" border border-black w-[200px] p-1.5">
                        {qsName}
                      </p>
                    </div>
                    <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                      <label className=" font-medium">
                        Site Supervisor Name
                      </label>
                      <input
                        required
                        type="text"
                        className=" border border-black w-[200px] p-1.5"
                        value={siteSupervisorName}
                        placeholder="Site Supervisor Name"
                        onChange={(e) => {
                          setSiteSupervisorName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" relative mt-14 pb-4">
                <table className="mt-6 w-full table-auto">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="px-2 border-gray-400 border">Sl. No.</th>
                      <th className="px-2 border-gray-400 border">
                        Material Name
                      </th>
                      <th className="px-2 border-gray-400 border">
                        Description
                      </th>
                      <th className="px-2 border-gray-400 border">Unit</th>
                      <th className="px-2 border-gray-400 border">Qty</th>
                      <th className="px-2 border-gray-400 border">
                        Date Start
                      </th>
                      <th className="px-2 border-gray-400 border">Date End</th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {report.map((item, index) => (
                      <tr key={index}>
                        <td className="bg-white border border-gray-400 text-center p-1">
                          {index + 1}
                        </td>
                        <td className="bg-white border border-gray-400">
                          <input
                            required
                            type="text"
                            value={item.MaterialName}
                            onChange={(e) => {
                              const list = [...report];
                              list[index].MaterialName = e.target.value;
                              setReport(list);
                            }}
                            className="w-full px-2 border-none outline-none"
                          />
                        </td>
                        <td className="bg-white border border-gray-400">
                          <input
                            required
                            type="text"
                            value={item.Description}
                            onChange={(e) => {
                              const list = [...report];
                              list[index].Description = e.target.value;
                              setReport(list);
                            }}
                            className="w-full px-2 border-none outline-none"
                          />
                        </td>
                        <td className="bg-white border border-gray-400">
                          <input
                            required
                            type="text"
                            value={item.Unit}
                            onChange={(e) => {
                              const list = [...report];
                              list[index].Unit = e.target.value;
                              setReport(list);
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
                              const list = [...report];
                              list[index].Qty = e.target.value;
                              setReport(list);
                            }}
                            className="w-full px-2 border-none outline-none"
                          />
                        </td>
                        <td className="bg-white border border-gray-400">
                          <input
                            required
                            type="date"
                            value={item.StartDate}
                            onChange={(e) => {
                              const list = [...report];
                              list[index].StartDate = e.target.value;
                              setReport(list);
                            }}
                            className="w-full px-2 border-none outline-none"
                          />
                        </td>
                        <td className="bg-white border border-gray-400">
                          <input
                            required
                            type="date"
                            value={item.EndDate}
                            onChange={(e) => {
                              const list2 = [...report];
                              const endDate = new Date(e.target.value);
                              const startDate = new Date(
                                list2[index].StartDate
                              );

                              list2[index].EndDate = e.target.value; // Update the end date
                              list2[index].Duration =
                                (endDate - startDate) / (1000 * 3600 * 24);
                              setReport(list2);

                              setReport(list2);
                            }}
                            className="w-full px-2 border-none outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className=" flex flex-col md:flex-row gap-5 items-end justify-between">
                {type?.toLowerCase() !== "view" && (
                  <div className=" flex justify-between items-center">
                    {" "}
                    <button
                      type="button"
                      className="bg-slate-400 md:mt-2 font-semibold  text-xs md:text-sm hover:bg-green-500 p-2.5 rounded-lg"
                      onClick={handleAddRow}
                    >
                      + Add Row
                    </button>
                    <button
                      type="button"
                      className="bg-slate-400 md:mt-2 ml-2 font-semibold  text-xs md:text-sm hover:bg-red-500 p-2.5 rounded-lg"
                      onClick={handleRemoveRow}
                    >
                      Remove Row
                    </button>
                  </div>
                )}
                <div className=" flex items-center justify-between gap-6">
                  <button
                    type="button"
                    disabled={report[0]?.MaterialName === ""}
                    title="Gantt Chart"
                    className=" hover:bg-green-400 disabled:bg-gray-300 disabled:border-gray-300 "
                    onClick={() => {
                      setIsChart(true);
                      console.log(report);
                    }}
                  >
                    <IoBarChart className=" text-[26px] md:text-[34px]" />
                  </button>
                  {type?.toLowerCase() !== "view" && (
                    <button
                      type="submit"
                      disabled={
                        report[0]?.MaterialName === "" ||
                        siteCode === "" ||
                        siteName === "" ||
                        clientName === "" ||
                        siteSupervisorName === ""
                      }
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:border-gray-300 border border-black text-xs md:text-sm py-2 px-16 font-semibold"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
