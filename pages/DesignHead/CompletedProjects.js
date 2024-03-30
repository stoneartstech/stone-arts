import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function CompletedProjects() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const DesignerId = searchParams.get("id");
  const [designers, setDesigners] = useState([
    { name: "Design Head", id: "0" },
    { name: "Designer 1", id: "1" },
    { name: "Designer 2", id: "2" },
    { name: "Designer 3", id: "3" },
  ]);
  const DesignerName = designers[DesignerId].name;
  const dbName = "designer" + DesignerId + "-completed-designs";

  const [originalDesigns, setOriginalDesigns] = useState([]);
  const [designs, setDesigns] = useState([]);
  useEffect(() => {
    const querySnapshot = onSnapshot(collection(db, dbName), (snapshot) => {
      const completedDesigns = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDesigns(completedDesigns);
      setOriginalDesigns(completedDesigns);
    });
    setLoading(false);
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

  return (
    <>
      {!loading && (
        <div>
          <div className="w-full pl-8">
            <button
              className="bg-slate-300 p-2 rounded-lg"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
          <div className="flex flex-col">
            <p className="text-2xl mx-auto font-bold">
              {DesignerName} : Completed Designs
            </p>
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
              <Link
                key={design.id}
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
                className="bg-slate-300 p-2 rounded-lg text-center sm:w-1/3"
              >
                {design.name + " -> " + design.id}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
