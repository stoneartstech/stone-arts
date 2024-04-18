import React, { useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";

export default function RunningSitesBalanceReportUpload() {
  const router = useRouter();

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

  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);

  const time = hours + "-" + minutes + "-" + seconds;

  const invoiceNumber = `${day}-${month}-${year}-${hours}-${minutes}`;
  const [report, setReport] = useState([
    {
      SNo: 1,
      ClientName: "",
      SiteCode: "",
      WorkDescription: "",
      Supervisor: "",
      SiteLocation: "",
      BQAmount: "",
      AmountPaid: "",
      Balance: "",
      Remark: "",
    },
  ]);

  const handleAddRow = () => {
    const row = {
      SNo: report.length + 1,
      ClientName: "",
      SiteCode: "",
      WorkDescription: "",
      Supervisor: "",
      SiteLocation: "",
      BQAmount: "",
      AmountPaid: "",
      Balance: "",
      Remark: "",
    };
    setReport([...report, row]);
  };
  const handleRemoveRow = (index) => {
    const list = [...report];
    list.splice(-1);
    setReport(list);
  };
  return (
    <div>
      <div className="w-full md:pl-8">
        <button
          className="bg-slate-300 p-2 rounded-lg"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <p className="mt-2 text-2xl text-center font-bold mb-6">
        Running Sites Balance Report
      </p>
      <div className="max-w-full py-4 border border-black px-2 overflow-auto">
        <div>
          <div className=" flex items-center justify-between">
            <div className=" flex gap-2 flex-col w-full  ">
              <div className=" flex flex-col gap-1  font-semibold p-0.5 ">
                <p className=" border border-black w-[200px] p-1.5">
                  {invoiceNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" relative mt-14 pb-4">
          <table className="mt-6 table-auto">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-2 border-gray-400 border">Sl. No.</th>
                <th className="px-2 border-gray-400 border">Client Name</th>
                <th className="px-2 border-gray-400 border">Site Code</th>
                <th className="px-2 border-gray-400 border">
                  Work Description
                </th>
                <th className="px-2 border-gray-400 border">Supervisor</th>
                <th className="px-2 border-gray-400 border">Site Location</th>
                <th className="px-2 border-gray-400 border">BQ Amount</th>
                <th className="px-2 border-gray-400 border">Amount Paid</th>
                <th className="px-2 border-gray-400 border">Balance</th>
                <th className="px-2 border-gray-400 border">Remark</th>
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
                      type="text"
                      value={item.ClientName}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].ClientName = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.SiteCode}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].SiteCode = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.WorkDescription}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].WorkDescription = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.Supervisor}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Supervisor = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.SiteLocation}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].SiteLocation = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="number"
                      value={item.BQAmount}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].BQAmount = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="number"
                      value={item.AmountPaid}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].AmountPaid = e.target.value;
                        const updatedBalance =
                          parseFloat(item?.BQAmount) -
                          parseFloat(item?.AmountPaid).toFixed(3);
                        list[index].Balance = updatedBalance;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="number"
                      value={
                        item?.BQAmount && item?.AmountPaid
                          ? parseFloat(item?.BQAmount) -
                            parseFloat(item?.AmountPaid).toFixed(3)
                          : ""
                      }
                      onChange={(e) => {}}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.Remark}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Remark = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="bg-slate-400 mt-2 font-semibold text-sm hover:bg-green-500 p-2.5 rounded-lg"
            onClick={handleAddRow}
          >
            + Add Row
          </button>
          <button
            className="bg-slate-400 mt-2 ml-2 font-semibold text-sm hover:bg-red-500 p-2.5 rounded-lg"
            onClick={handleRemoveRow}
          >
            Remove Row
          </button>
        </div>
        <button
          disabled={report[0]?.ClientName === ""}
          className="bg-green-400 hover:bg-green-600 disabled:bg-gray-300 disabled:border-gray-300 border border-black py-2 px-16 font-semibold"
          onClick={() => {
            setDoc(
              doc(db, `PMTReports/RunningSiteBalance/Reports/${invoiceNumber}`),
              {
                invoiceNumber: invoiceNumber,
                data: report,
                date: date,
              }
            );
            alert("Report Uploaded Successfully");
            router.push("/PMTHead/Reports");
          }}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
