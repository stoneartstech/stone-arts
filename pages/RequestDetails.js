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
    notes,
    imageUrl,
  } = router.query;

  const [loading, setLoading] = useState(false);

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
            {downloadURL && (
              <button
                onClick={() => window.open(downloadURL)}
                className="bg-green-400 p-2 rounded-lg text-center"
              >
                Check Design
              </button>
            )}
            <div className="text-center text-xl font-bold mt-6">
              Client Info:
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
            <div className="text-center text-xl">Admin Notes: {notes}</div>
            {imageUrl && (
              <div className="text-center text-xl">
                Progress Image: <img src={imageUrl} alt="Uploaded" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
