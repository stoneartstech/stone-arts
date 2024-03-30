import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db, storage } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDocs,
  setDoc,
  docRef,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function RequestsDisplay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const param = searchParams.get("param");
  const { currentUser } = useAuth();

  const designPages = [
    { name: "Design Requests from Showrooms", param: "design-requests" },
    { name: "Pending Designs to start", param: "pending-designs" },
    { name: "Ongoing Designs", param: "ongoing" },
    { name: "Pending Approval from Admin", param: "pending-admin" },
    { name: "Pending Approval from Client", param: "pending-client" },
    { name: "Completed Designs", param: "completed" },
  ];
  const page = designPages.find((page) => page.param === param);

  const [loading, setLoading] = useState(true);
  const [isDetailsPage, setIsDetailsPage] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(false);

  const [designers, setDesigners] = useState([
    { name: "Design Head", id: "0" },
    { name: "Designer 1", id: "1" },
    { name: "Designer 2", id: "2" },
    { name: "Designer 3", id: "3" },
  ]);
  const [designs, setDesigns] = useState([]);
  const [originalDesigns, setOriginalDesigns] = useState([]);
  useEffect(() => {
    setLoading(true); // Set loading to true initially

    // Create an array to store promises
    const promises = designers.map(async (designer) => {
      const designerId = designer.id;
      const dbName = "designer" + designerId + "-" + param;
      const designsRef = collection(db, dbName);

      // Return a promise that resolves when snapshot is received
      return new Promise((resolve, reject) => {
        const designsSnapshot = onSnapshot(designsRef, (snapshot) => {
          const designsList = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          resolve(designsList); // Resolve the promise with designsList
        });
      });
    });

    // Use Promise.all to wait for all promises to resolve
    Promise.all(promises).then((designsLists) => {
      // Flatten the array of arrays into a single array of designs
      const flattenedDesigns = designsLists.flat();
      // Set the designs state with the flattened array
      setDesigns(flattenedDesigns);
      //   console.log(flattenedDesigns);
      setOriginalDesigns(flattenedDesigns);
      setLoading(false); // Set loading to false when all promises are resolved
    });
  }, []);

  const [search, setSearch] = useState("");
  const handleSearch = () => {
    //name or id
    setDesigns(
      originalDesigns.filter((design) => {
        var searchParam = search.toLowerCase();
        return (
          design.name.toLowerCase().includes(searchParam) ||
          design.id.toString().includes(searchParam)
        );
      })
    );
  };
  async function handleApproveDesign(design) {
    const designData = designs.find((item) => item.id === design?.id);
    await setDoc(
      doc(db, "designer" + design?.designerId + "-pending-client", design?.id),
      designData
    );
    await deleteDoc(
      doc(db, "designer" + design?.designerId + "-pending-admin", design?.id)
    );
    const updatedDesigns = designs.filter((item) => item.id !== design?.id);
    setDesigns(updatedDesigns);
    alert(`Project ${design?.id} Approved.`);
  }

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
            <p className="text-2xl mx-auto font-bold">{page.name}</p>
          </div>
          <div className="flex flex-col gap-4 my-4 ">
            <div className="mx-auto">
              <input
                onChange={(e) => setSearch(e.target.value)}
                className="mx-auto border-2 border-black p-2"
              />
              <button
                className="bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2"
                onClick={handleSearch}
              >
                Search
              </button>
              <div className="bg-slate-300">
                {search &&
                  originalDesigns
                    .filter((design) => {
                      var searchParam = search.toLowerCase();
                      return (
                        design.name.toLowerCase().includes(searchParam) ||
                        design.id.toString().includes(searchParam)
                      );
                    })
                    .slice(0, 10)
                    .map((design) => (
                      <p
                        key={design.id}
                        onClick={() => {
                          setSearch(design.name);
                          handleSearch();
                        }}
                        className="p-2 text-black cursor-pointer"
                      >
                        {design.id} : {design.name}
                      </p>
                    ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-8 items-center">
            {designs.map((design) => (
              <div
                key={design["id"]}
                className={` w-full md:w-[83%] xl:w-[45%] grid ${page.param === "pending-admin" &&
                  currentUser &&
                  currentUser.email === "admin@stonearts.com"
                  ? "grid-cols-7"
                  : " grid-cols-5 "
                  } gap-3 bg-gray-500 sm:bg-gray-200 p-2 rounded-md `}
              >
                <Link
                  href={{
                    pathname: "/RequestDetails",
                    query: {
                      title: design["title"],
                      id: design["id"],
                      name: design["name"],
                      description: design["description"],
                      clientFirstName: design["clientFirstName"],
                      clientLastName: design["clientLastName"],
                      clientPhoneNumber: design["clientPhoneNumber"],
                      clientEmail: design["clientEmail"],
                      clientAddress: design["clientAddress"],
                      downloadURL: design["downloadURL"],
                    },
                  }}
                  className="bg-slate-300 p-2 rounded-lg text-center col-span-full sm:col-span-4 "
                >
                  {design["name"] + " -> " + design["id"]}
                </Link>
                {page.param === "pending-admin" && <button
                  onClick={() => {
                    setSelectedDesign(design);
                    setIsDetailsPage(true);
                  }}
                  className=" px-4 py-2 bg-slate-400 hover:bg-slate-500 col-span-3 sm:col-span-1 rounded-lg"
                >
                  View
                </button>}
                {/* to make it visible only to admin ------------------------------------------ */}
                {page.param === "pending-admin" &&
                  currentUser &&
                  currentUser.email === "admin@stonearts.com" && (
                    <button
                      onClick={() => {
                        handleApproveDesign(design);
                      }}
                      className=" px-4 py-2 col-span-4 sm:col-span-2 bg-slate-400 hover:bg-green-500 rounded-lg"
                    >
                      Approve Design
                    </button>
                  )}
              </div>
            ))}
          </div>
          {/* popup to show details of design selected -----------------------------------------  */}
          {isDetailsPage && (
            <div className=" w-full h-full bg-black/60 absolute inset-0 z-50 flex items-center justify-center overflow-hidden  ">
              <div className=" w-[93%] md:w-[75%] xl:w-[60%] h-[85%] p-6 md:p-8 flex flex-col bg-white relative overflow-y-scroll ">
                <IoClose
                  onClick={() => {
                    setIsDetailsPage(false);
                  }}
                  className=" text-[24px] md:text-[28px] absolute top-1 md:top-7 right-1 md:right-7 cursor-pointer "
                />
                <div className=" flex items-center mb-3 ">
                  <h3 className=" font-semibold text-xl">
                    Design Name: {selectedDesign?.name}{" "}
                  </h3>
                  <span
                    className={`ml-4 px-2 rounded-md capitalize text-xs md:text-sm  ${String(selectedDesign?.status).toLocaleLowerCase() ===
                      "pending"
                      ? "bg-red-400"
                      : ""
                      } `}
                  >
                    status: {selectedDesign.status}
                  </span>
                </div>
                <h3 className=" font-semibold text-lg mb-0.5 ">
                  Client Details
                </h3>
                <p className=" ">
                  Name: {selectedDesign?.clientFirstName}{" "}
                  {selectedDesign?.clientLastName}{" "}
                </p>
                <p className=" ">Email: {selectedDesign?.clientEmail}</p>
                <p className=" ">Address: {selectedDesign?.clientAddress}</p>
                <p className=" ">
                  Phone Number: {selectedDesign?.clientPhoneNumber}
                </p>
                <h3 className=" font-semibold text-lg mb-0.5 mt-3 ">
                  Project Details
                </h3>
                <p className=" ">Description: {selectedDesign?.description}</p>
                <p className=" ">Project ID: {selectedDesign?.id}</p>
                <p className=" ">Designer ID: {selectedDesign?.designerId}</p>
                <h3 className=" font-semibold text-lg mb-0.5 mt-3 ">
                  Design Preview
                </h3>
                <Link href={selectedDesign.downloadURL} target="_blank">
                  <img
                    className=" w-[95%] mt-3 object-contain"
                    src={selectedDesign.downloadURL}
                    alt="Design-Preview"
                  />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RequestsDisplay;
