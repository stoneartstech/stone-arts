import React, { useState } from "react";
import { db, storage } from "@/firebase";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { IoClose } from "react-icons/io5";
import { addDoc, collection } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";

export const CheckDeliveryNotes = ({
  dbName,
  id,
  deliveryNotes,
  setIsDeliveryNotes,
}) => {
  const [note, setNote] = useState("");

  const uploadDeliveryNotes = async () => {
    const DeliveryNoteRef = collection(
      db,
      `DeliveryNotes/${dbName.slice(0, 3)}/${id}/`
    );
    await addDoc(DeliveryNoteRef, { note });
    setNote("");
    document.getElementById("noteInput").value = "";
  };

  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center w-full h-[100vh] overflow-hidden bg-black/70">
      <div className=" actual-receipt w-[90%] h-[90vh] relative overflow-hidden p-7 bg-white flex flex-col  items-center">
        <IoClose
          onClick={() => {
            setIsDeliveryNotes(false);
          }}
          className=" absolute top-0.5 right-0.5 text-[27px] text-black cursor-pointer "
        />
        <p className="text-2xl mx-auto font-semibold mb-2">Delivery Notes</p>
        <div className=" flex justify-center">
          <input
            id="noteInput"
            name="noteInput"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
            }}
            autoComplete="off"
            placeholder="Add Note"
            type="text"
            className=" px-2 py-1.5 focus:border-blue-300 mr-1 w-full sm:w-[300px] lg:w-[600px] border border-black"
          />
          <button
            onClick={() => {
              uploadDeliveryNotes();
            }}
            disabled={note === ""}
            className=" disabled:bg-gray-400 bg-[#90f24e] hover:bg-[#89db4f] border border-black px-4 py-2 font-medium text-sm "
          >
            Upload Note
          </button>
        </div>
        <div className=" w-full mt-5  overflow-y-scroll">
          <div className="  grid grid-cols-3 gap-5 p-3 bg-gray-200 ">
            {!deliveryNotes ||
              (!deliveryNotes.length > 0 && "No Notes Available")}
            {deliveryNotes?.map((note, index) => {
              return (
                <p key={index} className=" bg-white p-3 break-words ">
                  {note.note}
                </p>
              );
            })}
          </div>
        </div>
      </div>
      ;
    </div>
  );
};
export const CheckSiteImages = ({
  dbName,
  setIsSiteImages,
  id,
  downloadSiteImgURLs,
  setDownloadSiteImgURLs,
}) => {
  const [siteImages, setSiteImages] = useState(false);
  const uploadImages = async () => {
    try {
      // uploading multiple images at once to firebase
      siteImages.map(async (image, index) => {
        const storageRef = ref(
          storage,
          `SiteImages/${dbName.slice(0, 3)}/${id}/${image.name}`
        );
        await uploadBytes(storageRef, image);
      });

      // folder ref to donwload all files links at once
      const folderRef = ref(storage, `SiteImages/${dbName.slice(0, 3)}/${id}`);
      const folderContent = await listAll(folderRef);
      const downloadURLs1 = [];
      await Promise.all(
        folderContent.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          downloadURLs1.push(url);
        })
      );
      alert("Images Uploaded");
      setIsSiteImages(false);
      // console.log(downloadURLs1);
      setDownloadSiteImgURLs(downloadURLs1);
      setSiteImages(false);
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center w-full h-[100vh] overflow-hidden bg-black/70">
      <div className=" actual-receipt w-[90%] h-[90vh] relative overflow-hidden p-7 bg-white flex flex-col  items-center">
        <IoClose
          onClick={() => {
            setIsSiteImages(false);
          }}
          className=" absolute top-0.5 right-0.5 text-[27px] text-black cursor-pointer "
        />
        <p className="text-2xl mx-auto font-semibold mb-2">Site Images</p>
        <div className=" flex items-center justify-center">
          <input
            id="fileInput"
            name="fileInput"
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files);
              setSiteImages(selectedFiles);
            }}
            type="file"
            multiple="multiple"
          />
          <button
            onClick={() => {
              uploadImages();
            }}
            disabled={!siteImages}
            className=" disabled:bg-gray-400 bg-[#90f24e] hover:bg-[#89db4f] border border-black px-4 py-2 font-medium text-sm "
          >
            Upload Images
          </button>
        </div>
        <div className=" w-full mt-5  overflow-y-scroll">
          <div className="  grid grid-cols-3 gap-5 p-3 bg-gray-200 ">
            {!downloadSiteImgURLs && "No Images Available"}
            {downloadSiteImgURLs?.map((image, index) => {
              return (
                <Link key={index} href={image} target="_blank">
                  <Image
                    src={image}
                    alt={image}
                    width={1000}
                    height={1000}
                    className=" object-cover w-full h-full "
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      ;
    </div>
  );
};
export default function CheckProgressImages({
  dbName,
  setIsProgressImages,
  id,
  downloadProgressImgURLs,
  setDownloadProgressImgURLs,
}) {
  const [progressImages, setProgressImages] = useState(false);
  const uploadImages = async () => {
    try {
      // uploading multiple images at once to firebase
      progressImages.map(async (image, index) => {
        const storageRef = ref(
          storage,
          `ProgressImages/${dbName.slice(0, 3)}/${id}/${image.name}`
        );
        await uploadBytes(storageRef, image);
      });

      // folder ref to donwload all files links at once
      const folderRef = ref(
        storage,
        `ProgressImages/${dbName.slice(0, 3)}/${id}`
      );
      const folderContent = await listAll(folderRef);
      const downloadURLs1 = [];
      await Promise.all(
        folderContent.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          downloadURLs1.push(url);
        })
      );
      alert("Images Uploaded");
      setIsProgressImages(false);
      // console.log(downloadURLs1);
      setDownloadProgressImgURLs(downloadURLs1);
      setProgressImages(false);
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center w-full h-[100vh] overflow-hidden bg-black/70">
      <div className=" actual-receipt w-[90%] h-[90vh] relative overflow-hidden p-7 bg-white flex flex-col  items-center">
        <IoClose
          onClick={() => {
            setIsProgressImages(false);
          }}
          className=" absolute top-0.5 right-0.5 text-[27px] text-black cursor-pointer "
        />
        <p className="text-2xl mx-auto font-semibold mb-2">Progress Images</p>
        <div className=" flex items-center justify-center">
          <input
            id="fileInput"
            name="fileInput"
            onChange={(e) => {
              const selectedFiles = Array.from(e.target.files);
              setProgressImages(selectedFiles);
            }}
            type="file"
            multiple="multiple"
          />
          <button
            onClick={() => {
              uploadImages();
            }}
            disabled={!progressImages}
            className=" disabled:bg-gray-400 bg-[#90f24e] hover:bg-[#89db4f] border border-black px-4 py-2 font-medium text-sm "
          >
            Upload Images
          </button>
        </div>
        <div className=" w-full mt-5  overflow-hidden">
          <div className="  grid grid-cols-3 gap-5 p-3 bg-gray-200 overscroll-y-auto ">
            {downloadProgressImgURLs.length > 0 ? (
              downloadProgressImgURLs?.map((image, index) => {
                return (
                  <Link key={index} href={image} target="_blank">
                    <Image
                      src={image}
                      alt={image}
                      width={1000}
                      height={1000}
                      className=" object-cover w-full h-full "
                    />
                  </Link>
                );
              })
            ) : (
              <p className="">No Images Available</p>
            )}
          </div>
        </div>
      </div>
      ;
    </div>
  );
}
