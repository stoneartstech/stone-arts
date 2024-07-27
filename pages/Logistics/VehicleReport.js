import React, { useEffect, useState } from "react";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Image from "next/image";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function VehicleReport({ vehicle, handleBack }) {
  const [viewOptions, setViewOptions] = useState(true);
  const [viewUpload, setViewUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const vehicleName = vehicle?.name;

  const [report, setReports] = useState([]);

  const fetchReports = async () => {
    setLoading(true);
    let resArr = [];
    const res = await getDocs(
      collection(db, `Vehicle-Datas/reports/${vehicleName}`)
    );
    res.forEach((doc) => {
      // console.log(doc?.id, " => ", doc.data());
      resArr.push(doc?.data());
    });
    // console.log(resArr);
    setReports(resArr);
    setLoading(false);
  };
  useEffect(() => {
    fetchReports();
  }, [viewUpload]);

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
          <p className=" page-heading">{vehicle?.name} </p>
        </div>
        {!viewSingleReport ? (
          <div className=" flex flex-col gap-2 items-center">
            {loading ? (
              <div className=" w-full flex items-center justify-center">
                <Image
                  width={50}
                  height={50}
                  src="/loading.svg"
                  alt="Loading ..."
                />
              </div>
            ) : (
              <>
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
                      Report - {item?.date}, {item?.time}
                    </p>
                  );
                })}
              </>
            )}
          </div>
        ) : (
          <UploadReport type="view" selData={activeTab} />
        )}
      </>
    );
  };

  const UploadReport = ({ type, selData }) => {
    const [serviceDesc, setServiceDesc] = useState("");
    const [cleanlinessDesc, setCleanlinessDesc] = useState("");
    const [councilDesc, setCouncilDesc] = useState("");
    const [damageDesc, setDamageDesc] = useState("");
    const [reportDate, setReportDate] = useState("");

    const currDateStr = new Date().toISOString();
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();

    const [report, setReport] = useState([
      {
        SNo: 1,
        Date: date,
        VehicleNumber: vehicleName,
        DriverName: "",
        Start: "",
        End: "",
        FixedCost: "",
        NextService: "",
        Cleanliness: "",
        CouncilCost: "",
        ServiceCost: "",
        DamagesCost: "",
      },
    ]);

    const handleAddRow = () => {
      const row = {
        SNo: report.length + 1,
        Date: date,
        VehicleNumber: vehicleName,
        DriverName: "",
        Start: "",
        End: "",
        FixedCost: "",
        NextService: "",
        Cleanliness: "",
        CouncilCost: "",
        ServiceCost: "",
        DamagesCost: "",
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
      setReportDate(date);
      if (selData) {
        setReport(selData?.data);
        setCleanlinessDesc(selData?.CleanDesc);
        setDamageDesc(selData?.DamageDesc);
        setCouncilDesc(selData?.CounDesc);
        setServiceDesc(selData?.ServDesc);
        setReportDate(selData?.date);
      }
    }, []);
    return (
      <div>
        <div className=" flex flex-col md:flex-row md:items-center justify-center relative">
          {type?.toLowerCase() !== "view" && (
            <button
              className="bg-slate-300 p-2 rounded-lg w-fit md:absolute left-0 top-0"
              onClick={() => {
                setViewUpload(false);
                setViewOptions(true);
              }}
            >
              Go Back
            </button>
          )}
          <p className=" page-heading">Logistics Maintainance Report </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              const reportData = {};
              const data = {
                date,
                time,
                ServDesc: serviceDesc,
                CounDesc: councilDesc,
                CleanDesc: cleanlinessDesc,
                DamageDesc: damageDesc,
                data: report,
              };
              // console.log(data);
              setDoc(
                doc(
                  db,
                  "Vehicle-Datas/reports",
                  `${vehicleName}/${currDateStr}`
                ),
                data
              );
              enqueueSnackbar("Report Uploaded Successfully", {
                variant: "success",
              });
              setReport([
                {
                  SNo: 1,
                  Date: date,
                  VehicleNumber: vehicleName,
                  DriverName: "",
                  Start: "",
                  End: "",
                  FixedCost: "",
                  NextService: "",
                  Cleanliness: "",
                  CouncilCost: "",
                  ServiceCost: "",
                  DamagesCost: "",
                },
              ]);
              setDamageDesc("");
              setCouncilDesc("");
              setCleanlinessDesc("");
              setServiceDesc("");
            } catch (error) {
              enqueueSnackbar("Some error occured", {
                variant: "error",
              });
            }
          }}
          className="max-w-full py-4 border border-black px-2 overflow-auto"
        >
          <div>
            <div className=" flex items-center justify-between">
              <div className=" border border-black font-semibold p-1.5 px-4 w-fit text-sm md:text-base ">
                <p>Vehicle No. - {vehicleName} </p>
              </div>
              <div className=" border border-black font-semibold p-1.5 px-4 w-fit text-sm md:text-base ">
                <p>Date - {reportDate} </p>
              </div>
            </div>
          </div>
          <div className=" relative mt-4">
            <table className=" custom-table">
              <thead className=" custom-table-head">
                <tr>
                  <th className="custom-table-row">Sl. No.</th>
                  <th className="custom-table-row  ">Date</th>
                  <th className="custom-table-row">VehicleNumber</th>
                  <th className="custom-table-row">DriverName</th>
                  <th className="custom-table-row">Start</th>
                  <th className="custom-table-row">End</th>
                  <th className="custom-table-row">NextService</th>
                  <th className="custom-table-row">FixedCost</th>
                  <th className="custom-table-row">Cleanliness</th>
                  <th className="custom-table-row">CouncilCost</th>
                  <th className="custom-table-row">ServiceCost</th>
                  <th className="custom-table-row">DamagesCost</th>
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
                        value={item?.Date}
                        readOnly
                        onChange={(e) => {
                          const list = [...report];
                          list[index].Date = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input "
                      />
                    </td>
                    <td className="custom-table-data">
                      <input
                        disabled={type?.toLowerCase() === "view"}
                        required
                        readOnly
                        type="text"
                        value={item.VehicleNumber}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].VehicleNumber = e.target.value;
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
                        value={item.Start}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].Start = e.target.value;
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
                        value={item.End}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].End = e.target.value;
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
                        value={item.NextService}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].NextService = e.target.value;
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
                        value={item.FixedCost}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].FixedCost = e.target.value;
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
                        value={item.Cleanliness}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].Cleanliness = e.target.value;
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
                        value={item.CouncilCost}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].CouncilCost = e.target.value;
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
                        value={item.ServiceCost}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].ServiceCost = e.target.value;
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
                        value={item.DamagesCost}
                        onChange={(e) => {
                          const list = [...report];
                          list[index].DamagesCost = e.target.value;
                          setReport(list);
                        }}
                        className="custom-table-input"
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
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <p className="mt-4 font-semibold">Service Description</p>
              <textarea
                rows={4}
                type="text"
                disabled={type?.toLowerCase() === "view"}
                value={serviceDesc}
                onChange={(e) => setServiceDesc(e.target.value)}
                className=" p-2.5 w-full disabled:bg-white "
              />
            </div>
            <div className="flex flex-col">
              <p className="mt-4 font-semibold">
                Council/Police Incident Description
              </p>
              <textarea
                rows={4}
                disabled={type?.toLowerCase() === "view"}
                type="text"
                value={councilDesc}
                onChange={(e) => setCouncilDesc(e.target.value)}
                className=" p-2.5 w-full disabled:bg-white "
              />
            </div>
            <div className="flex flex-col">
              <p className="mt-4 font-semibold">Cleanliness Description</p>
              <textarea
                rows={4}
                disabled={type?.toLowerCase() === "view"}
                type="text"
                value={cleanlinessDesc}
                onChange={(e) => setCleanlinessDesc(e.target.value)}
                className=" p-2.5 w-full disabled:bg-white"
              />
            </div>
            <div className="flex flex-col">
              <p className="mt-4 font-semibold">Damages Description</p>
              <textarea
                rows={4}
                disabled={type?.toLowerCase() === "view"}
                type="text"
                value={damageDesc}
                onChange={(e) => setDamageDesc(e.target.value)}
                className=" p-2.5 w-full disabled:bg-white"
              />
            </div>
          </div>
          {type?.toLowerCase() !== "view" && (
            <div className=" flex items-center justify-center">
              <button
                disabled={report[0]?.ReceivedDate === ""}
                type="submit"
                className=" upload-form-btn"
              >
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
                handleBack(false);
              }}
            >
              Go Back
            </button>
            <p className=" page-heading">{vehicle?.name} </p>
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
