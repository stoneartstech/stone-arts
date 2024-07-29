import React, { useEffect, useState } from "react";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Image from "next/image";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/router";

export default function Reports({ vehicle, handleBack }) {
  const [viewOptions, setViewOptions] = useState(true);
  const [viewUpload, setViewUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReports] = useState([]);

  const router = useRouter();

  const fetchReports = async () => {
    setLoading(true);
    let resArr = [];
    const res = await getDocs(collection(db, "Logistics-Reports"));
    res.forEach((doc) => {
      console.log(doc?.id, " => ", doc.data());
      resArr.push(doc?.data());
    });
    // console.log(resArr);
    setReports(resArr);
    setLoading(false);
  };
  useEffect(() => {
    fetchReports();
  }, []);

  const PrevReports = () => {
    const [viewSingleReport, setViewSingleReport] = useState(false);
    const [activeTab, setActiveTab] = useState(false);

    return (
      <>
        <div className=" flex flex-col md:flex-row md:items-center justify-center relative">
          <button
            className="bg-slate-300 p-2 rounded-lg w-fit md:absolute left-0 top-0"
            onClick={() => {
              if (viewSingleReport) {
                setViewSingleReport(false);
              } else {
                setViewOptions(true);
              }
            }}
          >
            Go Back
          </button>
          <p className=" page-heading">Logistics Report </p>
        </div>
        {!viewSingleReport ? (
          <div className=" flex flex-col gap-2 items-center">
            {report?.length <= 0 && <p>No Reports </p>}
            {report?.map((item, index) => {
              return (
                <p
                  key={index}
                  onClick={() => {
                    setViewSingleReport(true);
                    setActiveTab(item);
                  }}
                  className=" main-btn"
                >
                  Report - {String(item?.date)}, {item?.time}
                </p>
              );
            })}
          </div>
        ) : (
          <UploadReport
            type="view"
            selData={activeTab}
            handleClose={setViewSingleReport}
          />
        )}
      </>
    );
  };

  const UploadReport = ({ type, selData, handleClose }) => {
    const [reportDate, setReportDate] = useState("");
    const [reportType, setReportType] = useState("daily");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [totalMass, setTotalMass] = useState(0);

    const currDateStr = new Date().toISOString();
    const date = new Date().toDateString();
    const time = new Date().toLocaleTimeString();

    const [report, setReport] = useState([
      {
        SNo: 1,
        SourceOfDelivery: "",
        DriverName: "",
        Date: "",
        OrderNo: "",
        GoodsDesc: "",
        ClientName: "",
        SiteCode: "",
        Location: "",
        Qty: "",
        Units: "",
        Mass: "",
      },
    ]);

    const handleAddRow = () => {
      const row = {
        SNo: report.length + 1,
        SourceOfDelivery: "",
        DriverName: "",
        Date: "",
        OrderNo: "",
        GoodsDesc: "",
        ClientName: "",
        SiteCode: "",
        Location: "",
        Qty: "",
        Units: "",
        Mass: "",
      };
      setReport([...report, row]);
    };
    const handleRemoveRow = (index) => {
      if (report?.length > 1) {
        const list = [...report];
        list.splice(-1);
        setReport(list);
      }
    };
    useEffect(() => {
      if (selData) {
        setReport(selData?.data);
        setReportDate(selData?.date);
        setReportType(selData?.reportType);
        setVehicleNumber(selData?.vehicleNumber);
        setTotalMass(selData?.totalMass);
      }
    }, []);
    useEffect(() => {
      let total = report.reduce(
        (total, row) => parseFloat(total) + (parseFloat(row.Mass) || 0),
        0
      );
      setTotalMass(parseFloat(total));
    }, [report]);
    return (
      <div>
        <div className=" flex flex-col md:flex-row md:items-center justify-center relative">
          {type?.toLowerCase() !== "view" && (
            <>
              <button
                className="bg-slate-300 p-2 rounded-lg w-fit md:absolute left-0 top-0"
                onClick={() => {
                  setViewUpload(false);
                  setViewOptions(true);
                  if (handleClose) {
                    handleClose(false);
                  }
                }}
              >
                Go Back
              </button>
              <p className=" page-heading">Logistics Report </p>
            </>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              const data = {
                date,
                time,
                selectedDate: reportDate,
                reportType,
                vehicleNumber,
                data: report,
                totalMass,
              };
              // console.log(data);
              setDoc(doc(db, "Logistics-Reports", `${currDateStr}`), data);
              enqueueSnackbar("Report Uploaded Successfully", {
                variant: "success",
              });
              setReport([
                {
                  SNo: 1,
                  SourceOfDelivery: "",
                  DriverName: "",
                  Date: "",
                  OrderNo: "",
                  GoodsDesc: "",
                  ClientName: "",
                  SiteCode: "",
                  Location: "",
                  Qty: "",
                  Units: "",
                  Mass: "",
                },
              ]);
            } catch (error) {
              enqueueSnackbar("Some error occured", {
                variant: "error",
              });
            }
          }}
          className="max-w-full py-4 border border-black px-2 overflow-auto"
        >
          <div>
            <div className=" flex items-center  gap-3">
              <div className=" font-semibold p-1.5 px-4 w-fit text-sm md:text-base ">
                <p>
                  Vehicle No. -{" "}
                  <input
                    disabled={type?.toLowerCase() === "view"}
                    type="text"
                    placeholder="Vehicle Number"
                    value={vehicleNumber}
                    onChange={(e) => {
                      setVehicleNumber(e.target.value);
                    }}
                    className="custom-table-input "
                  />
                </p>
              </div>
              <div className=" font-semibold p-1.5 px-4 w-fit text-sm md:text-base ">
                <p>
                  Date -{" "}
                  <input
                    disabled={type?.toLowerCase() === "view"}
                    type={type?.toLowerCase() === "view" ? "text" : "date"}
                    value={reportDate}
                    onChange={(e) => {
                      setReportDate(e.target.value);
                    }}
                    className="custom-table-input "
                  />{" "}
                </p>
              </div>
              <div className=" font-semibold p-1.5 px-4 w-fit text-sm md:text-base ">
                <p>
                  Type -{" "}
                  <select
                    disabled={type?.toLowerCase() === "view"}
                    value={reportType}
                    onChange={(e) => {
                      setReportType(e.target.value);
                    }}
                    className="custom-table-input "
                  >
                    <option value={"daily"}>Daily</option>
                    <option value={"weekly"}>Weekly</option>
                    <option value={"monthly"}>Monthly</option>
                    <option value={"yearly"}>Yearly</option>
                  </select>
                </p>
              </div>
            </div>
          </div>
          <div className=" relative mt-4">
            <table className=" custom-table">
              <thead className=" custom-table-head">
                <tr>
                  <th className="custom-table-row">Sl. No.</th>
                  <th className="custom-table-row">SourceOfDelivery</th>
                  <th className="custom-table-row">DriverName</th>
                  <th className="custom-table-row">Date</th>
                  <th className="custom-table-row">OrderNo</th>
                  <th className="custom-table-row">GoodsDesc</th>
                  <th className="custom-table-row">ClientName</th>
                  <th className="custom-table-row">SiteCode</th>
                  <th className="custom-table-row">Location</th>
                  <th className="custom-table-row">Qty</th>
                  <th className="custom-table-row">Units</th>
                  <th className="custom-table-row">Mass</th>
                </tr>
              </thead>
              <tbody className="">
                {report.map((item, index) => (
                  <tr key={index}>
                    <td className="custom-table-data text-center p-1">
                      {index + 1}
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        type="text"
                        value={item?.SourceOfDelivery}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].SourceOfDelivery = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input "
                      />
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        required
                        type="text"
                        value={item.DriverName}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].DriverName = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        required
                        type="date"
                        value={item.Date}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].Date = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        required
                        type="text"
                        value={item.OrderNo}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].OrderNo = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        required
                        type="text"
                        value={item.GoodsDesc}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].GoodsDesc = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        required
                        type="text"
                        value={item.ClientName}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].ClientName = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        required
                        type="text"
                        value={item.SiteCode}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].SiteCode = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        required
                        type="text"
                        value={item.Location}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].Location = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        required
                        type="number"
                        value={item.Qty}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].Qty = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        required
                        type="text"
                        value={item.Units}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].Units = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        required
                        type="number"
                        value={item.Mass}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].Mass = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input"
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]?.map((item, index) => (
                    <td key={index}></td>
                  ))}
                  <td className="custom-table-row bg-gray-300 font-semibold py-1 border-l border-white">
                    Total
                  </td>
                  <td className="custom-table-row bg-gray-300 font-semibold py-1">
                    {totalMass}
                  </td>
                </tr>
              </tbody>
            </table>
            {type?.toLowerCase() !== "view" && (
              <>
                <button
                  type="button"
                  className="add-row-btn"
                  onClick={handleAddRow}
                >
                  + Add Row
                </button>
                <button
                  type="button"
                  className="delete-row-btn"
                  onClick={handleRemoveRow}
                >
                  Remove Row
                </button>
              </>
            )}
          </div>

          {type?.toLowerCase() !== "view" && (
            <div className=" flex items-center justify-center">
              <button type="submit" className=" upload-form-btn">
                Upload
              </button>
            </div>
          )}
        </form>
      </div>
    );
  };

  return (
    <div>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />

      {viewOptions ? (
        <>
          <div className=" flex flex-col md:flex-row md:items-center justify-center relative">
            <button
              className="bg-slate-300 p-2 rounded-lg w-fit md:absolute left-0 top-0"
              onClick={() => {
                router.back();
              }}
            >
              Go Back
            </button>
            <p className=" page-heading">Logistics Dashboard </p>
          </div>
          <div className=" flex flex-col gap-2 items-center">
            <p
              onClick={() => {
                setViewOptions(false);
                setViewUpload(true);
              }}
              className=" main-btn"
            >
              Upload New Report
            </p>
            <p
              onClick={() => {
                setViewOptions(false);
                setViewUpload(false);
              }}
              className=" main-btn"
            >
              View Previous Reports
            </p>
          </div>
        </>
      ) : (
        <>{viewUpload ? <UploadReport /> : <PrevReports />}</>
      )}
    </div>
  );
}
