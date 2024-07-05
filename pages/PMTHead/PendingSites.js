import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { AiFillDelete } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";

const AssignTeamSection = ({ selectedClient }) => {
  const [supervisorName, setSupervisorName] = useState("");
  const [tempSupervisorName, setTempSupervisorName] = useState("");
  const [supervisorsList, setSupervisorsList] = useState([]);

  const [fundis, setFundis] = useState([
    {
      name: "",
      fundiCode: "",
    },
  ]);
  const [tempFundiName, setTempFundiName] = useState("");
  const [fundisList, setFundisList] = useState([]);

  const router = useRouter();

  const handleAddFundi = () => {
    const newFundi = {
      name: "",
      fundiCode: "",
    };
    const tempArr = [...fundis, newFundi];
    setFundis(tempArr);
    console.log(tempArr);
  };
  const handleRemoveFundi = (index) => {
    const tempArr = [...fundis];
    tempArr?.splice(index, 1);
    setFundis(tempArr);
    console.log(tempArr);
  };
  const fetchTeam = async () => {
    const supervisors = await getDoc(doc(db, "stonearts-team/supervisors"));
    const fundis = await getDoc(doc(db, "stonearts-team/fundis"));
    if (supervisors.data()?.data?.length > 0) {
      setSupervisorsList(supervisors.data()?.data);
      console.log(supervisors.data()?.data);
    }
    if (fundis.data()?.data?.length > 0) {
      setFundisList(fundis.data()?.data);
      console.log(fundis.data()?.data);
    }
  };

  useEffect(() => {
    setSupervisorName(
      selectedClient?.supervisor ? selectedClient?.supervisor : ""
    );
    if (selectedClient?.fundis) {
      setFundis(selectedClient?.fundis);
    }
  }, [selectedClient]);

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <div className=" w-full items-center justify-center flex flex-col gap-4 pt-6 ">
      <h3 className=" font-semibold text-xl capitalize">
        Assign Team for {selectedClient?.name} - {selectedClient?.clientId}
      </h3>

      <div className=" w-[60%] flex flex-col gap-2 ">
        <p className=" underline">Assign Site Supervior : </p>
        <div className=" grid grid-cols-2 items-center gap-2">
          <select
            value={supervisorName}
            onChange={(e) => {
              setSupervisorName(e.target.value);
            }}
            className=" p-2 border border-black px-3"
          >
            <option value={""}>Select Supervisor</option>
            {supervisorsList?.map((item, index) => {
              return (
                <option className="  capitalize" key={index} value={item?.name}>
                  {item?.name}
                </option>
              );
            })}
          </select>
          <div className=" flex items-center gap-2 w-full">
            {" "}
            <input
              name="supervisorName"
              id="supervisorName"
              value={tempSupervisorName}
              onChange={(e) => {
                setTempSupervisorName(e.target.value);
                console.log(e.target.value);
              }}
              autoComplete="off"
              placeholder="Add New Supervisor"
              className=" p-2 border border-black px-3 w-full"
            />
            <button
              onClick={() => {
                try {
                  // console.log(supervisorName);
                  setSupervisorName(tempSupervisorName);
                  var tempArr = [];
                  if (supervisorsList?.length > 0) {
                    tempArr = [
                      ...supervisorsList,
                      { name: tempSupervisorName },
                    ];
                  } else {
                    tempArr = [{ name: tempSupervisorName }];
                  }
                  // console.log(tempArr);
                  setDoc(doc(db, "stonearts-team/supervisors"), {
                    data: tempArr,
                  });
                  fetchTeam();
                  enqueueSnackbar(
                    ` ${tempSupervisorName} added as Supervisor`,
                    {
                      variant: "success",
                    }
                  );
                  setTempSupervisorName("");
                } catch (error) {
                  enqueueSnackbar("Some error occured", {
                    variant: "error",
                  });
                  console.error(error);
                }
              }}
              className=" px-3 bg-green-400 p-2 font-semibold"
            >
              Add
            </button>
          </div>
        </div>
        <div className=" grid grid-cols-2 gap-2 items-center justify-between ">
          <p className=" underline">Assign Fundis : </p>
          <div className=" flex items-center gap-2 w-full">
            {" "}
            <input
              name="supervisorName"
              id="supervisorName"
              value={tempFundiName}
              onChange={(e) => {
                setTempFundiName(e.target.value);
                console.log(e.target.value);
              }}
              autoComplete="off"
              placeholder="Add New Fundi"
              className=" p-2 border border-black px-3 w-full"
            />
            <button
              onClick={() => {
                // console.log(tempFundiName);
                try {
                  var tempArr = [];
                  if (fundisList?.length > 0) {
                    tempArr = [...fundisList, { name: tempFundiName }];
                  } else {
                    tempArr = [{ name: tempFundiName }];
                  }
                  // console.log(tempArr);
                  setDoc(doc(db, "stonearts-team/fundis"), {
                    data: tempArr,
                  });
                  fetchTeam();
                  enqueueSnackbar(` ${tempFundiName} added as Fundi`, {
                    variant: "success",
                  });
                  setTempFundiName("");
                } catch (error) {
                  enqueueSnackbar("Some error occured", {
                    variant: "error",
                  });
                  console.error(error);
                }
              }}
              className=" px-3 bg-green-400 p-2 font-semibold"
            >
              Add
            </button>
          </div>
        </div>
        {fundis?.map((fundi, index) => {
          return (
            <div
              key={index}
              className=" grid grid-cols-2 relative items-center gap-2"
            >
              <p className=" font-semibold text-lg">Fundi - {index + 1} </p>
              <select
                value={fundis[index]["name"]}
                onChange={(e) => {
                  const tempArr = [...fundis];
                  tempArr[index]["name"] = e.target.value;
                  setFundis(tempArr);
                  console.log(tempArr);
                }}
                className=" p-2 border border-black px-3"
              >
                <option value={""}>Select Fundi</option>
                {fundisList?.map((item, index) => {
                  return (
                    <option
                      className="  capitalize"
                      key={index}
                      value={item?.name}
                    >
                      {item?.name}
                    </option>
                  );
                })}
              </select>
              <AiFillDelete
                onClick={() => {
                  handleRemoveFundi(index);
                }}
                className=" absolute  -right-8 cursor-pointer text-[21px] hover:text-red-600"
              />
            </div>
          );
        })}
        <p
          onClick={() => {
            handleAddFundi();
          }}
          className=" flex items-center gap-2 cursor-pointer hover:bg-green-400 w-fit px-4 py-2 "
        >
          <IoAddCircleOutline />
          Add Fundi
        </p>
      </div>
      <button
        disabled={supervisorName === ""}
        onClick={async () => {
          try {
            const { qsName, qs, ...rest } = selectedClient;
            setDoc(
              doc(
                db,
                `qs${selectedClient?.qs}-completed-quotes/${selectedClient?.clientId}`
              ),
              {
                ...rest,
                supervisor: supervisorName,
                fundis: fundis,
              }
            );
            enqueueSnackbar(`Team Assigned Successfully`, {
              variant: "success",
            });
            setTimeout(() => {
              router.back();
            }, 1500);
          } catch (error) {
            enqueueSnackbar("Some error occured", {
              variant: "error",
            });
            console.error(error);
          }
        }}
        className="  disabled:bg-gray-400 bg-green-400 hover:bg-green-500 px-4 py-2 font-semibold"
      >
        Confirm
      </button>
    </div>
  );
};

