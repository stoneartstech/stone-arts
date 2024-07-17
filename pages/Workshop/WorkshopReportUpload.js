import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

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
    if (report?.length > 1) {
      const list = [...report];
      list.splice(-1);
      setReport(list);
    }
  };

  return (
    <div>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
      <div className="w-full  md:pl-8">
        <button
          type="button"
          className="go-back-btn"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <h3 className="page-heading">Workshop Uploading Report</h3>
      <form
        onSubmit={(e) => {
          try {
            e.preventDefault();
            //convert report to object
            const reportData = {};
            report.forEach((item, index) => {
              reportData[index] = item;
            });
            //   console.logF(reportData);
            //set doc in showroomDbName database with key as date and value as reportData
            setDoc(doc(db, "Workshop-Reports", `${date}-${time}`), reportData);
            enqueueSnackbar("Report Uploaded Successfully", {
              variant: "success",
            });
            router.push("/");
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
          <p className=" absolute -top-10 md:-top-5 right-0 text-[12px]">
            By Default Expected DOC(Date of Completion) is{" "}
            <span className=" font-bold"> On Hold</span>. Click to add your
            ExpectedDOC .
          </p>
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
            <tbody className="">
              {report.map((item, index) => (
                <tr key={index}>
                  <td className="custom-table-data text-center p-1">
                    {index + 1}
                  </td>
                  <td className="custom-table-data">
                    <input
                      required
                      type="date"
                      value={item.ReceivedDate}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].ReceivedDate = e.target.value;
                        setReport(list);
                      }}
                      className="custom-table-input"
                    />
                  </td>
                  <td className="custom-table-data">
                    <input
                      required
                      type="text"
                      value={item.OrderNo}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].OrderNo = e.target.value;
                        setReport(list);
                      }}
                      className="custom-table-input"
                    />
                  </td>
                  <td className="custom-table-data">
                    <input
                      required
                      type="text"
                      value={item.OrderDetail}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].OrderDetail = e.target.value;
                        setReport(list);
                      }}
                      className="custom-table-input"
                    />
                  </td>
                  <td className="custom-table-data">
                    <input
                      required
                      type="text"
                      value={item.SiteName}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].SiteName = e.target.value;
                        setReport(list);
                      }}
                      className="custom-table-input"
                    />
                  </td>
                  <td className="custom-table-data">
                    <input
                      required
                      type="date"
                      value={item.DeliveryDate}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].DeliveryDate = e.target.value;
                        setReport(list);
                      }}
                      className="custom-table-input"
                    />
                  </td>
                  <td className="custom-table-data">
                    <input
                      required
                      type="text"
                      value={item.Sc}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Sc = e.target.value;
                        setReport(list);
                      }}
                      className="custom-table-input"
                    />
                  </td>
                  <td className="custom-table-data">
                    <input
                      required
                      type="number"
                      value={item.Qty}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Qty = e.target.value;
                        setReport(list);
                      }}
                      className="custom-table-input"
                    />
                  </td>
                  <td className="custom-table-data">
                    <input
                      required
                      type="text"
                      value={item.Unit}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Unit = e.target.value;
                        setReport(list);
                      }}
                      className="custom-table-input"
                    />
                  </td>
                  <td className="custom-table-data">
                    <input
                      required
                      type="text"
                      value={item.Remarks}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Remarks = e.target.value;
                        setReport(list);
                      }}
                      className="custom-table-input"
                    />
                  </td>
                  <td className="custom-table-data border-l-0 border-t-0 flex items-center gap-1 p-1.5 ">
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
                      required
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
          <button type="button" className="add-row-btn" onClick={handleAddRow}>
            + Add Row
          </button>
          <button
            type="button"
            className="delete-row-btn"
            onClick={handleRemoveRow}
          >
            Remove Row
          </button>
        </div>
        <button
          disabled={report[0]?.ReceivedDate === ""}
          type="submit"
          className=" upload-form-btn"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
