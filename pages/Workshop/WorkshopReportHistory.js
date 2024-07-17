import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import * as XLSX from "xlsx";
import Image from "next/image";

export default function WorkshopReportHistory() {
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
    const fetch = onSnapshot(collection(db, "Workshop-Reports"), (snapshot) => {
      var reports = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setReports(reports);
      setLoading(false);
    });
    // console.log(reports);
    return fetch;
  }, []);

  const [selectedReportDate, setSelectedReportDate] = useState(-1);
  const handleClick = (reportDate, reportTime) => {
    setSelectedReportDate(
      reportDate === selectedReportDate ? null : reportDate + "-" + reportTime
    );
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
          collection(db, "Workshop-Reports"),
          (snapshot) => {
            var reports = snapshot.docs.map((doc) => ({
              ...doc.data(),
            }));
            console.log(reports[0]);
            const filteredReports = reports.filter((report, index) => {
              const [day, month, year] = report[0].Date.split("-").map(Number);
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
  function handleExportToExcel(Invoice) {
    // filtering objects with desired Invoice No.
    const objectsWithDesiredInvoiceNo = reports.filter(
      (obj) => obj[0].InvoiceNo === Invoice
    );
    // converting array of objects to array of arrays to use aoa method of xlsx
    const arrayOfArrays = Object.values(objectsWithDesiredInvoiceNo).map(
      (obj) => Object.values(obj)
    );
    // adding excel headers
    const headers = [
      "Sl. No",
      "Inv. No.",
      "Rec. Dt.",
      "OrderNo",
      "OrderDetail",
      "SiteName",
      "Delv. Dt.",
      "Sc",
      "Qty",
      "Unit",
      "Remarks",
      "Exp. DOC",
    ];
    const FinalArray = arrayOfArrays[0].map((report, index) => [
      index + 1,
      report.InvoiceNo,
      report.ReceivedDate,
      report.OrderNo,
      report.OrderDetail,
      report.SiteName,
      report.DeliveryDate,
      report.Sc,
      report.Qty,
      report.Unit,
      report.Remarks,
      report.ExpectedDOC,
    ]);
    FinalArray.unshift(headers);
    console.log(FinalArray);
    const workSheet = XLSX.utils.aoa_to_sheet(FinalArray);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
    XLSX.writeFile(workBook, `Workshop-Report-${Invoice}.xlsx`);
  }

  return (
    <>
      {loading ? (
        <div className=" w-full flex items-center justify-center">
          <Image width={50} height={50} src="/loading.svg" alt="Loading ..." />
        </div>
      ) : (
        <div>
          <div className="w-full md:pl-6">
            <button className=" go-back-btn" onClick={() => router.back()}>
              Go Back
            </button>
          </div>
          <div className="flex flex-col items-center">
            <p className=" page-heading">Workshop Reports History</p>
          </div>
          <p className=" text-lg md:text-2xl text-center font-bold">
            Search in date range
          </p>
          <div className="my-4 mx-auto flex gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className=" border md:border-2 border-black p-1 md:p-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className=" border md:border-2 border-black p-1 md:p-2"
            />
            <button
              className="bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2"
              onClick={handleDateSearch}
            >
              Search
            </button>
          </div>
          <div className="max-w-full overflow-auto">
            {reports.map((report) => (
              <div
                key={report[0].InvoiceNo}
                className="p-2 bg-slate-300  my-2"
                onClick={() => {
                  // console.log(selectedReportDate);
                  if (
                    selectedReportDate ===
                    report[0].Date + "-" + report[0]?.time
                  ) {
                    return setSelectedReportDate(null);
                  }
                  handleClick(report[0].Date, report[0]?.time);
                }}
              >
                <div className="flex flex-row justify-between items-center text-sm md:text-base">
                  <p>
                    Report Date :{" "}
                    <span className=" block md:inline">
                      {report[0].Date + "-" + report[0]?.time}
                    </span>
                  </p>
                  <button
                    className="bg-slate-400 p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportToExcel(report[0].InvoiceNo);
                    }}
                  >
                    Export to Excel
                  </button>
                </div>
                {selectedReportDate ===
                  report[0].Date + "-" + report[0]?.time && (
                  <table className=" custom-table">
                    <thead className=" custom-table-head">
                      <tr>
                        <th className="custom-table-row">Sl. No.</th>
                        <th className="custom-table-row">Received Date</th>
                        <th className="custom-table-row">Order No.</th>
                        <th className="custom-table-row">Order Detail</th>
                        <th className="custom-table-row">Site Name</th>
                        <th className="custom-table-row">Delivery Date</th>
                        <th className="custom-table-row">Sc</th>
                        <th className="custom-table-row">Qty.</th>
                        <th className="custom-table-row">Units</th>
                        <th className="custom-table-row">Remarks</th>
                        <th className="custom-table-row">Expected DOC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(report).map((key, index) => (
                        <tr key={index}>
                          <td className=" custom-table-data text-center">
                            {index + 1}
                          </td>
                          <td className=" custom-table-data">
                            {report[key].ReceivedDate}
                          </td>
                          <td className=" custom-table-data">
                            {report[key].OrderNo}
                          </td>
                          <td className=" custom-table-data">
                            {report[key].OrderDetail}
                          </td>
                          <td className=" custom-table-data">
                            {report[key].SiteName}
                          </td>
                          <td className=" custom-table-data">
                            {report[key].DeliveryDate}
                          </td>
                          <td className=" custom-table-data">
                            {report[key].Sc}
                          </td>
                          <td className=" custom-table-data">
                            {report[key].Qty}
                          </td>
                          <td className=" custom-table-data">
                            {report[key].Unit}
                          </td>
                          <td className=" custom-table-data">
                            {report[key].Remarks}
                          </td>
                          <td className=" custom-table-data">
                            {report[key].ExpectedDOC}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
