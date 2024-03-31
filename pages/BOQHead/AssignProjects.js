import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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

export default function AssignProjects() {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const QSId = searchParams.get("id");
  const [QSMembers, setQSMembers] = useState([
    { name: "QS 1", id: "1" },
    { name: "QS 2", id: "2" },
    { name: "QS 3", id: "3" },
  ]);
  const QSName = QSMembers[QSId - 1].name;

  const [assigned, setAssigned] = useState([]);

  const [pendingProjects, setPendingProjects] = useState([]);
  useEffect(() => {
    const querySnapshot = onSnapshot(collection(db, "boq"), (snapshot) => {
      console.log(snapshot.docs);
      const pendingProjects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingProjects(pendingProjects);
    });
    setLoading(false);
  }, []);

  async function handleAssign(projectId) {
    setAssigned([...assigned, projectId]);
  }

  async function submitHandler() {
    if (assigned.length === 0) return;
    for (const projectId of assigned) {
      const docRef = doc(db, "boq", projectId.toString());
      const projectDoc = await getDoc(docRef);
      const projectData = projectDoc.data();
      projectData.status = "pending";
      deleteDoc(docRef);
      const dbName = "qs" + QSId;
      await setDoc(
        doc(db, dbName + "-pending-measurements", projectId.toString()),
        projectData
      );
      await setDoc(
        doc(db, "pending-measurements", projectId.toString()),
        projectData
      );
    }
    alert("Measurement assigned successfully");
    router.back();
  }

  const handleUndo = (projectId) => {
    const updatedAssigned = assigned.filter((id) => id !== projectId);
    setAssigned(updatedAssigned);
  };

  const isAssigned = (projectId) => assigned.includes(projectId);

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
              Assigning sites to {QSName}
            </p>
          </div>
          <div className="flex flex-col gap-4 mt-8 items-center">
            {pendingProjects.map((project) => (
              <div
                key={project.id}
                className="grid grid-cols-3 gap-12 items-center"
              >
                <p>
                  {project.name} - {project.id}
                </p>
                <button
                  className="bg-green-400 p-2 w-32 rounded-lg text-center disabled:opacity-50"
                  onClick={() => handleAssign(project.id)}
                  disabled={isAssigned(project.id)}
                >
                  Assign
                </button>
                {isAssigned(project.id) && (
                  <button
                    className="bg-red-400 p-2 w-32 rounded-lg text-center"
                    onClick={() => handleUndo(project.id)}
                  >
                    Undo
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex mt-8">
            <button
              className="bg-green-400 p-2 rounded-lg text-center text-xl mx-auto"
              onClick={() => submitHandler()}
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}
    </>
  );
}
