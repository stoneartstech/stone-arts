import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import * as XLSX from "xlsx";
import Link from "next/link";

export default function CompletedSitesBalanceReportHistory() {
  //   const searchParams = useSearchParams();
  //   const showroomName = searchParams.get("showroomName");
  // const reportType = searchParams.get('reportParam')
  const [loading, setLoading] = useState(true);
  //   const showroomDbNames = {
  //     Galleria: "galleria-sales-report",
  //     Mirage: "mirage-sales-report",
  //     Kisumu: "kisumu-sales-report",
  //     "Mombasa Road": "mombasa-sales-report",
  //   };
  //   const showroomDbName = showroomDbNames[showroomName];
  const router = useRouter();
  const date = new Date().toLocaleDateString();

  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetch = onSnapshot(
      collection(db, "PMTReports/CompletedSiteBalance/Reports"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setReports(reports);
        // console.log(reports);
      }
    );
    setLoading(false);
    // console.log(reports);
    return fetch;
  }, []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState(-1);

  function handleDateSearch() {
    if (startDate === "" || endDate === "") {
      alert("Please select a date range");
      return;
    }
    if (startDate && endDate) {
      // console.log(startDate, endDate);
      if (new Date(startDate) > new Date(endDate)) {
        alert("End date should be greater than start date");
        return;
      } else {
        const fetch = onSnapshot(
          collection(db, "PMTReports/CompletedSiteBalance/Reports"),
          (snapshot) => {
            var reports = snapshot.docs.map((doc) => ({
              ...doc.data(),
            }));
            const filteredReports = reports?.filter((report, index) => {
              const [day, month, year] = report?.date.split("-").map(Number);
              const reportDate = new Date(year, month - 1, day);
              const start = new Date(startDate);
              const end = new Date(endDate);
              // console.log(reportDate, start, end);
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
  function handleExportToExcel(invoice) {
    const objectsWithDesireddate = reports.filter(
      (obj) => obj?.invoiceNumber === invoice
    );
    const headers = [
      "No",
      "Client",
      "InvoiceName",
      "WorkDescription",
      "SiteLocation",
      "Balance",
      "Invoiced",
      "Personnel",
      "HandoverData",
      "Remark",
    ];
    const FinalArray = objectsWithDesireddate[0]?.data?.map((report, index) => {
      return [
        index + 1,
        report.Client,
        report.InvoiceName,
        report.WorkDescription,
        report.SiteLocation,
        report.Balance,
        report.Invoiced,
        report.Personnel,
        report.HandoverData,
        report.Remark,
      ];
    });
    FinalArray.unshift(headers);
    // console.log(FinalArray);
    const workSheet = XLSX.utils.aoa_to_sheet(FinalArray);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
    XLSX.writeFile(
      workBook,
      `PMT-Completed-Site-Balance-Report-${reports[0]?.invoiceNumber}.xlsx`
    );
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
              Completed Site Balance Report History
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
              {/* {// console.log(reports)} */}
              {reports?.map((report, index) => (
                <div key={index} className=" bg-slate-300 p-2 my-2">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p
                      onClick={() => {
                        setSelectedInvoiceNumber((prev) =>
                          prev === report?.invoiceNumber
                            ? null
                            : report?.invoiceNumber
                        );
                      }}
                      className=" cursor-pointer p-2 py-4 bg-slate-300 flex-grow "
                    >
                      Report Date : {report?.invoiceNumber}
                    </p>
                    <button
                      className="bg-slate-400 w-fit p-2"
                      onClick={() => {
                        handleExportToExcel(report?.invoiceNumber);
                      }}
                    >
                      Export to Excel
                    </button>
                  </div>
                  {selectedInvoiceNumber === report?.invoiceNumber && (
                    <table className="mt-2 table-auto">
                      <thead className="bg-blue-500 text-white">
                        <tr>
                          <th className="px-2 border-gray-400 border">No.</th>
                          <th className="px-2 border-gray-400 border">
                            Client
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Invoice Name
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Work Description
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Site Location{" "}
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Balance
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Invoiced{" "}
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Personnel
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Handover Data
                          </th>
                          <th className="px-2 border-gray-400 border">
                            Remark
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
                              {item?.Client}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.InvoiceName}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.WorkDescription}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.SiteLocation}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.Balance}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.Invoiced}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.Personnel}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.HandoverDate}
                            </td>
                            <td className="bg-white border border-gray-400">
                              {item?.Remark}
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
