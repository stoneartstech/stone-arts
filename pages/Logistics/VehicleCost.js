import React, { useEffect, useState } from "react";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Image from "next/image";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function VehicleCost({ vehicle, handleBack }) {
  const [viewOptions, setViewOptions] = useState(true);
  const [viewUpload, setViewUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  const [costs, setCosts] = useState([]);
  const vehicleName = vehicle?.name;

  const fetchCosts = async () => {
    setLoading(true);
    let resArr = [];
    const res = await getDocs(
      collection(db, `Vehicle-Datas/costs/${vehicleName}`)
    );
    res.forEach((doc) => {
      // console.log(doc?.id, " => ", doc.data());
      resArr.push(doc?.data());
    });
    console.log(resArr);
    setCosts(resArr);
    setLoading(false);
  };
  useEffect(() => {
    fetchCosts();
  }, [viewUpload]);

  const PrevCosts = () => {
    const [viewSingleCost, setViewSingleCost] = useState(false);
    const [activeTab, setActiveTab] = useState(false);

    return (
      <>
        <div className=" flex flex-col md:flex-row md:items-center justify-center relative">
          <button
            className="bg-slate-300 p-2 rounded-lg w-fit md:absolute left-0 top-0"
            onClick={() => {
              if (viewSingleCost) {
                setViewSingleCost(false);
              } else {
                setViewOptions(true);
              }
            }}
          >
            Go Back
          </button>
          <p className=" page-heading">{vehicle?.name} </p>
        </div>
        {!viewSingleCost ? (
          <div className=" flex flex-col gap-2 items-center">
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
                {costs?.length <= 0 ? (
                  <p>No Costs Available</p>
                ) : (
                  <>
                    {costs?.map((item, index) => {
                      return (
                        <p
                          key={index}
                          onClick={() => {
                            setViewSingleCost(true);
                            setActiveTab(item);
                          }}
                          className=" main-btn"
                        >
                          Cost - {item?.date}, {item?.time}
                        </p>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="page-heading">
              Cost -{activeTab?.date}, {activeTab?.time}
            </p>
            <div className="flex flex-col w-full">
              <div className=" grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <p className="mt-4">Date</p>
                  <input
                    required
                    type="date"
                    value={activeTab?.selDate}
                    readOnly
                    onChange={(e) => {}}
                    className=" p-2.5 w-full "
                  />
                </div>
                <div className="flex flex-col">
                  <p className="mt-4">Cost</p>
                  <input
                    required
                    type="number"
                    value={activeTab?.cost}
                    readOnly
                    placeholder="Add Cost"
                    onChange={(e) => {}}
                    className=" p-2.5 w-full "
                  />
                </div>
              </div>

              <div className="flex flex-col w-full">
                <p className="mt-2">Description</p>
                <textarea
                  required
                  type="text"
                  rows={4}
                  readOnly
                  placeholder="Add Description"
                  value={activeTab?.description}
                  onChange={(e) => {}}
                  className=" p-2 w-full "
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const UploadCost = () => {
    const [selDate, setSelDate] = useState("");
    const [cost, setCost] = useState("");
    const [description, setDescription] = useState("");
    return (
      <div>
        <div className=" flex flex-col md:flex-row md:items-center justify-center relative">
          <button
            className="bg-slate-300 p-2 rounded-lg w-fit md:absolute left-0 top-0"
            onClick={() => {
              setViewUpload(false);
              setViewOptions(true);
            }}
          >
            Go Back
          </button>
          <p className=" page-heading">{vehicle?.name} </p>
        </div>

        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                const currDateStr = new Date().toISOString();
                const date = new Date().toLocaleDateString();
                const time = new Date().toLocaleTimeString();

                const data = {
                  date,
                  time,
                  cost,
                  selectedDate: selDate,
                  description,
                };
                // console.log(new Date().toISOString());
                setDoc(
                  doc(
                    db,
                    "Vehicle-Datas/costs",
                    `${vehicleName}/${currDateStr}`
                  ),
                  data
                );
                enqueueSnackbar("Cost Uploaded Successfully", {
                  variant: "success",
                });
                setDescription("");
                setCost("");
                setSelDate("");
              } catch (error) {
                console.error(error);
                enqueueSnackbar("Something Went Wrong", {
                  variant: "error",
                });
              }
            }}
            className="flex flex-col items-center"
          >
            <p className="page-heading">Upload New Cost</p>
            <div className="flex flex-col w-full">
              <div className=" grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <p className="mt-4">Select Date</p>
                  <input
                    required
                    type="date"
                    value={selDate}
                    onChange={(e) => setSelDate(e.target.value)}
                    className=" p-2.5 w-full "
                  />
                </div>
                <div className="flex flex-col">
                  <p className="mt-4">Cost</p>
                  <input
                    required
                    type="number"
                    value={cost}
                    placeholder="Add Cost"
                    onChange={(e) => setCost(e.target.value)}
                    className=" p-2.5 w-full "
                  />
                </div>
              </div>

              <div className="flex flex-col w-full">
                <p className="mt-2">Description</p>
                <textarea
                  required
                  type="text"
                  rows={4}
                  placeholder="Add Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className=" p-2 w-full "
                />
              </div>
            </div>
            <button
              disabled={selDate === "" || cost === "" || description === ""}
              type="submit"
              className=" upload-form-btn"
            >
              Upload
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />

      {viewOptions ? (
        <>
          <div className=" flex flex-col md:flex-row md:items-center justify-center relative">
            <button
              className="bg-slate-300 p-2 rounded-lg w-fit md:absolute left-0 top-0"
              onClick={() => {
                handleBack(false);
              }}
            >
              Go Back
            </button>
            <p className=" page-heading">{vehicle?.name} </p>
          </div>
          <div className=" flex flex-col gap-2 items-center">
            <p
              onClick={() => {
                setViewOptions(false);
                setViewUpload(true);
              }}
              className=" main-btn"
            >
              Upload New Cost
            </p>
            <p
              onClick={() => {
                setViewOptions(false);
                setViewUpload(false);
              }}
              className=" main-btn"
            >
              View Previous Costs
            </p>
          </div>
        </>
      ) : (
        <>{viewUpload ? <UploadCost /> : <PrevCosts />}</>
      )}
    </div>
  );
}
