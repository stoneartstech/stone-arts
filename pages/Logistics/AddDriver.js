import React, { useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/firebase";
import { setDoc, doc } from "firebase/firestore";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import Image from "next/image";

export default function AddDriver() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const date = new Date().toLocaleDateString();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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
                  description,
                };
                setDoc(doc(db, "Drivers", `${name}`), data);
                enqueueSnackbar("Driver Added Successfully", {
                  variant: "success",
                });
                setDescription("");
                setName("");
              } catch (error) {
                console.error(error);
                enqueueSnackbar("Something Went Wrong", {
                  variant: "error",
                });
              }
            }}
            className="flex flex-col items-center"
          >
            <p className="text-3xl">Add Driver</p>
            <div className="flex flex-col sm:flex-row p-8 gap-16 w-full">
              <div className="flex flex-col w-full">
                <p className="mt-2">Date : {date}</p>

                <p className="mt-4">Driver Name</p>
                <div className="flex flex-row gap-2">
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className=" p-2 w-full "
                  />
                </div>
                <p className="mt-2">Description</p>
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
              Add Driver
            </button>
          </form>
        </div>
      )}
    </>
  );
}
