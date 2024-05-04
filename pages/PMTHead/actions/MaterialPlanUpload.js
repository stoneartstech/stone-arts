import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/router";
// import { db, storage } from "../../firebase";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/firebase";

export default function MaterialPlanUpload() {
  const router = useRouter();
  const { query } = router;
  const { qsName, clientName } = query;
  const [siteName, setSiteName] = useState("");
  const [siteCode, setSiteCode] = useState("");
  const [designerName, setDesignereName] = useState("");
  const [siteSupervisorName, setSiteSupervisorName] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [fileArr, setFileArr] = useState("");
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
  //   // console.log(`${date}-${month}-${year}`);

  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);

  const time = hours + "-" + minutes + "-" + seconds;

  // Concatenate date and time components to form the invoice number
  const invoiceNumber = `${day}-${month}-${year}-${hours}-${minutes}`;

  //   alert(invoiceNumber);
  const [supervisorName, setSupervisorName] = useState("");
  const [report, setReport] = useState([
    {
      No: 1,
      MaterialName: "",
      Description: "",
      Location: "",
      Unit: "",
      Qty: "",
    },
  ]);

  const handleAddRow = () => {
    const row = {
      SNo: report.length + 1,
      MaterialName: "",
      Description: "",
      Location: "",
      Unit: "",
      Qty: "",
    };
    setReport([...report, row]);
  };
  const handleRemoveRow = (index) => {
    const list = [...report];
    list.splice(-1);
    setReport(list);
  };
  const handleUploadReportImages = async (e) => {
    const file = e.target.files[0];
    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(
        storage,
        `PMTImages/PendingSites/MaterialsFile/${siteCode}`
      );
      await uploadBytes(storageRef, file);

      // Get the download URL for the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      setFileLink(downloadURL);
      console.log("image Uploaded");
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
        Upload Materials Plan For a Site
      </p>
      <div className="max-w-full py-4 border border-black px-2 overflow-auto">
        <div>
          <div className=" flex items-center justify-between">
            <div className="  grid grid-cols-3 gap-2  w-full  ">
              <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                <label className=" font-medium">Site Name</label>
                <input
                  type="text"
                  className=" border border-black w-[200px] p-1.5"
                  value={siteName}
                  placeholder="Site Name"
                  onChange={(e) => {
                    setSiteName(e.target.value);
                  }}
                />
              </div>
              <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                <label className=" font-medium">Site Code</label>
                <input
                  type="text"
                  className=" border border-black w-[200px] p-1.5"
                  value={siteCode}
                  placeholder="Site Code"
                  onChange={(e) => {
                    setSiteCode(e.target.value);
                  }}
                />
              </div>
              <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                <label className=" font-medium">Client Name</label>
                <p className=" border border-black w-[200px] p-1.5">
                  {clientName}
                </p>
              </div>
              <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                <label className=" font-medium">Designer Name</label>
                <input
                  type="text"
                  className=" border border-black w-[200px] p-1.5"
                  value={designerName}
                  placeholder="Designer Name"
                  onChange={(e) => {
                    setDesignereName(e.target.value);
                  }}
                />
              </div>
              <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                <label className=" font-medium">Qs Name</label>
                <p className=" border border-black w-[200px] p-1.5">{qsName}</p>
              </div>
              <div className=" flex flex-col items-center  font-semibold p-0.5 ">
                <label className=" font-medium">Site Supervisor Name</label>
                <input
                  type="text"
                  className=" border border-black w-[200px] p-1.5"
                  value={siteSupervisorName}
                  placeholder="Site Supervisor Name"
                  onChange={(e) => {
                    setSiteSupervisorName(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" relative mt-14 pb-4">
          <table className="mt-6 table-auto">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-2 border-gray-400 border">Sl. No.</th>
                <th className="px-2 border-gray-400 border">Material Name</th>
                <th className="px-2 border-gray-400 border">Description</th>
                <th className="px-2 border-gray-400 border">Unit</th>
                <th className="px-2 border-gray-400 border">Qty</th>
                <th className="px-2 border-gray-400 border">Location</th>
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
                      value={item.MaterialName}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].MaterialName = e.target.value;
                        setReport(list);
                      }}
                      className="w-full px-2 border-none outline-none"
                    />
                  </td>
                  <td className="bg-white border border-gray-400">
                    <input
                      type="text"
                      value={item.Description}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Description = e.target.value;
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
                      value={item.Location}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].Location = e.target.value;
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
        <div className=" flex items-end justify-between">
          <div className=" flex flex-col ml-4">
            <label className=" font-medium  mb-1">Upload a file</label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={(e) => {
                handleUploadReportImages(e);
              }}
            />
            {/* <button
              disabled={report[0]?.Client === ""}
              className="bg-green-400 hover:bg-green-600 disabled:bg-gray-300 disabled:border-gray-300 border border-black py-2 px-16 font-semibold w-fit mt-3"
              onClick={(e) => {
                
              }}
            >
              Upload
            </button> */}
          </div>
          <button
            disabled={report[0]?.Client === ""}
            className="bg-green-400 hover:bg-green-600 disabled:bg-gray-300 disabled:border-gray-300 border border-black py-2 px-16 font-semibold"
            onClick={() => {
              //convert report to object
              // const reportData = {};
              // report.forEach((item, index) => {
              //   reportData[index] = item;
              // });
              // console.log(reportData);
              //set doc in showroomDbName database with key as date and value as reportData
              setDoc(
                doc(
                  db,
                  `PMTReports/PendingSiteReport/MaterialPlan/${siteCode}`
                ),
                {
                  siteName: siteName,
                  siteCode: siteCode,
                  clientName: clientName,
                  designerName: designerName,
                  qsName: qsName,
                  siteSupervisorName: siteSupervisorName,
                  data: report,
                  fileLink: fileLink,
                  date: date,
                }
              );
              // console.log(report);
              alert("Plan Uploaded Successfully");
              router.push("/PMTHead/PendingSites");
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
