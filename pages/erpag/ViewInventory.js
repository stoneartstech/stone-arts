import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import * as XLSX from "xlsx";

export default function ViewInventory() {
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
    setLoading(true);
    const fetch = onSnapshot(
      collection(db, "erpag/Inventory/mainWarehouse"),
      (snapshot) => {
        var reports = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setReports(reports);
        console.log(reports);
      }
    );
    setLoading(false);
    // console.log(reports);
    return fetch;
  }, []);

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
    <div div className=" w-full overflow-x-auto">
      {!loading && (
        <div>
          <div className="w-full pl-6 overflow-x-auto">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-3xl mb-4">Inventory</p>
          </div>

          <table className="table-auto overflow-x-auto">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-2 border-gray-400 border">Sl.</th>
                <th className="px-2 border-gray-400 border">Name</th>
                <th className="px-2 border-gray-400 border">SKU</th>
                <th className="px-2 border-gray-400 border">Quantity</th>
                <th className="px-2 border-gray-400 border">UOM</th>
                <th className="px-2 border-gray-400 border">Stock Price</th>
                <th className="px-2 border-gray-400 border">Stock Amount</th>
                <th className="px-2 border-gray-400 border">Additional Info</th>
              </tr>
            </thead>
            <tbody className="">
              {reports.map((item, index) => (
                <tr key={index}>
                  <td className="bg-white border border-gray-400 text-center p-1">
                    {index + 1}
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.name}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.sku}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.quantity}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.UOM}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="number"
                      value={item.stockPrice}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="number"
                      value={item.stockAmount}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.addInfo}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
