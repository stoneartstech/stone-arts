import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import * as XLSX from "xlsx";
import Link from "next/link";

export default function RunningSiteProgressReportHistory() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const date = new Date().toLocaleDateString();

  const [reports, setReports] = useState([]);
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");

  useEffect(() => {
    const fetch = onSnapshot(
      collection(db, "PMTReports/SiteProgressReports/Reports"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setReports(reports);
        // console.log(reports);
      }
    );
    setLoading(false);
    return fetch;
  }, []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedReportDate, setSelectedReportDate] = useState(-1);

  function handleDateSearch() {
    if (startDate === "" || endDate === "") {
      alert("Please select a date range");
      return;
    }
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        alert("End date should be greater than start date");
        return;
      } else {
        const fetch = onSnapshot(
          collection(db, "PMTReports/SiteProgressReports/Reports"),
          (snapshot) => {
            var reports = snapshot.docs.map((doc) => ({
              ...doc.data(),
            }));
            const filteredReports = reports?.filter((report, index) => {
              const reportFromDate = new Date(report?.from);
              const reportToDate = new Date(report?.to);
              const start = new Date(startDate);
              const end = new Date(endDate);
              return reportFromDate >= start && reportToDate <= end;
            });
            setReports(filteredReports);
          }
        );
        setLoading(false);
        return fetch;
      }
    }
  }
  function handleExportToExcel(from, to) {
    const objectsWithDesireddate = reports.filter(
      (obj) => obj?.from === from && obj?.to === to
    );
    const headers = [
      "No",
      "Name",
      "SiteName",
      "SiteCode",
      "Designation",
      "Status",
      "WorkDescription",
      "Qty",
      "Unit",
      "Remark",
      "Supervisor",
    ];
    const FinalArray = objectsWithDesireddate[0]?.data?.map((report, index) => {
      return [
        index + 1,
        report.Name,
        report.SiteName,
        report.SiteCode,
        report.Designation,
        report.Status,
        report.WorkDescription,
        report.Qty,
        report.Unit,
        report.Remark,
        report.Supervisor,
      ];
    });
    FinalArray.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet(FinalArray);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
    XLSX.writeFile(workBook, `PMT-Site-Progress-Report-${from}-${to}.xlsx`);
  }

  return (
    <>
      {!loading && (
        <div>
          <div className="w-full md:pl-6">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
          <div className="flex flex-col items-center">
            <p className=" text-2xl md:text-3xl mb-4">
              Site Progress Report History
            </p>
          </div>
          <p className=" text-lg md:text-2xl text-center font-bold">
            Search in date range
          </p>
          <div className="my-4 mx-auto flex gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-2 border-black p-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-2 border-black p-2"
            />
            <button
              className="bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2"
              onClick={handleDateSearch}
            >
              Search
            </button>
          </div>
          {reports?.length > 0 ? (
            <div className="max-w-full overflow-auto">
              {reports?.map((report, index) => (
                <div key={index} className=" bg-slate-300 my-2">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p
                      onClick={() => {
                        setReportStartDate((prev) =>
                          prev === report?.from ? null : report?.from
                        );
                        setReportEndDate((prev) =>
                          prev === report?.to ? null : report?.to
                        );
                      }}
                      className=" cursor-pointer p-2 py-4 bg-slate-300 flex-grow "
                    >
                      Report Date : From: {report?.from} To: {report?.to}
                    </p>
                    <button
                      className="bg-slate-400 w-fit p-2"
                      onClick={() => {
                        handleExportToExcel(report?.from, report?.to);
                      }}
                    >
                      Export to Excel
                    </button>
                  </div>
                  {reportStartDate === report?.from &&
                    reportEndDate === report?.to && (
                      <table className="mt-2 table-auto">
                        <thead className="bg-blue-500 text-white">
                          <tr>
                            <th className="px-2 border-gray-400 border">No.</th>
                            <th className="px-2 border-gray-400 border">
                              Name
                            </th>
                            <th className="px-2 border-gray-400 border">
                              Site Name
                            </th>
                            <th className="px-2 border-gray-400 border">
                              Site Code
                            </th>
                            <th className="px-2 border-gray-400 border">
                              Designation
                            </th>
                            <th className="px-2 border-gray-400 border">
                              Status
                            </th>
                            <th className="px-2 border-gray-400 border">
                              Work Description
                            </th>
                            <th className="px-2 border-gray-400 border">Qty</th>
                            <th className="px-2 border-gray-400 border">
                              Unit
                            </th>
                            <th className="px-2 border-gray-400 border">
                              Remark
                            </th>
                            <th className="px-2 border-gray-400 border">
                              Supervisor
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {report?.data?.map((item, index) => (
                            <tr key={index}>
                              <td className="bg-white border border-gray-400 text-center">
                                {index + 1}
                              </td>
                              <td className="bg-white border border-gray-400">
                                {item?.Name}
                              </td>
                              <td className="bg-white border border-gray-400">
                                {item?.SiteName}
                              </td>
                              <td className="bg-white border border-gray-400">
                                {item?.SiteCode}
                              </td>
                              <td className="bg-white border border-gray-400">
                                {item?.Designation}
                              </td>
                              <td className="bg-white border border-gray-400">
                                {item?.Status}
                              </td>
                              <td className="bg-white border border-gray-400">
                                {item?.WorkDescription}
                              </td>
                              <td className="bg-white border border-gray-400">
                                {item?.Qty}
                              </td>
                              <td className="bg-white border border-gray-400">
                                {item?.Unit}
                              </td>
                              <td className="bg-white border border-gray-400">
                                {item?.Remark}
                              </td>
                              <td className="bg-white border border-gray-400">
                                {item?.Supervisor}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <p className=" text-center">No Reports Available </p>
          )}
        </div>
      )}
    </>
  );
}