export default function PendingSites() {
  const [isQsSelected, setIsQsSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionsTab, setActionsTab] = useState(false);
  const [assignTeam, setAssignTeam] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [originalRequests, setOriginalRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [qs, setQs] = useState(1);
  const router = useRouter();

  async function fetchCompletedQuotes() {
    const qsRef = doc(db, "qs-count", "qs-count");
    const maxQsCount = await getDoc(qsRef);
    const maxQs = maxQsCount.data()["qs-count"]
      ? maxQsCount.data()["qs-count"]
      : 1;

    const promises = [];

    for (let qs = 1; qs <= maxQs; qs++) {
      const requestsRef = collection(db, `qs${qs}-completed-quotes`);
      const snapshot = await getDocs(requestsRef);
      const requestsList = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        qsName: `qs${qs}`,
        qs: qs,
      }));
      promises.push(requestsList);
    }

    const results = await Promise.all(promises);
    const combinedArray = results.flat(); // Merge all arrays into a single array
    setRequests(combinedArray);
    return combinedArray;
  }
  // to fetch supervisors and fundis name list
  useEffect(() => {
    fetchCompletedQuotes()
      .then((combinedArray) => {
        setLoading(false);
        console.log(combinedArray);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [isQsSelected, qs]);

  return (
    <>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
      <div>
        <div className="w-full px-8 flex flex-row justify-between">
          <button
            className="bg-slate-300 p-2 rounded-lg"
            onClick={() => {
              if (isQsSelected) {
                return setIsQsSelected(false);
              } else if (actionsTab) {
                setAssignTeam(false);
                return setActionsTab(false);
              } else if (assignTeam) {
                return setAssignTeam(false);
              } else {
                router.back();
              }
            }}
          >
            Go Back
          </button>
        </div>
        <div className="flex flex-col mt-4">
          <p className="text-2xl mx-auto capitalize font-bold">
            {selectedClient !== ""
              ? `${selectedClient?.name} - ${selectedClient?.clientId} Actions`
              : "Sites Not Assigned Yet"}
          </p>
        </div>
        {loading ? (
          <div className=" w-full flex items-center justify-center">
            <Image
              width={50}
              height={50}
              src="/loading.svg"
              alt="Loading ..."
            />
          </div>
        ) : (
          <>
            {!actionsTab ? (
              <div className=" flex flex-col items-center justify-center ">
                {requests?.length === 0 && (
                  <p className=" mt-3">No Results Found !!</p>
                )}{" "}
                {requests?.map((order, index) => {
                  return (
                    <div
                      key={index}
                      className=" mt-4 md:w-[40%] grid grid-cols-3"
                    >
                      <div className=" py-1.5 md:py-0  col-span-3 md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                        {order?.name} - {order?.clientId}
                      </div>
                      <button
                        onClick={() => {
                          setActionsTab(true);
                          setSelectedClient(order);
                        }}
                        className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border md:border-l-0"
                      >
                        Actions
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                {assignTeam ? (
                  <AssignTeamSection selectedClient={selectedClient} />
                ) : (
                  <div className=" flex flex-col items-center justify-center ">
                    <div className=" mt-4 flex flex-col gap-3 ">
                      <Link href={selectedClient?.quotePdf} target="_blank">
                        <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                          Check Quote
                        </button>
                      </Link>
                      <Link
                        href={`/PMTHead/actions/MaterialPlanUpload?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}`}
                      >
                        <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                          Upload Material Plan
                        </button>
                      </Link>
                      <Link
                        href={`/PMTHead/actions/SitePlanUpload?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}`}
                      >
                        <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                          Upload Site Plan
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setAssignTeam(true);
                        }}
                        className={` ${
                          selectedClient?.supervisor
                            ? "bg-[#94e63d]"
                            : "bg-red-400"
                        } hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]`}
                      >
                        Assign People
                      </button>
                      <Link
                        href={`/PMTHead/actions/JobCards?qsName=${selectedClient?.qsName}&clientId=${selectedClient?.clientId}&clientName=${selectedClient?.name}`}
                      >
                        <button className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]">
                          Create Job Card
                        </button>
                      </Link>
                      <button
                        disabled={!selectedClient?.supervisor}
                        onClick={() => {
                          // console.log(selectedClient);
                          const okay = confirm(
                            `Start Project ${selectedClient?.name} - ${selectedClient?.clientId} `
                          );
                          try {
                            const date1 = new Date();
                            const date = date1.toDateString();
                            const time = date1.toTimeString();
                            if (okay) {
                              setDoc(
                                doc(
                                  db,
                                  "PMT-sites-in-progress",
                                  `${selectedClient?.clientId}`
                                ),
                                { ...selectedClient, date, time }
                              );
                              deleteDoc(
                                doc(
                                  db,
                                  `qs${selectedClient?.qs}-completed-quotes/${selectedClient?.clientId}`
                                )
                              );
                              enqueueSnackbar(
                                ` ${selectedClient?.name} - ${selectedClient?.clientId} Started`,
                                {
                                  variant: "success",
                                }
                              );
                              setTimeout(() => {
                                router.back();
                              }, 1500);
                            }
                          } catch (error) {
                            enqueueSnackbar("Some error occured", {
                              variant: "error",
                            });
                            console.error(error);
                          }
                        }}
                        className=" disabled:bg-gray-400 bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-1.5 md:py-2.5 px-4 border-black border  w-[300px]"
                      >
                        Start Project
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
