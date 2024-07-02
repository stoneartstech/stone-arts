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

export default function CheckImages() {
  const router = useRouter();
  const { query } = router;
  const { qsName, clientId, clientName, type } = query;

  const [isSiteImages, setIsSiteImages] = useState(true);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadImage, setUploadImage] = useState([]);
  const [fileLink, setFileLink] = useState([]);
  const [siteImgArr, setSiteImgArr] = useState([]);
  const [progImgArr, setProgImgArr] = useState([]);

  const today = new Date();
  const date1 =
    today.getDate() +
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

  const fetchAllImages = () => {
    // Fetching and listening for updates in site images
    const siteImagesUnsubscribe = onSnapshot(
      doc(db, `PMTImages/OngoingSites/SiteImages/${clientId}`),
      (doc) => {
        const siteImagesData = doc.data();
        if (siteImagesData) {
          setSiteImgArr(siteImagesData.data);
          console.log("siteImg", siteImagesData);
        } else {
          console.log("No site images found");
        }
      },
      (error) => {
        console.error("Error Fetching Site Images: ", error);
        enqueueSnackbar("Error Fetching Site Images", {
          variant: "error",
        });
      }
    );

    // Fetching and listening for updates in progress images
    const progressImagesUnsubscribe = onSnapshot(
      doc(db, `PMTImages/OngoingSites/ProgressImages/${clientId}`),
      (doc) => {
        const progressImagesData = doc.data();
        if (progressImagesData) {
          setProgImgArr(progressImagesData.data);
          setLoading(false);
          console.log("progImg", progressImagesData);
        } else {
          console.log("No progress images found");
        }
      },
      (error) => {
        console.error("Error Fetching Progress Images: ", error);
        enqueueSnackbar("Error Fetching Progress Images", {
          variant: "error",
        });
      }
    );

    return {
      siteImagesUnsubscribe,
      progressImagesUnsubscribe,
    };
  };

  useEffect(() => {
    const { siteImagesUnsubscribe, progressImagesUnsubscribe } =
      fetchAllImages();

    return () => {
      siteImagesUnsubscribe();
      progressImagesUnsubscribe();
    };
  }, []);

  const handleUploadReportImages = async () => {
    setUploading(true);
    console.log(uploadImage);
    let tempArr = [];
    if (isSiteImages) {
      tempArr = [...siteImgArr];
    } else {
      tempArr = [...progImgArr];
    }
    for (const item of uploadImage) {
      try {
        let index = Math.random();
        const storageRef = ref(
          storage,
          `PMTImages/OngoingSites/${
            isSiteImages ? "SiteImages" : "ProgressImages"
          }/${clientId}/${index}`
        );
        await uploadBytes(storageRef, item);
        const downloadURL = await getDownloadURL(storageRef);
        tempArr.push({ date, time, downloadURL });
        console.log(tempArr);
      } catch (error) {
        enqueueSnackbar("Error Uploading Images", {
          variant: "error",
        });
        console.error(error);
      }
    }
    setFileLink(tempArr);
    setDoc(
      doc(
        db,
        `PMTImages/OngoingSites/${
          isSiteImages ? "SiteImages" : "ProgressImages"
        }/${clientId}`
      ),
      {
        data: tempArr,
      }
    );
    enqueueSnackbar(` Images Uploaded Successfully`, {
      variant: "success",
    });
    setFileLink([]);
    setUploadImage([]);
    setUploading(false);
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
        Check / Upload Images For {clientName} - {clientId}
      </p>
      <div className="max-w-full py-4 border border-black px-2 overflow-auto">
        <div className=" flex items-center justify-center">
          <button
            type="button"
            className={`${
              isSiteImages ? "bg-green-400" : "bg-gray-300"
            } mt-2 font-semibold text-sm  p-2.5 text-center w-[200px] border border-black `}
            onClick={() => {
              setLoading(true);
              setIsSiteImages(true);
              setLoading(false);
            }}
          >
            Site Images
          </button>
          <button
            type="button"
            className={`${
              !isSiteImages ? "bg-green-400" : "bg-gray-300"
            } mt-2 font-semibold text-sm  p-2.5 text-center w-[200px] border border-black border-l-0 `}
            onClick={() => {
              setLoading(true);
              setIsSiteImages(false);
              setLoading(false);
            }}
          >
            Progress Images
          </button>
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
          <div className=" flex  gap-2 md:gap-0 flex-col mt-3 ">
            <div className=" flex flex-col ml-4">
              <label className=" font-medium  mb-1">
                Upload New {isSiteImages ? "Site" : "Progress"} Images
              </label>
              <div className=" flex items-center ">
                <input
                  required
                  id="file"
                  name="file"
                  multiple
                  type="file"
                  onChange={(e) => {
                    setUploadImage(e.target.files);
                  }}
                />
                <button
                  disabled={uploading || uploadImage?.length === 0}
                  type="button"
                  className=" disabled:bg-gray-400 mt-2 font-semibold text-sm bg-green-500 p-2.5 rounded-lg w-fit"
                  onClick={() => {
                    handleUploadReportImages();
                  }}
                >
                  {uploading ? "Uploading" : "Upload"}
                </button>
              </div>
            </div>
            <div className=" grid grid-cols-1 md:grid-cols-4 gap-3 mt-6">
              {isSiteImages ? (
                <>
                  {siteImgArr?.length > 0 ? (
                    <>
                      {siteImgArr?.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className=" group relative cursor-pointer"
                          >
                            <img src={item?.downloadURL} className=" " />
                            <div className=" absolute items-center justify-center hidden group-hover:flex group-hover:border group-hover:border-black  flex-col w-full h-full z-40 bg-white/20 backdrop-blur-md border border-white/10 shadow-lg p-6 max-w-xs inset-0">
                              <div className=" flex items-center gap-5">
                                <Link href={item?.downloadURL} target="_blank">
                                  <IoEyeSharp className="  hidden group-hover:block hover:text-green-600 cursor-pointer text-[23px]" />
                                </Link>
                                <AiFillDelete
                                  onClick={async () => {
                                    try {
                                      const tempArr = [...siteImgArr];
                                      tempArr?.splice(index, 1);
                                      await setDoc(
                                        doc(
                                          db,
                                          `PMTImages/OngoingSites/SiteImages/${clientId}`
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
                                        ` Images Deleted Successfully`,
                                        {
                                          variant: "success",
                                        }
                                      );
                                    }
                                  }}
                                  title="delete image"
                                  className="  hidden group-hover:block hover:text-red-600 cursor-pointer text-[23px]"
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
                    <p className=" text-center">No Images </p>
                  )}
                </>
              ) : (
                <>
                  {progImgArr?.length > 0 ? (
                    <>
                      {progImgArr?.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className=" group relative cursor-pointer"
                          >
                            <img src={item?.downloadURL} className=" " />
                            <div className=" absolute items-center justify-center hidden group-hover:flex group-hover:border group-hover:border-black  flex-col w-full h-full z-40 bg-white/20 backdrop-blur-md border border-white/10 shadow-lg p-6 max-w-xs inset-0">
                              <div className=" flex items-center gap-5">
                                <Link href={item?.downloadURL} target="_blank">
                                  <IoEyeSharp className="  hidden group-hover:block hover:text-green-600 cursor-pointer text-[23px]" />
                                </Link>
                                <AiFillDelete
                                  onClick={async () => {
                                    try {
                                      const tempArr = [...progImgArr];
                                      tempArr?.splice(index, 1);
                                      await setDoc(
                                        doc(
                                          db,
                                          `PMTImages/OngoingSites/ProgressImages/${clientId}`
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
                                        ` Images Deleted Successfully`,
                                        {
                                          variant: "success",
                                        }
                                      );
                                    }
                                  }}
                                  title="delete image"
                                  className="  hidden group-hover:block hover:text-red-600 cursor-pointer text-[23px]"
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
                    <p className=" text-center">No Images </p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
