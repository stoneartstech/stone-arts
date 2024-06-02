import React, { useState, useEffect, useMemo } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
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
  const [newReview, setNewReview] = useState("");
  const [reviewRow, setReviewRow] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    const allShowroomData = [];
    for (const showroom of showroomDbNames) {
      const querySnapshot = await getDocs(collection(db, showroom));
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sorting the requests
      requests.sort((a, b) => b.clientId - a.clientId);

      const showroomNames = {
        clients: "Galleria",
        "mirage-clients": "Mirage",
        "kisumu-clients": "Kisumu",
        "mombasa-clients": "Mombasa Road",
      };

      allShowroomData.push({
        showroomName: showroom,
        showroomDB: showroomNames[showroom],
        data: requests,
      });
    }

    // Find the index of the object with the desired showroomDB
    let index = allShowroomData.findIndex(
      (item) => item.showroomDB === showroomName
    );

    if (index !== -1) {
      let [desiredObject] = allShowroomData.splice(index, 1);
      allShowroomData.unshift(desiredObject);
    }

    setClientRequests([...allShowroomData]);
    setOriginalClientRequests([...allShowroomData]);
    setLoading(false);
    setAllRequests(
      allShowroomData.flatMap((entry) =>
        entry.data.map((client) => ({
          ...client,
          showroomName: entry.showroomName,
          showroomDB: entry.showroomDB,
        }))
      )
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!search) {
      setClientRequests(originalClientRequests);
    }
  }, [search]);

  const columns = [
    "Id",
    "Client Code",
    "First Name",
    "Last Name",
    "Client Email",
    "Client Number",
    "Client Address",
    "Date of Request",
    "Sales Person",
    "Interested Aspects",
    "Request Category",
    "Client Source",
    "(Other Source)",
    "Measurement Cost",
    "Measurement Date",
    "Measurement Time",
    "Measurement Supply/Fix",
    "Measurement Contact Person",
    "Edit",
    "Delete",
    "Review",
  ];

  const handleEditClient = (clientId, showroomName) => {
    router.push(
      `/EditClient?clientId=${clientId}&showroomName=${showroomName}`
    );
  };

  const handleDeleteClient = async (clientId, showroom) => {
    if (confirm("Are you sure you want to delete this client request?")) {
      await deleteDoc(doc(db, String(showroom), String(clientId)));
      fetchData();
    }
  };

  const handleSearch = () => {
    setIsSearch(false);
    const searchParam = search.toLowerCase();
    const filteredRequests = allRequests.filter((clientRequest) => {
      return (
        clientRequest.name?.toLowerCase().includes(searchParam) ||
        clientRequest.clientCode?.toString().includes(searchParam) ||
        clientRequest.clientId?.toString().includes(searchParam) ||
        clientRequest.email?.toLowerCase().includes(searchParam) ||
        clientRequest.number?.toString().includes(searchParam) ||
        clientRequest.address?.toLowerCase().includes(searchParam) ||
        clientRequest.aspects?.toLowerCase().includes(searchParam) ||
        clientRequest.option?.toLowerCase().includes(searchParam) ||
        clientRequest.sourceInfo?.toLowerCase().includes(searchParam)
      );
    });

    const sortedData = sortAndFormatData(filteredRequests);
    setClientRequests(sortedData);
  };

  const sortAndFormatData = (data) => {
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
  };

  return (
    <>
      {loading ? (
        <p className="w-full text-center">Loading...</p>
      ) : (
        <div className="md:px-4">
          <div className="w-full flex justify-start mb-4">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
          <p className="mt-8 text-xl md:text-2xl text-center font-bold mb-4">
            Requests from Clients
          </p>
          <div className="flex flex-col gap-4">
            <div className="relative  flex items-center mx-auto">
              <input
                onChange={(e) => {
                  setIsSearch(true);
                  setSearch(e.target.value);
                }}
                className="border-2 border-black p-2"
                placeholder="Search..."
              />
              <button
                className="bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2"
                onClick={handleSearch}
              >
                Search
              </button>
              {search && isSearch && (
                <div className="bg-slate-300 absolute w-[200px] z-30">
                  {allRequests
                    ?.filter((clientRequest) => {
                      const searchParam = search.toLowerCase();
                      return (
                        clientRequest.name
                          ?.toLowerCase()
                          .includes(searchParam) ||
                        clientRequest.clientCode
                          ?.toString()
                          .includes(searchParam) ||
                        clientRequest.number
                          ?.toString()
                          .includes(searchParam) ||
                        clientRequest.email?.toString().includes(searchParam)
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
              )}
            </div>
            <div className="table-container overflow-x-auto">
              {clientRequests?.map((item, index) => {
                return (
                  <div key={index}>
                    <h4 className="w-full text-center mt-3 mb-1 text-lg font-semibold capitalize">
                      {item?.showroomDB || item?.showroomName}
                    </h4>
                    <table className="border-collapse w-full">
                      <thead>
                        <tr>
                          <th className="border-black border bg-blue-400">
                            Sl. No.
                          </th>
                          {columns.map((column, index) => (
                            <th
                              key={index}
                              className="px-2 border-black border bg-blue-400 min-w-[100px]"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {item?.data?.map((row, rowIndex) => (
                          <tr key={row.id} className="border">
                            <td className="p-2.5 border-black border">
                              {rowIndex + 1}
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
                              {row?.option}
                            </td>
                            <td className="p-2.5 border-black border">
                              {row?.sourceInfo}
                            </td>
                            <td className="p-2.5 border-black border">
                              {row?.specificInfo}
                            </td>
                            <td className="p-2.5 border-black border">
                              {row?.measurementData?.cost}
                            </td>
                            <td className="p-2.5 border-black border">
                              {row?.measurementData?.date}
                            </td>
                            <td className="p-2.5 border-black border">
                              {row?.measurementData?.time}
                            </td>
                            <td className="p-2.5 border-black border">
                              {row?.measurementData?.supplyFix}
                            </td>
                            <td className="p-2.5 border-black border">
                              {row?.measurementData?.contactPerson}
                            </td>
                            <td className="p-2.5 border-black border">
                              <div className="flex items-center justify-center">
                                <IoPencil
                                  onClick={() =>
                                    handleEditClient(
                                      row?.clientId,
                                      item?.showroomDB || row?.showroomDB
                                    )
                                  }
                                  className="cursor-pointer hover:text-blue-500 text-[20px]"
                                />
                              </div>
                            </td>
                            <td className="p-2.5 border-black border">
                              <div className="flex items-center justify-center">
                                <AiFillDelete
                                  onClick={() =>
                                    handleDeleteClient(
                                      row?.clientId,
                                      item?.showroomName || row?.showroomName
                                    )
                                  }
                                  className="cursor-pointer hover:text-red-500 text-[20px]"
                                />
                              </div>
                            </td>
                            <td className="p-1 border-black border">
                              <div className="flex items-center justify-center">
                                {!row?.review &&
                                  reviewRow?.clientCode === row?.clientCode && (
                                    <input
                                      type="text"
                                      name="review"
                                      id="review"
                                      placeholder="Add Review"
                                      autoComplete="off"
                                      className=" p-1.5"
                                      value={
                                        row?.review ? row?.review : newReview
                                      }
                                      onChange={(e) => {
                                        setNewReview(e.target.value);
                                        setReviewRow({
                                          ...row,
                                          showroom: item.showroomName,
                                          review: e.target.value,
                                        });
                                      }}
                                    />
                                  )}
                                {row?.review &&
                                  reviewRow?.clientCode !== row?.clientCode && (
                                    <input
                                      type="text"
                                      name="review"
                                      id="review"
                                      autoFocus="on"
                                      autoComplete="off"
                                      disabled={
                                        reviewRow?.clientCode !==
                                        row?.clientCode
                                      }
                                      placeholder="Add Review"
                                      className=" p-1.5"
                                      value={row?.review ? row?.review : ""}
                                      onChange={(e) => {
                                        setNewReview(e.target.value);
                                        setReviewRow({
                                          ...row,
                                          showroom: item.showroomName,
                                          review: e.target.value,
                                        });
                                      }}
                                    />
                                  )}
                                {row?.review &&
                                  reviewRow?.clientCode === row?.clientCode && (
                                    <input
                                      type="text"
                                      name="review"
                                      id="review"
                                      autoFocus="on"
                                      autoComplete="off"
                                      placeholder="Add Review"
                                      className=" p-1.5"
                                      value={newReview}
                                      onChange={(e) => {
                                        setNewReview(e.target.value);
                                        setReviewRow({
                                          ...row,
                                          showroom: item.showroomName,
                                          review: e.target.value,
                                        });
                                      }}
                                    />
                                  )}
                                <button
                                  onClick={() => {
                                    if (!row?.review) {
                                      setNewReview("");
                                    }
                                    if (row?.review) {
                                      setNewReview(row?.review);
                                    }
                                    if (
                                      reviewRow?.clientCode === row?.clientCode
                                    ) {
                                      setDoc(
                                        doc(
                                          db,
                                          `${reviewRow?.showroom}/${reviewRow?.clientCode}`
                                        ),
                                        reviewRow
                                      );
                                      fetchData();
                                      alert("Review Updated Successfully");
                                      setReviewRow("");
                                    } else {
                                      setReviewRow({
                                        ...row,
                                        showroom: item.showroomName,
                                        review: newReview,
                                      });
                                    }
                                  }}
                                  className=" bg-blue-500 text-white font-semibold text-sm px-4 h-full py-2"
                                >
                                  {row?.review ? "Edit" : "Add"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
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
