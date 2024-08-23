import React, { useState } from "react";
import { useRouter } from "next/router";
import { db, storage } from "@/firebase";
import { setDoc, doc } from "firebase/firestore";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function AddDriver() {
  const [loading, setLoading] = useState(false);
  const [upLoading, setUpLoading] = useState(false);
  const router = useRouter();

  const date = new Date().toLocaleDateString();

  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    age: "",
    dob: "",
  });
  const [documents, setDocuments] = useState([]);
  const { name, phone, dob, age } = newDriver;

  const handleChange = (param, e) => {
    const data = { ...newDriver };
    data[param] = e.target.value;
    setNewDriver(data);
    console.log(data);
  };

  const handleUploadImages = async (event) => {
    console.log(documents);
    setUpLoading(true);

    if (name !== "") {
      try {
        const newData = [];

        console.log(documents);

        await Promise.all(
          documents.map(async (file, index) => {
            const storageRef = ref(storage, `Drivers/${name}/${index}`);
            await uploadBytes(storageRef, file);

            const downloadURL = await getDownloadURL(storageRef);
            newData.push({ id: index, url: downloadURL });
          })
        );

        setDocuments(newData);
        // console.log(newData);
        enqueueSnackbar("Documents Uploaded Successfully", {
          variant: "success",
        });
        // console.log(newVehicle);
      } catch (error) {
        enqueueSnackbar("Some Error Occured", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Name not added", {
        variant: "warning",
      });
    }
    setUpLoading(false);
  };

  return (
    <>
      {loading ? (
        <div className=" w-full flex items-center justify-center">
          <Image width={50} height={50} src="/loading.svg" alt="Loading ..." />
        </div>
      ) : (
        <div>
          <div className="w-full md:pl-6 pr-12 flex justify-between">
            <button className="go-back-btn" onClick={() => router.back()}>
              Go Back
            </button>
            <SnackbarProvider
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                const data = {
                  date,
                  name,
                  phone,
                  age,
                  dob,
                  age,
                  documents,
                };
                setDoc(doc(db, "Drivers", `${name}`), data);
                enqueueSnackbar("Driver Added Successfully", {
                  variant: "success",
                });
                setNewDriver({
                  name: "",
                  dob: "",
                  phone: "",
                  age: "",
                });
                setDocuments([]);
              } catch (error) {
                console.error(error);
                enqueueSnackbar("Something Went Wrong", {
                  variant: "error",
                });
              }
            }}
            className="flex flex-col items-center"
          >
            <p className="text-xl md:text-2xl  text-center w-full font-bold mb-2">
              Add Driver
            </p>
            <div className="flex flex-col sm:flex-row p-3 md:p-8 gap-16 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
                <p className="md:col-span-2">Date : {date}</p>
                <div className="flex flex-col w-full">
                  <p className=" font-medium">
                    Driver Name <span className=" text-red-600">*</span>
                  </p>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => {
                      handleChange("name", e);
                    }}
                    className=" p-2 w-full "
                  />
                </div>

                <div className="flex flex-col w-full">
                  <p className=" font-medium">
                    Phone Number <span className=" text-red-600">*</span>
                  </p>
                  <input
                    required
                    type="number"
                    value={phone}
                    onChange={(e) => {
                      handleChange("phone", e);
                    }}
                    className=" p-2 w-full "
                  />
                </div>
                <div className="flex flex-col w-full">
                  <p className=" font-medium">
                    Date Of Birth <span className=" text-red-600">*</span>
                  </p>
                  <input
                    required
                    type="date"
                    value={dob}
                    onChange={(e) => {
                      handleChange("dob", e);
                    }}
                    className=" p-2 w-full "
                  />
                </div>

                <div className="flex flex-col w-full">
                  <p className=" font-medium">
                    Age <span className=" text-red-600">*</span>
                  </p>
                  <input
                    required
                    type="text"
                    value={age}
                    onChange={(e) => {
                      handleChange("age", e);
                    }}
                    className=" p-2 w-full "
                  />
                </div>
                <div className="flex flex-col w-full">
                  <p className=" font-medium">
                    Upload Driving License
                    <span className=" text-red-600">*</span>
                  </p>
                  <input
                    required
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setDocuments(files);
                    }}
                    className=" p-2 w-full "
                  />
                  <button
                    type="button"
                    disabled={documents?.length === 0 || upLoading}
                    className=" upload-form-btn w-fit"
                    onClick={(event) => {
                      handleUploadImages(event);
                    }}
                  >
                    {upLoading ? "Uploading" : "Upload"}
                  </button>
                </div>
              </div>
            </div>
            <button
              disabled={date === "" || name === "" || documents?.length <= 0}
              type="submit"
              className=" upload-form-btn"
            >
              Add Driver
            </button>
          </form>
        </div>
      )}
    </>
  );
}
