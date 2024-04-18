import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { db, storage } from "../../firebase";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function SupervisorDailyReportUpload() {
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
  const weekEnd = ("0" + currentDate.getDate()).slice(-2);
  const weekStart = ("0" + currentDate.getDate()).slice(-2) - 7;
  //   console.log(`${date}-${month}-${year}`);

  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);

  const time = hours + "-" + minutes + "-" + seconds;

  // Concatenate date and time components to form the invoice number
  const invoiceNumber = `WR-${day}${month}${year}/${hours}-${minutes}`;

  //   alert(invoiceNumber);
  const [supervisorName, setSupervisorName] = useState("");
  const [report, setReport] = useState([
    {
      SNo: 1,
      NameofFundi: "",
      SiteName: "",
      date: date,
      SCode: "",
      FH: "",
      WorkDescription: "",
      Qty: "",
      SqmLm: "",
      Remark: "",
      Picture: "",
    },
  ]);

  const handleAddRow = () => {
    const row = {
      SNo: report.length + 1,
      NameofFundi: "",
      SiteName: "",
      date: date,
      SCode: "",
      FH: "",
      WorkDescription: "",
      Qty: "",
      SqmLm: "",
      Remark: "",
      Picture: "",
    };
    setReport([...report, row]);
  };
  const handleRemoveRow = (index) => {
    const list = [...report];
    list.splice(-1);
    setReport(list);
  };
  const handleUploadReportImages = async (qsId, event) => {
    const file = event.target.files[0];
    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(
        storage,
        `PMTImages/SupervisorDaily/${date}/${qsId}`
      );
      await uploadBytes(storageRef, file);

      // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      const newData = report.map((row) =>
        row.SNo === qsId ? { ...row, Picture: downloadURL } : row
      );
      setReport(newData);
    } catch (error) {
      console.log(error);
    }
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
        Site Supervisor Report (Daily)
      </p>
      <div className="max-w-full py-4 border border-black px-2 overflow-auto">
        <div>
          <div className=" flex items-center justify-between">
            <div className=" flex flex-col gap-1 md:flex-row w-full items-center justify-between ">
              <div className=" border border-black font-semibold pl-4 w-fit p-0.5 ">
                <p>
                  Supervisor Name -{" "}
                  <input
                    id="supervisor-name"
                    name="supervisor-name"
                    placeholder="Supervisor Name"
                    value={supervisorName}
                    onChange={(e) => {
                      setSupervisorName(e.target.value);
                    }}
                    className=" bg-white py-1.5  px-3"
                  />
                </p>
              </div>
              <div className=" border border-black font-semibold px-4 py-0.5 w-full md:w-fit p-0.5 ">
                <p className=" py-1.5">Date : {date}</p>
              </div>
            </div>
          </div>
        </div>
        <div className=" relative mt-14 pb-4">
          <table className="mt-6 table-auto">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-2 border-gray-400 border">Sl. No.</th>
                <th className="px-2 border-gray-400 border">
                  Name of the Fundi
                </th>
                <th className="px-2 border-gray-400 border">Site Name</th>
                <th className="px-2 border-gray-400 border">S. Code</th>
                <th className="px-2 border-gray-400 border">F/H</th>
                <th className="px-2 border-gray-400 border">
                  Work Description
                </th>
                <th className="px-2 border-gray-400 border">Q.T.Y</th>
                <th className="px-2 border-gray-400 border">Sqm/Lm</th>
                <th className="px-2 border-gray-400 border">Remark</th>
                <th className="px-2 border-gray-400 border">Picture</th>
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
                      value={item.NameofFundi}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].NameofFundi = e.target.value;
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
                      value={item.SCode}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].SCode = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.FH}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].FH = e.target.value;
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
                      value={item.SqmLm}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].SqmLm = e.target.value;
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
                      type="file"
                      id={`image-${index}`}
                      name="image"
                      value={item.name}
                      onChange={(e) => {
                        handleUploadReportImages(item.SNo, e);
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
          disabled={supervisorName === ""}
          className="bg-green-400 hover:bg-green-600 disabled:bg-gray-300 disabled:border-gray-300 border border-black py-2 px-16 font-semibold"
          onClick={() => {
            //convert report to object
            // const reportData = {};
            // report.forEach((item, index) => {
            //   reportData[index] = item;
            // });
            // console.log(reportData);
            //set doc in showroomDbName database with key as date and value as reportData
            setDoc(doc(db, `PMTReports/SupervisorReports/Daily/${date}`), {
              SupervisorName: supervisorName,
              date: date,
              data: report,
            });
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
