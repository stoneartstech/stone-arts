import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function RequestDetails() {
  const router = useRouter();
  const {
    id,
    name,
    description,
    clientFirstName,
    clientLastName,
    clientPhoneNumber,
    clientEmail,
    clientAddress,
    downloadURL,
  } = router.query;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("ID:", id);
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Client First Name:", clientFirstName);
    console.log("Client Last Name:", clientLastName);
    console.log("Client Phone Number:", clientPhoneNumber);
    console.log("Client Email:", clientEmail);
    console.log("Client Address:", clientAddress);
    console.log("Download URL:", downloadURL);
  }, [
    id,
    name,
    description,
    clientFirstName,
    clientLastName,
    clientPhoneNumber,
    clientEmail,
    clientAddress,
    downloadURL,
  ]);

  return (
    <>
      {!loading && (
        <div>
          <div className="w-full px-8 flex flex-row justify-between">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
          <div className="flex flex-col mt-4">
            <p className="text-2xl mx-auto font-bold">Information</p>
          </div>
          <div className="flex flex-col gap-4 mt-8 items-center">
            <div className="text-center text-2xl">Site ID: {id}</div>
            <div className="text-center text-2xl ">Site Name: {name}</div>
            <div className="text-center text-xl">
              Description: {description}
            </div>
            <div className="text-center text-xl my-1">
              Client First Name: {clientFirstName}
            </div>
            <div className="text-center text-xl">
              Client Last Name: {clientLastName}
            </div>
            <div className="text-center text-xl">
              Client Phone Number: {clientPhoneNumber}
            </div>
            <div className="text-center text-xl">
              Client Email: {clientEmail}
            </div>
            <div className="text-center text-xl">
              Client Address: {clientAddress}
            </div>

            {downloadURL && (
              <div className="mt-4">
                <img src={downloadURL} alt="Design Image" className="max-w-full h-auto" />
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={() => window.open(downloadURL)}
                className="bg-green-400 p-2 rounded-lg text-center"
              >
                Check Design
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
