import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import { db, storage } from "../../firebase";
import { setDoc, doc, deleteDoc, getDoc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/firebase";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Link from "next/link";
import { AiFillDelete } from "react-icons/ai";
import Image from "next/image";
import { IoEyeSharp } from "react-icons/io5";

export default function CheckProgress() {
  const router = useRouter();
  const { query } = router;
  const { clientId, clientName } = query;

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progressNote, setProgressNote] = useState("");
  const [notesArr, setNotesArr] = useState([]);

  const today = new Date();
  const date1 =
    ("0" + today.getDate()).slice(-2) +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    today.getFullYear();
  // Extract date components
  const [date, setDate] = useState(date1);
  const currentDate = new Date();

  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);

  const time = hours + "hrs :" + minutes + "m :" + seconds + "s";

  const fetchAllNotes = () => {
    const notesUnsubscribe = onSnapshot(
      doc(db, `PMTNotes/OngoingSites/ProgressNotes/${clientId}`),
      (doc) => {
        const notesData = doc.data();
        if (notesData) {
          setNotesArr(notesData.data?.reverse());
          console.log("notes", notesData);
        } else {
          console.log("No Notes found");
        }
      },
      (error) => {
        console.error("Error Fetching Notes: ", error);
        enqueueSnackbar("Error Fetching Notes", {
          variant: "error",
        });
      }
    );

    return {
      notesUnsubscribe,
    };
  };

  useEffect(() => {
    const { notesUnsubscribe } = fetchAllNotes();

    return () => {
      notesUnsubscribe();
      setLoading(false);
    };
  }, []);

  const handleUploadNote = async () => {
    setUploading(true);
    let tempArr = [...notesArr];
    tempArr?.reverse();
    try {
      tempArr.push({ date, time, progressNote });
      setDoc(doc(db, `PMTNotes/OngoingSites/ProgressNotes/${clientId}`), {
        data: tempArr,
      });
      enqueueSnackbar(` Notes Added Successfully`, {
        variant: "success",
      });
      setUploading(false);
      setProgressNote("");
    } catch (error) {
      enqueueSnackbar("Error Adding Notes", {
        variant: "error",
      });
      console.error(error);
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
      <div className="w-full md:pl-8">
        <button
          className="bg-slate-300 p-2 rounded-lg"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <p className="mt-2 text-2xl text-center font-bold mb-6 capitalize">
        Check Progress of {clientName} - {clientId}
      </p>
      <div className="max-w-full py-4 border border-black px-2 overflow-auto">
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
          <div className=" grid grid-cols-3  gap-2 md:gap-0 flex-col mt-3 ">
            <div className=" col-span-1 flex flex-col ml-4">
              <label className=" font-medium  mb-1">Add New Progress</label>
              <div className=" flex items-end gap-2 ">
                <textarea
                  rows={5}
                  required
                  id="progress"
                  name="progress"
                  placeholder="Add Progress Note"
                  type="text"
                  value={progressNote}
                  className=" py-2 px-2 border border-black font-normal text-sm w-[300px]"
                  onChange={(e) => {
                    setProgressNote(e.target.value);
                  }}
                />
                <button
                  disabled={uploading || progressNote === ""}
                  type="button"
                  className=" disabled:bg-gray-400 font-semibold text-sm bg-green-500 p-2.5 rounded-lg w-fit"
                  onClick={() => {
                    handleUploadNote();
                  }}
                >
                  {uploading ? "Uploading" : "Add"}
                </button>
              </div>
            </div>
            <div className=" col-span-2 flex flex-col  gap-3 max-h-[500px] pb-6  overflow-y-auto">
              <p className=" font-medium  mb-1">Progress Notes</p>
              <>
                {notesArr?.length > 0 ? (
                  <>
                    {notesArr?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className=" group relative cursor-pointer bg-white p-4 pt-2 pb-4"
                        >
                          <div className=" flex items-center gap-2 mb-1">
                            <p className=" font-semibold text-[13.4px] ">
                              Date: {item?.date}
                            </p>
                            <p className=" font-semibold text-[13.4px] ">
                              Time: {item?.time}
                            </p>
                          </div>
                          <p>{item?.progressNote}</p>
                          <div className=" absolute items-center justify-center hidden group-hover:flex group-hover:border group-hover:border-black  flex-col w-full h-full z-40 bg-white/20 backdrop-blur-md border border-white/10 shadow-lg p-6 inset-0">
                            <div className=" flex flex-wrap items-center gap-5 w-full">
                              <AiFillDelete
                                onClick={async () => {
                                  try {
                                    const tempArr = [...notesArr];
                                    tempArr?.splice(index, 1);
                                    tempArr?.reverse();
                                    await setDoc(
                                      doc(
                                        db,
                                        `PMTNotes/OngoingSites/ProgressNotes/${clientId}`
                                      ),
                                      {
                                        data: tempArr,
                                      }
                                    );
                                  } catch (error) {
                                    enqueueSnackbar(`Error Deleting Image`, {
                                      variant: "error",
                                    });
                                    console.error(error);
                                  } finally {
                                    enqueueSnackbar(
                                      ` Note Deleted Successfully`,
                                      {
                                        variant: "success",
                                      }
                                    );
                                  }
                                }}
                                title="delete note"
                                className="  hidden group-hover:block hover:text-red-600 top-3 left-3 absolute cursor-pointer text-[23px]"
                              />
                            </div>
                            <p className=" font-semibold text-[14.5px] pl-2 pt-2">
                              Date: {item?.date}
                            </p>
                            <p className=" font-semibold text-[14.5px] pl-2">
                              Time: {item?.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <p className=" ">No Notes Available </p>
                )}
              </>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
