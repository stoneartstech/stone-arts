import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db, storage } from "@/firebase";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Image from "next/image";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function AddVehicle() {
  const [loading, setLoading] = useState(false);
  const [upLoading, setUpLoading] = useState(false);
  const router = useRouter();

  const date = new Date().toLocaleDateString();

  const [newVehicle, setNewVehicle] = useState({
    name: "",
    description: "",
    driver: "",
    colour: "",
    type: "",
    number: "",
    age: "",
  });
  const [documents, setDocuments] = useState([]);
  // const [description, setDescription] = useState("");
  // const [driver, setDriver] = useState("");
  const { name, description, driver, colour, type, number, age } = newVehicle;
  const [driversList, setDriversList] = useState([]);

  const fetchData = async () => {
    try {
      const driverSnapshot = await getDocs(collection(db, "Drivers"));
      const driversList = driverSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDriversList(driversList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleChange = (param, e) => {
    const data = { ...newVehicle };
    data[param] = e.target.value;
    setNewVehicle(data);
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
            const storageRef = ref(storage, `Vehicles/${name}/${index}`);
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
                  driver,
                  colour,
                  type,
                  number,
                  age,
                  description,
                  documents,
                };
                setDoc(doc(db, "Vehicles", `${name}`), data);
                enqueueSnackbar("Vehicle Added Successfully", {
                  variant: "success",
                });
                setNewVehicle({
                  name: "",
                  description: "",
                  driver: "",
                  colour: "",
                  type: "",
                  number: "",
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
              Add Vehicle
            </p>
            <div className="flex flex-col sm:flex-row p-3 md:p-8 gap-16 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
                <p className="md:col-span-2">Date : {date}</p>
                <div className="flex flex-col w-full">
                  <p className=" font-medium">
                    Vehicle Name <span className=" text-red-600">*</span>
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
                  <p className=" font-medium">Assign Driver</p>
                  <select
                    value={driver}
                    onChange={(e) => {
                      handleChange("driver", e);
                    }}
                    className=" p-2 w-full "
                  >
                    <option value="">Select a Driver</option>
                    {driversList?.map((driver, index) => {
                      return (
                        <option key={index} value={driver?.name}>
                          {driver?.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex flex-col w-full">
                  <p className=" font-medium">
                    Description <span className=" text-red-600">*</span>
                  </p>
                  <input
                    required
                    type="text"
                    value={description}
                    onChange={(e) => {
                      handleChange("description", e);
                    }}
                    className=" p-2 w-full "
                  />
                </div>
                <div className="flex flex-col w-full">
                  <p className=" font-medium">
                    Color <span className=" text-red-600">*</span>
                  </p>
                  <input
                    required
                    type="text"
                    value={colour}
                    onChange={(e) => {
                      handleChange("colour", e);
                    }}
                    className=" p-2 w-full "
                  />
                </div>
                <div className="flex flex-col w-full">
                  <p className=" font-medium">
                    Type <span className=" text-red-600">*</span>
                  </p>
                  <input
                    required
                    type="text"
                    value={type}
                    onChange={(e) => {
                      handleChange("type", e);
                    }}
                    className=" p-2 w-full "
                  />
                </div>
                <div className="flex flex-col w-full">
                  <p className=" font-medium">
                    Number <span className=" text-red-600">*</span>
                  </p>
                  <input
                    required
                    type="text"
                    value={number}
                    onChange={(e) => {
                      handleChange("number", e);
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
                    Upload Documents
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
              disabled={
                date === "" ||
                name === "" ||
                description === "" ||
                documents?.length <= 0
              }
              type="submit"
              className=" upload-form-btn"
            >
              Add Vehicle
            </button>
          </form>
        </div>
      )}
    </>
  );
}
