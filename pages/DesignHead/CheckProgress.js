import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function CheckProgress() {
  const router = useRouter();
  const { id, name, downloadURL, status, dbName } = router.query;

  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleNoteChange = (event) => {
    setNotes(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      const designRef = doc(db, dbName, id);
      const designSnapshot = await getDoc(designRef);
      
      if (designSnapshot.exists()) {
        const updatedData = {
          notes,
          ...(image && { imageUrl: `images/${id}/${image.name}` }),
        };

        await setDoc(designRef, updatedData, { merge: true });
        console.log("Design updated successfully!");

        // If image was uploaded, set the imageUrl state
        if (image) {
          setImageUrl(URL.createObjectURL(image));
        }
      } else {
        console.error("Design does not exist.");
      }
    } catch (error) {
      console.error("Error updating design:", error);
    }
  };

  useEffect(() => {
    setIsFormValid(notes !== "" || image !== null);
  }, [notes, image]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <button
        onClick={() => router.back()}
        className="absolute top-0 left-0 mt-4 ml-4 bg-slate-300 p-2 rounded-lg"
      >
        Go Back
      </button>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-6">
          <p className="text-xl font-bold mb-2">Design ID: {id}</p>
          <p className="text-xl font-bold mb-2">Design Name: {name}</p>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Add Note:
            </label>
            <input
              type="text"
              value={notes}
              onChange={handleNoteChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your notes"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Add Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
