import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import * as XLSX from "xlsx";
import Link from "next/link";

export default function SupervisorDailyReportHistory() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const date = new Date().toLocaleDateString();

  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetch = onSnapshot(
      collection(db, "PMTReports/SupervisorReports/Daily"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setReports(reports);
      }
    );
    setLoading(false);

    return fetch;
  }, []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedReportDate, setSelectedReportDate] = useState(-1);
  const handleClick = (reportDate) => {
    setSelectedReportDate(
      reportDate === selectedReportDate ? null : reportDate
    );
  };

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
          collection(db, "PMTReports/SupervisorReports/Daily"),
          (snapshot) => {
            var reports = snapshot.docs.map((doc) => ({
              ...doc.data(),
            }));
            const filteredReports = reports?.filter((report, index) => {
              const [day, month, year] = report?.date.split("-").map(Number);
              const reportDate = new Date(year, month - 1, day);
              const start = new Date(startDate);
              const end = new Date(endDate);

              return reportDate >= start && reportDate <= end;
            });
            setReports(filteredReports);
          }
        );
        setLoading(false);
        return fetch;
      }
    }
  }
  function handleExportToExcel(date) {
    const objectsWithDesireddate = reports.filter((obj) => obj?.date === date);
    const headers = [
      "Sl. No",
      "Name of Fundi",
      "Site Name",
      "S. Code",
      "F/H",
      "Work Description",
      "Q.T.Y",
      "Sqm/Lm",
      "Remark",
      "Picture",
    ];
    const FinalArray = objectsWithDesireddate[0]?.data?.map((report, index) => {
      return [
        index + 1,
        report.NameofFundi,
        report.SiteName,
        report.SCode,
        report.FH,
        report.WorkDescription,
        report.Qty,
        report.SqmLm,
        report.Remark,
        report.Picture,
      ];
    });
    FinalArray.unshift(headers);

    const workSheet = XLSX.utils.aoa_to_sheet(FinalArray);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
    XLSX.writeFile(workBook, `PMT-Supervisor-Daily-Report-${date}.xlsx`);
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
              Site Supervisor Daily Report History
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
                <div key={index} className=" bg-slate-300 p-2 my-2">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p
                      onClick={() => {
                        handleClick(report?.date);
                      }}
                      className=" cursor-pointer p-2 py-4 bg-slate-300 flex-grow "
                    >
                      Report Date : {report?.date}
                    </p>
                    <button
                      className="bg-slate-400 w-fit p-2"
                      onClick={() => {
                        handleExportToExcel(report?.date);
                      }}
                    >
                      Export to Excel
                    </button>
                  </div>
                  {selectedReportDate === report?.date && (
                    <table className="mt-2 table-auto">
                      <thead className="bg-blue-500 text-white">
                        <tr>
                          <th className="px-2 border-gray-400 border">
                            Sl. No.
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Name of the Fundi
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Site Name
                          </th>
                          <th className="px-2 border-gray-400 border">
                            S. Code
                          </th>
                          <th className="px-2 border-gray-400 border">F/H</th>
                          <th className="px-2 border-gray-400 border">
                            Work Description
                          </th>
                          <th className="px-2 border-gray-400 border">Q.T.Y</th>
                          <th className="px-2 border-gray-400 border">
                            Sqm/Lm
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Remark
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Picture
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
                              {item?.NameofFundi}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.SiteName}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.SCode}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.FH}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.WorkDescription}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.Qty}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.SqmLm}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.Remark}
                            </td>
                            <td
                              className={`${
                                item?.Picture
                                  ? "bg-green-400"
                                  : " bg-white text-sm"
                              } text-center font-medium border border-gray-400`}
                            >
                              {item?.Picture ? (
                                <Link target="_blank" href={item?.Picture}>
                                  View
                                </Link>
                              ) : (
                                <p>NA</p>
                              )}
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
