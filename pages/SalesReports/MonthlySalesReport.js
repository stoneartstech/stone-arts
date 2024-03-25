import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import * as XLSX from "xlsx";
import { yearsArray, monthsArray } from "@/utils/Date";

const MonthlySalesReport = () => {
  const searchParams = useSearchParams();
  const showroomName = searchParams.get("showroomName");
  // const reportType = searchParams.get('reportParam')
  const [loading, setLoading] = useState(true);

  const [monthlyInvoiceValue, setMonthlyInvoiceValue] = useState(-1);
  const [monthlyTaxAmt, setMonthlyTaxAmt] = useState(-1);
  const [monthlyTotal, setMonthlyTotal] = useState(-1);
  const [monthlyPayment, setMonthlyPayment] = useState(-1);
  const [monthlyBalance, setMonthlyBalance] = useState(-1);

  const showroomDbNames = {
    Galleria: "galleria-sales-report",
    Mirage: "mirage-sales-report",
    Kisumu: "kisumu-sales-report",
    "Mombasa Road": "mombasa-sales-report",
  };
  const showroomDbName = showroomDbNames[showroomName];
  const router = useRouter();

  const [reportsYear, setReportsYear] = useState(false);
  const [reportsMonth, setReportsMonth] = useState(false);
  const [isTableView, setisTableView] = useState(false);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // to get current year's date
    let date = new Date().getFullYear();
    setReportsYear(date);
  }, []);

  useEffect(() => {
    // fetching data
    const fetch = onSnapshot(collection(db, showroomDbName), (snapshot) => {
      var reports = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // getting date parts to filter using it
      const getDateParts = (dateString) => {
        const [day, month, year] = dateString.split("-").map(Number);
        return { day, month, year };
      };

      var monthFilteredData = reports.filter((item) => {
        return (
          getDateParts(item[0].Date).month === reportsMonth.value &&
          getDateParts(item[0].Date).year === reportsYear
        );
      });
      // function to get total values
      const getTotalValue = (array, TotalValue) => {
        return array.reduce((totalMoney, currentValue) => {
          return totalMoney + Number(currentValue[0][TotalValue]);
        }, 0);
      };

      setMonthlyBalance(getTotalValue(monthFilteredData, "Balance"));
      setMonthlyInvoiceValue(getTotalValue(monthFilteredData, "InvoiceValue"));
      setMonthlyPayment(getTotalValue(monthFilteredData, "Payment"));
      setMonthlyTaxAmt(getTotalValue(monthFilteredData, "Tax"));
      setMonthlyTotal(getTotalValue(monthFilteredData, "TotalValue"));

      //   converting "array of objects" to "array of arrays" to use "aoa_to_sheet" method of xlsx ---------------------------------------------------
      const arrayOfArray = monthFilteredData.map((report) => [
        report[0].Date,
        report[0].ClientName,
        report[0].Supply,
        report[0].SupplyFix,
        report[0].InvoiceNo,
        report[0].InvoiceValue,
        report[0].Tax,
        report[0].TotalValue,
        report[0].Payment,
        report[0].ModeOfPayment,
        report[0].Balance,
      ]);
      setReports(arrayOfArray);
    });
    setLoading(false);
    return fetch;
  }, [isTableView, reportsMonth]);

  function handleExportToExcel() {
    const arrayOfArray = reports;
    const headers = [
      "Date",
      "Client Name",
      "Supply",
      "Supply & Fix",
      "Invoice No.",
      "Invoice Value",
      "Tax Amount",
      "Total including Tax",
      "Payment",
      "Mode of Payment",
      "Balance",
    ];
    const totals = [
      "Total",
      "",
      "",
      "",
      "",
      monthlyInvoiceValue,
      monthlyTaxAmt,
      monthlyTotal,
      monthlyPayment,
      "",
      monthlyBalance,
    ];
    arrayOfArray.unshift(headers);
    arrayOfArray.push(totals);

    const workSheet = XLSX.utils.aoa_to_sheet(arrayOfArray);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
    XLSX.writeFile(
      workBook,
      `${reportsMonth.name}-${reportsYear}-${showroomDbName}.xlsx`
    );
  }

  return (
    <>
      {!loading && (
        <div>
          <div className="w-full md:pl-6 mb-2">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => {
                if (isTableView) {
                  setisTableView(false);
                } else {
                  router.back();
                }
              }}
            >
              Go Back
            </button>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-2xl md:text-3xl mb-2">
              Monthly Sales Reports History of Year - {reportsYear}
            </p>
          </div>
          {!isTableView && (
            <div className="my-4 px-2 mx-auto flex items-center font-bold text-base md:text-lg gap-4">
              <label htmlFor="yearsList">Select Year</label>
              <select
                name="yearsList"
                id="yearsList"
                value={reportsYear}
                onChange={(e) => {
                  setReportsYear(e.target.value);
                }}
                className=" text-base font-normal w-28 h-8 text-center border-2 rounded-md border-blue-500 "
              >
                {yearsArray.map((year, index) => {
                  return (
                    <option key={index} value={year}>
                      <span>{year}</span>
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          <div className="max-w-full overflow-auto">
            {!isTableView ? (
              // Months Grid View ----------------------------------------------------------------------
              <div className=" p-0 md:p-2  grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 my-2">
                {monthsArray.map((month, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setReportsMonth(month);
                        setisTableView(true);
                      }}
                      className="flex flex-col h-28 bg-slate-400/60 rounded-md items-center justify-center cursor-pointer hover:scale-[1.02] "
                    >
                      <p className=" text-xs md:text-sm text-black/90 ">
                        Get Monthly report of{" "}
                      </p>
                      <div className=" font-bold text-base md:text-lg uppercase ">
                        {month.name}, {reportsYear}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Table View ----------------------------------------------------------------------
              <div className="p-2 bg-slate-300  my-2">
                <div className="flex flex-row justify-between items-center">
                  <p>
                    Report of :{" "}
                    <span className="font-bold">
                      {reportsMonth.name}, {reportsYear}
                    </span>
                  </p>
                  <button
                    className="bg-slate-400 p-2"
                    onClick={() => handleExportToExcel()}
                  >
                    Export to Excel
                  </button>
                </div>

                <table className="table-auto w-full mt-4">
                  <thead>
                    <tr>
                      <th className="p-2 border border-black">S. No.</th>
                      <th className="p-2 border border-black">Date</th>
                      <th className="p-2 border border-black">Client Name</th>
                      <th className="p-2 border border-black">Supply</th>
                      <th className="p-2 border border-black">Supply & Fix</th>
                      <th className="p-2 border border-black">Invoice No.</th>
                      <th className="p-2 border border-black">Invoice Value</th>
                      <th className="p-2 border border-black">Tax Amount</th>
                      <th className="p-2 border border-black">
                        Total including Tax
                      </th>
                      <th className="p-2 border border-black">Payment</th>
                      <th className="p-2 border border-black">
                        Mode of Payment
                      </th>
                      <th className="p-2 border border-black">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((row, index) => (
                      <tr key={index}>
                        <td className={`border border-black p-2 `}>
                          {index + 1}
                        </td>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`border border-black p-2 `}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th className="p-2 text-left border border-black">
                        Total
                      </th>
                      <th className="p-2 text-left border border-black"></th>
                      <th className="p-2 text-left border border-black"></th>
                      <th className="p-2 text-left border border-black"></th>
                      <th className="p-2 text-left border border-black"></th>
                      <th className="p-2 text-left border border-black"></th>
                      <th className="p-2 text-left border border-black">
                        {monthlyInvoiceValue}
                      </th>
                      <th className="p-2 text-left border border-black">
                        {monthlyTaxAmt}
                      </th>
                      <th className="p-2 text-left border border-black">
                        {monthlyTotal}
                      </th>
                      <th className="p-2 text-left border border-black">
                        {monthlyPayment}
                      </th>
                      <th className="p-2 text-left border border-black"></th>
                      <th className="p-2 text-left border border-black">
                        {monthlyBalance}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MonthlySalesReport;
