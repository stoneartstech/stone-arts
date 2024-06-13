import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

export default function ViewInvoice() {
  const searchParams = useSearchParams();
  const showroomName = searchParams.get("showroomName");

  const invoiceDbNames = {
    Galleria: "invoices",
    Mirage: "mirage-invoices",
    Kisumu: "kisumu-invoices",
    "Mombasa Road": "mombasa-invoices",
  };
  const invoiceDbName = invoiceDbNames[showroomName];

  const showroomDbNames = {
    Galleria: "clients",
    Mirage: "mirage-clients",
    Kisumu: "kisumu-clients",
    "Mombasa Road": "mombasa-clients",
  };
  const showroomDbName = showroomDbNames[showroomName];
  //   console.log(showroomDbName);

  const [loading, setLoading] = useState(true);
  const [dummyRequests, setDummyRequests] = useState([
    {
      name: "Patrick",
      clientCode: "16",
    },
    {
      name: "Suzie",
      clientCode: "14",
    },
  ]);
  const [clientRequests, setClientRequests] = useState([]);
  const [originalClientRequests, setOriginalClientRequests] = useState([]);
  const [invoiceRequests, setInvoiceRequest] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetch = onSnapshot(collection(db, showroomDbName), (snapshot) => {
      var requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      requests = requests.filter(
        (clientRequest) => clientRequest.option === "retail"
      );
      requests.forEach((clientRequest) => {
        if (Array.isArray(clientRequest.aspects)) {
          clientRequest.aspects = clientRequest.aspects.join(",");
        }
      });
      setOriginalClientRequests(requests);
      requests = requests.filter((clientRequest) => !clientRequest.invoice);
      setClientRequests(requests);
    });

    const fetch2 = onSnapshot(collection(db, invoiceDbName), (snapshot) => {
      var requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);

      // Function to convert timestamp to date
      function convertTimestampToDate(timestamp) {
        const milliseconds =
          timestamp?.seconds * 1000 + Math.round(timestamp?.nanoseconds / 1e6);
        return new Date(milliseconds);
      }

      // Iterate through each object and convert timestamp to date
      const newArray = requests.map((obj) => {
        return {
          ...obj,
          timestamp: convertTimestampToDate(obj.timestamp).toDateString(),
        };
      });

      setInvoiceRequest(newArray);
      setFilteredInvoices(newArray);
    });
    return fetch;
  }, []);

  const handleOpenInvoice = (clientId) => {
    const invoiceRequest = invoiceRequests.find(
      (request) => request.clientId == clientId
    );
    window.open(invoiceRequest.invoiceURL);
  };

  const handleCheckInfo = (clientId) => {
    const clientRequest = originalClientRequests.filter(
      (request) => request.clientId === clientId
    );
    alert(`First Name: ${clientRequest[0]?.name}
            \nLast Name: ${clientRequest[0]?.lastname}
         \nClient Code: ${clientRequest[0]?.clientId}
         \nPhone Number: ${clientRequest[0]?.phoneNumber}
         \nEmail: ${clientRequest[0]?.email}
         \nAddress: ${clientRequest[0]?.address}
         \nDate of Request: ${clientRequest[0]?.date}
         \nSalesperson: ${clientRequest[0]?.salesPerson}
         \nAspects: ${clientRequest[0]?.aspects}
         \nOption: ${clientRequest[0]?.option}`);
  };
  const [selectedReportDate, setSelectedReportDate] = useState(-1);
  const handleClick = (reportDate, reportTime) => {
    setSelectedReportDate(
      reportDate === selectedReportDate ? null : reportDate + "-" + reportTime
    );
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchName, setSearchName] = useState("");

  function handleDateSearch() {
    if (startDate === "" || endDate === "") {
      alert("Please select a date range");
      setFilteredInvoices(invoiceRequests);
      return;
    }
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        alert("End date should be greater than start date");
        return;
      } else {
        const filteredReports = invoiceRequests.filter((report, index) => {
          const reportDate = new Date(report?.timestamp);
          const start = new Date(startDate);
          const end = new Date(endDate);
          //   console.log(reportDate, start, end);
          return reportDate >= start && reportDate <= end;
        });

        setFilteredInvoices(filteredReports);
        setLoading(false);
        return fetch;
      }
    }
  }

  return (
    <div>
      {!loading && (
        <div>
          <div className="w-full pl-8">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
          <p className="text-2xl text-center font-bold mb-2">INVOICE</p>
          <p className=" text-gray-700 text-xl mb-2 text-center font-bold">
            Check Uploaded Invoices
          </p>
          <div className=" flex items-center justify-center gap-4 mb-5">
            <div className=" flex  w-fit border border-black ">
              <input
                type="text"
                placeholder="search by name"
                id="search"
                autoComplete="off"
                value={searchName}
                onChange={(e) => {
                  return setSearchName(e.target.value);
                }}
                name="search"
                className=" px-3  py-2 outline-none "
              />
              <button className=" bg-gray-300 py-2 px-4  border-l border-black font-semibold text-sm">
                Search
              </button>
            </div>
            <div className="my-4 flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-black p-2"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-black p-2"
              />
              <button
                className="bg-gray-300 py-2 px-4 font-semibold text-sm -ml-2 border-black border border-l-0"
                onClick={handleDateSearch}
              >
                Search
              </button>
            </div>
          </div>
          {filteredInvoices
            .filter((item) => {
              if (searchName.toLowerCase() !== "") {
                return item?.name
                  ?.toLowerCase()
                  .includes(searchName.toLowerCase());
              } else {
                return item;
              }
            })
            .map((invoiceRequest, index) => (
              <div
                key={index}
                className="items-center sm:mx-24 grid grid-cols-3 gap-x-12 mb-4"
              >
                <p className="text-lg">
                  {invoiceRequest.name} ({invoiceRequest.clientId})
                </p>
                <button
                  onClick={() => handleOpenInvoice(invoiceRequest.clientId)}
                  className="bg-green-400 hover:bg-green-500 p-2"
                >
                  Check Invoice
                </button>
                <button
                  onClick={() => {
                    handleCheckInfo(invoiceRequest.clientId);
                  }}
                  className="bg-green-400 hover:bg-green-500 p-2"
                >
                  Check Information
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
