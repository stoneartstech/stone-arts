import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, storage } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CheckProgress() {
    const router = useRouter();
    const { id, name, downloadURL, status, dbName, notesOld } = router.query;

    const [loading, setLoading] = useState(false);

    const [notes, setNotes] = useState(notesOld);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [notification, setNotification] = useState(null);

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
            setLoading(true);
            const designRef = doc(db, dbName, id);
            const designSnapshot = await getDoc(designRef);

            if (designSnapshot.exists()) {

                var updatedData = {
                    notes,
                }

                if (image) {
                    const storageRef = ref(storage, `designProgress/${id}`);
                    await uploadBytes(storageRef, image);
                    const downloadURL = await getDownloadURL(storageRef);
                    setImageUrl(downloadURL);
                    updatedData = {
                        ...updatedData,
                        imageUrl: downloadURL,
                    }
                }

                await setDoc(designRef, updatedData, { merge: true });
                console.log("Design updated successfully!");
                setLoading(false);
                // Show success notification
                setNotification("Design updated successfully!");

                router.back();
                setTimeout(() => {
                    setNotification(null);
                }, 3000); // Clear notification after 3 seconds
            } else {
                setLoading(false);
                setNotification("Please try again.");
            }
        } catch (error) {
            setLoading(false);
            setNotification("Please try again.");
        }
    };

    useEffect(() => {
        setIsFormValid(notes !== "" || image !== null);
    }, [notes, image]);

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (<>{!loading &&
        <div className="flex flex-col items-center justify-center">
            <div className="w-full px-8 flex flex-row justify-between">
                <button
                    className="bg-slate-300 p-2 rounded-lg"
                    onClick={() => router.back()}
                >
                    Go Back
                </button>
            </div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
                <div className="mb-6">
                    <p className="text-xl font-bold mb-3">Design ID: {id}</p>
                    <p className="text-xl font-bold mb-4">Design Name: {name}</p>
                    <p className="text-xl font-bold mb-4">Progress: {status}</p>
                    {downloadURL && <button
                        onClick={() => window.open(downloadURL)}
                        className="bg-green-400 p-2 rounded-lg text-center"
                    >
                        Check Design
                    </button>}
                    <div className="my-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Add Note:
                        </label>
                        <textarea
                            value={notes}
                            onChange={handleNoteChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                            rows="5"
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
                    {notification && (
                        <div className="text-green-600 text-sm mt-2">{notification}</div>
                    )}
                </div>
            </div>
        </div>
    }</>);
}
