import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { setDoc, doc, endAt } from "firebase/firestore";

export default function RunningSiteProgressReportUpload() {
  const router = useRouter();

  const today = new Date();
  const date =
    today.getDate() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    today.getFullYear();
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
  const day = ("0" + currentDate.getDate()).slice(-2);
  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);
  const time = hours + "-" + minutes + "-" + seconds;
  const invoiceNumber = `SPR-${day}${month}${year}/${hours}-${minutes}`;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [report, setReport] = useState([
    {
      No: 1,
      Name: "",
      SiteName: "",
      SiteCode: "",
      Designation: "",
      Status: "",
      WorkDescription: "",
      Qty: "",
      Unit: "",
      Remark: "",
      Supervisor: "",
    },
  ]);

  const handleAddRow = () => {
    const row = {
      No: report.length + 1,
      Name: "",
      SiteName: "",
      SiteCode: "",
      Designation: "",
      Status: "",
      WorkDescription: "",
      Qty: "",
      Unit: "",
      Remark: "",
      Supervisor: "",
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
        Site Progress Report
      </p>
      <div className="max-w-full py-4 border border-black px-2 overflow-auto">
        <div>
          <div className=" flex items-center justify-between">
            <div className=" flex flex-col gap-2 w-full">
              <div className=" w-[250px] bg-white border flex items-center justify-between border-black font-semibold pl-4  p-0.5 ">
                <p>From - </p>
                <input
                  id="start-date"
                  name="satrt-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className=" bg-white py-1.5  px-3"
                />
              </div>
              <div className=" w-[250px] bg-white border flex items-center justify-between border-black font-semibold pl-4  p-0.5 ">
                <p>To - </p>
                <input
                  id="start-date"
                  name="satrt-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className=" bg-white py-1.5 inline-block px-3"
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" relative mt-14 pb-4">
          <table className="mt-6 table-auto">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-2 border-gray-400 border">No.</th>
                <th className="px-2 border-gray-400 border">Name</th>
                <th className="px-2 border-gray-400 border">Site Name</th>
                <th className="px-2 border-gray-400 border">Site Code</th>
                <th className="px-2 border-gray-400 border">Designation</th>
                <th className="px-2 border-gray-400 border">Status</th>
                <th className="px-2 border-gray-400 border">
                  Work Description
                </th>
                <th className="px-2 border-gray-400 border">Qty</th>
                <th className="px-2 border-gray-400 border">Unit</th>
                <th className="px-2 border-gray-400 border">Remark</th>
                <th className="px-2 border-gray-400 border">Supervisor</th>
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
                      value={item.Name}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Name = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.SiteName}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].SiteName = e.target.value;
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
                      value={item.Designation}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Designation = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.Status}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Status = e.target.value;
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
          disabled={startDate === "" || endDate === ""}
          className="bg-green-400 hover:bg-green-600 disabled:bg-gray-300 disabled:border-gray-300 border border-black py-2 px-16 font-semibold"
          onClick={() => {
            //convert report to object
            // const reportData = {};
            // report.forEach((item, index) => {
            //   reportData[index] = item;
            // });
            // // // // console.log(reportData);
            //set doc in showroomDbName database with key as date and value as reportData

            setDoc(
              doc(
                db,
                `PMTReports/SiteProgressReports/Reports/${startDate}-to-${endDate}`
              ),
              {
                from: startDate,
                to: endDate,
                data: report,
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
