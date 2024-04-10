import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";

export default function WorkshopReportUpload() {
  const searchParams = useSearchParams();
  // const showroomName = searchParams.get('showroomName')
  // const reportType = searchParams.get('reportParam')
  const [loading, setLoading] = useState(false);
  // const showroomDbNames = {
  //     "Galleria": "galleria-sales-report",
  //     "Mirage": "mirage-sales-report",
  //     "Kisumu": "kisumu-sales-report",
  //     "Mombasa Road": "mombasa-sales-report"
  // }
  // const showroomDbName = showroomDbNames[showroomName]

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

  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);

  const time = hours + "-" + minutes + "-" + seconds;

  // Concatenate date and time components to form the invoice number
  const invoiceNumber = `WR-${day}${month}${year}/${hours}-${minutes}`;

  //   alert(invoiceNumber);
  const [report, setReport] = useState([
    {
      SNo: 1,
      Date: date,
      time: time,
      InvoiceNo: invoiceNumber,
      ReceivedDate: "",
      OrderNo: "",
      OrderDetail: "",
      SiteName: "",
      DeliveryDate: "",
      Sc: "",
      Qty: "",
      Unit: "",
      Remarks: "",
      ExpectedDOC: "",
    },
  ]);

  const handleAddRow = () => {
    const row = {
      SNo: report.length + 1,
      Date: date,
      time: time,
      InvoiceNo: invoiceNumber,
      ReceivedDate: "",
      OrderNo: "",
      OrderDetail: "",
      SiteName: "",
      DeliveryDate: "",
      Sc: "",
      Qty: "",
      Unit: "",
      Remarks: "",
      ExpectedDOC: "",
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
      <div className="w-full pl-8">
        <button
          className="bg-slate-300 p-2 rounded-lg"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <p className="mt-2 text-2xl text-center font-bold mb-6">
        Workshop Uploading Report
      </p>
      <div className="max-w-full py-4 border border-black px-2 overflow-auto">
        <div>
          <div className=" flex items-center justify-between">
            <div className=" border border-black font-semibold p-1.5 px-4 w-fit ">
              <p>Invoice No. - {invoiceNumber}</p>
            </div>
            {/* <div>
              
              <button
                onClick={() => {
                  router.push("/Workshop/WorkshopReportHistory");
                }}
                className="bg-transparent border border-black py-2 px-6 font-semibold"
              >
                Check
              </button>
            </div> */}
          </div>
        </div>
        <div className=" relative mt-14 pb-4">
          <p className=" absolute -top-5 right-0 text-[12px]">
            By Default Expected DOC(Date of Completion) is{" "}
            <span className=" font-bold"> On Hold</span>. Click to add your
            ExpectedDOC .
          </p>
          <table className="mt-6 table-auto">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-2 border-gray-400 border">Sl. No.</th>
                <th className="px-2 border-gray-400 border">Received Date</th>
                <th className="px-2 border-gray-400 border">Order No.</th>
                <th className="px-2 border-gray-400 border">Order Detail</th>
                <th className="px-2 border-gray-400 border">Site Name</th>
                <th className="px-2 border-gray-400 border">Delivery Date</th>
                <th className="px-2 border-gray-400 border">Sc</th>
                <th className="px-2 border-gray-400 border">Qty.</th>
                <th className="px-2 border-gray-400 border">Units</th>
                <th className="px-2 border-gray-400 border">Remarks</th>
                <th className="px-2 border-gray-400 border">Expected DOC</th>
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
                      type="date"
                      value={item.ReceivedDate}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].ReceivedDate = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.OrderNo}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].OrderNo = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.OrderDetail}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].OrderDetail = e.target.value;
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
                      type="date"
                      value={item.DeliveryDate}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].DeliveryDate = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.Sc}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Sc = e.target.value;
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
                      value={item.Remarks}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Remarks = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400 border-l-0 border-t-0 flex items-center gap-1 p-1.5 ">
                    <p
                      className={`text-gray-500 text-[15px] select-none pb-1 ${
                        item.ExpectedDOC.toLowerCase() !== ""
                          ? "hidden"
                          : " text-right w-full"
                      } `}
                    >
                      on hold /
                    </p>
                    <input
                      type="date"
                      placeholder="On hold (Default)"
                      value={item.ExpectedDOC}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].ExpectedDOC = e.target.value;
                        setReport(list);
                      }}
                      className={`${
                        item.ExpectedDOC.toLowerCase() !== ""
                          ? "w-full"
                          : "w-6 "
                      } `}
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
          className="bg-green-400 hover:bg-green-600 border border-black py-2 px-16 font-semibold"
          onClick={() => {
            //convert report to object
            const reportData = {};
            report.forEach((item, index) => {
              reportData[index] = item;
            });
            //   console.logF(reportData);
            //set doc in showroomDbName database with key as date and value as reportData
            setDoc(doc(db, "Workshop-Reports", `${date}-${time}`), reportData);
            alert("Report Uploaded Successfully");
            router.push("/");
          }}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
