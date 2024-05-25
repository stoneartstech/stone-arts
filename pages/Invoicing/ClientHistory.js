import React, { useState, useEffect, useMemo } from "react";
import { useTable } from "react-table";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { IoPencil } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import { useRouter } from "next/router";
import { db } from "@/firebase";
export default function ClientHistory({ showroomName }) {
  const showroomDbNames = [
    "clients",
    "mirage-clients",
    "kisumu-clients",
    "mombasa-clients",
  ];

  const [clientRequests, setClientRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [originalClientRequests, setOriginalClientRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const allShowroomData = [];

    const unsubscribeFunctions = showroomDbNames.map((showroom) => {
      return onSnapshot(collection(db, showroom), (snapshot) => {
        const requests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        requests.forEach((clientRequest) => {
          if (clientRequest.aspects) {
            clientRequest.aspects = clientRequest.aspects.join(",");
          }
          clientRequest.date = clientRequest.date; // Ensure date formatting if needed
        });

        // Sorting the requests
        requests.sort((a, b) => b.clientId - a.clientId);

        // Find if the showroom data already exists
        const index = allShowroomData.findIndex(
          (item) => item.showroomName === showroom
        );
        if (index !== -1) {
          // Update the existing entry
          allShowroomData[index].data = requests;
        } else {
          // Add new entry
          if (showroom === "clients") {
            allShowroomData.push({
              showroomName: showroom,
              showroomDB: "Galleria",
              data: requests,
            });
          } else if (showroom === "mirage-clients") {
            allShowroomData.push({
              showroomName: showroom,
              showroomDB: "Mirage",
              data: requests,
            });
          } else if (showroom === "kisumu-clients") {
            allShowroomData.push({
              showroomName: showroom,
              showroomDB: "Kisumu",
              data: requests,
            });
          } else if (showroom === "mombasa-clients") {
            allShowroomData.push({
              showroomName: showroom,
              showroomDB: "Mombasa Road",
              data: requests,
            });
          }
        }

        // Update state with the combined results
        setClientRequests([...allShowroomData]);
        setOriginalClientRequests([...allShowroomData]);
        setLoading(false);
        // console.log(allShowroomData);
      });
    });
    setAllRequests(
      originalClientRequests.flatMap((entry) =>
        entry.data.map((client) => ({
          ...client,
          showroomName: entry.showroomName,
          showroomDB: entry.showroomDB,
        }))
      )
    );

    return () => {
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const data = useMemo(() => clientRequests, [clientRequests]);

  const columns = useMemo(
    () => [
      { Header: "Id", accessor: "clientId", minSize: 50 },
      { Header: "Client Code", accessor: "clientCode", minSize: 50 },
      { Header: "First Name", accessor: "name", minSize: 200 },
      { Header: "Last Name", accessor: "lastname", minSize: 200 },
      { Header: "Client Email", accessor: "email", minSize: 200 },
      { Header: "Client Number", accessor: "number", minSize: 200 },
      { Header: "Client Address", accessor: "address", minSize: 200 },
      { Header: "Date of Request", accessor: "date", minSize: 200 },
      { Header: "Sales Person", accessor: "salesPerson", minSize: 200 },
      { Header: "Interested Aspects", accessor: "aspects", minSize: 200 },
      { Header: "Request Category", accessor: "option", minSize: 200 },
      { Header: "Client Source", accessor: "sourceInfo", minSize: 200 },
      { Header: "(Other Source)", accessor: "specificInfo", minSize: 200 },
      {
        Header: "Measurement Cost",
        accessor: "measurementData.cost",
        minSize: 200,
      },
      {
        Header: "Measurement Date",
        accessor: "measurementData.date",
        minSize: 200,
      },
      {
        Header: "Measurement Time",
        accessor: "measurementData.time",
        minSize: 200,
      },
      {
        Header: "Measurement Supply/Fix",
        accessor: "measurementData.supplyFix",
        minSize: 200,
      },
      {
        Header: "Measurement Contact Person",
        accessor: "measurementData.contactPerson",
        minSize: 200,
      },
      {
        Header: "Edit",
        accessor: "id",
        Cell: ({ row }) => (
          <button
            onClick={() => handleEditClient(row.original.id)}
            className="hover:underline"
          >
            Edit
          </button>
        ),
      },
      {
        Header: "Delete",
        accessor: "delete",
        Cell: ({ row }) => (
          <button
            onClick={() => handleDeleteClient(row.original.id)}
            className="hover:underline text-red-500"
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );
  const handleEditClient = (clientId, showroomName) => {
    router.push(
      `/EditClient?clientId=${clientId}&showroomName=${showroomName}`
    );
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  async function handleDeleteClient(clientId, showroom) {
    if (confirm("Are you sure you want to delete this client request?")) {
      await deleteDoc(doc(db, showroom, clientId));
    }
  }

  function handleSearch() {
    // setClientRequests(
    const tempArr = allRequests.filter((clientRequest) => {
      var searchParam = search?.toLowerCase();
      return (
        (clientRequest.name &&
          clientRequest.name?.toLowerCase()?.includes(searchParam)) ||
        (clientRequest.clientCode &&
          clientRequest.clientCode?.toString()?.includes(searchParam)) ||
        (clientRequest.clientId &&
          clientRequest.clientId?.toString()?.includes(searchParam)) ||
        (clientRequest.email &&
          clientRequest.email?.toLowerCase()?.includes(searchParam)) ||
        (clientRequest.number &&
          clientRequest.number?.toString()?.includes(searchParam)) ||
        (clientRequest.address &&
          clientRequest.address?.toLowerCase()?.includes(searchParam)) ||
        (clientRequest.aspects &&
          clientRequest.aspects?.toLowerCase()?.includes(searchParam)) ||
        (clientRequest.option &&
          clientRequest.option?.toLowerCase()?.includes(searchParam)) ||
        (clientRequest.sourceInfo &&
          clientRequest.sourceInfo?.toLowerCase()?.includes(searchParam))
      );
    });
    // console.log(tempArr);
    // );
    function sortAndFormatData(data) {
      const result = [];

      data.forEach((item) => {
        const showroom = item.showroomName;
        let showroomObj = result.find((obj) => obj.showroomName === showroom);

        if (!showroomObj) {
          showroomObj = { showroomName: showroom, data: [] };
          result.push(showroomObj);
        }

        showroomObj.data.push(item);
      });

      return result;
    }

    const sortedData = sortAndFormatData(tempArr);
    setClientRequests(sortedData);
    // console.log(sortedData);
  }

  return (
    <>
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
          <p className="mt-8 text-2xl text-center font-bold mb-4">
            Requests from Clients
          </p>
          <div className="flex flex-col gap-4 ">
            <div className="relative mx-auto">
              <input
                onChange={(e) => {
                  if (
                    search === "" ||
                    search === null ||
                    search === undefined
                  ) {
                    setClientRequests(originalClientRequests);
                    setAllRequests([]);
                  } else {
                    setSearch(e.target.value);
                  }
                }}
                className="mx-auto
                border-2 border-black p-2"
              />
              <button
                className="bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2"
                onClick={handleSearch}
              >
                Search
              </button>
              <div className="bg-slate-300 absolute w-[200px] z-30">
                {search &&
                  allRequests
                    ?.filter((clientRequest) => {
                      var searchParam = search?.toLowerCase();
                      return (
                        clientRequest.name
                          ?.toLowerCase()
                          ?.includes(searchParam) ||
                        clientRequest.clientCode
                          ?.toString()
                          ?.includes(searchParam) ||
                        clientRequest.number
                          ?.toString()
                          ?.includes(searchParam) ||
                        clientRequest.email?.toString()?.includes(searchParam)
                      );
                    })
                    .slice(0, 10)
                    .map((clientRequest) => (
                      <p
                        key={clientRequest.clientId}
                        onClick={() => {
                          setSearch(clientRequest.name);
                          handleSearch();
                        }}
                        className="p-2 text-black cursor-pointer"
                      >
                        {clientRequest.clientCode} : {clientRequest.name}
                      </p>
                    ))}
              </div>
            </div>
            <div className="table-container overflow-x-auto">
              {clientRequests?.map((item, index) => {
                return (
                  <div key={index}>
                    <h4 className=" w-full text-center mt-3 mb-1 text-lg font-semibold capitalize">
                      {item?.showroomName}
                    </h4>
                    <table
                      {...getTableProps()}
                      className="border-collapse w-full"
                    >
                      <thead>
                        {headerGroups.map((headerGroup) => (
                          <tr
                            key={headerGroup.id}
                            {...headerGroup.getHeaderGroupProps()}
                          >
                            <th className="border-black border  bg-blue-400">
                              Sl. No.
                            </th>
                            {headerGroup.headers.map((column) => (
                              <th
                                key={column.id}
                                {...column.getHeaderProps()}
                                className="border-black border bg-blue-400"
                                style={{ minWidth: column.minSize }}
                              >
                                {column.render("Header")}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody>
                        {item?.data?.map((row, index) => {
                          return (
                            <tr key={row.id} className="border">
                              <td className="p-2.5 border-black border">
                                {index + 1}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.clientId}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.clientCode}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.name}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.lastname}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.email}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.number}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.address}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.date}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.salesPerson}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.aspects}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.category}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.clientSource}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.otherSource}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.measuremetCost}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.measuremetDate}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.measuremetTime}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.measuremetSupply}
                              </td>
                              <td className="p-2.5 border-black border">
                                {row?.contactPerson}
                              </td>
                              <td className="p-2.5 border-black border">
                                <IoPencil
                                  onClick={() =>
                                    handleEditClient(
                                      row?.clientId,
                                      item?.showroomDB
                                    )
                                  }
                                  className=" cursor-pointer hover:text-blue-500 text-[20px]"
                                />
                              </td>
                              <td className="p-2.5 border-black border">
                                <AiFillDelete
                                  onClick={() =>
                                    handleDeleteClient(
                                      row?.clientId,
                                      item?.showroomName
                                    )
                                  }
                                  className=" cursor-pointer  hover:text-red-500 text-[20px]"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
