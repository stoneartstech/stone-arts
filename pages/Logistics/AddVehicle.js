import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/firebase";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Image from "next/image";

export default function AddVehicle() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const date = new Date().toLocaleDateString();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [driver, setDriver] = useState("");

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

  return (
    <>
      {loading ? (
        <div className=" w-full flex items-center justify-center">
          <Image width={50} height={50} src="/loading.svg" alt="Loading ..." />
        </div>
      ) : (
        <div>
          <div className="w-full pl-6 pr-12 flex justify-between">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => router.back()}
            >
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
                  description,
                };
                setDoc(doc(db, "Vehicles", `${name}`), data);
                enqueueSnackbar("Vehicle Added Successfully", {
                  variant: "success",
                });
                setDescription("");
                setName("");
                setDriver("");
              } catch (error) {
                console.error(error);
                enqueueSnackbar("Something Went Wrong", {
                  variant: "error",
                });
              }
            }}
            className="flex flex-col items-center"
          >
            <p className="text-3xl">Add Vehicle</p>
            <div className="flex flex-col sm:flex-row p-8 gap-16 w-full">
              <div className="flex flex-col w-full">
                <p className="mt-2">Date : {date}</p>

                <p className="mt-4">
                  Vehicle Name <span className=" text-red-600">*</span>
                </p>
                <div className="flex flex-row gap-2">
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className=" p-2 w-full "
                  />
                </div>
                <p className="mt-2">Assign Driver</p>
                <select
                  value={driver}
                  onChange={(e) => setDriver(e.target.value)}
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
                <p className="mt-2">
                  Description <span className=" text-red-600">*</span>
                </p>
                <input
                  required
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className=" p-2 w-full "
                />
              </div>
            </div>
            <button
              disabled={date === "" || name === "" || description === ""}
              type="submit"
              className=" disabled:bg-gray-400 bg-green-400 hover:bg-green-600 p-2 rounded-lg mt-4"
            >
              Add Vehicle
            </button>
          </form>
        </div>
      )}
    </>
  );
}
