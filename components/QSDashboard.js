import React, { useState } from "react";
import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDocs,
  setDoc,
  docRef,
} from "firebase/firestore";
import Link from "next/link";

function QSDashboard({ qsId }) {
  const router = useRouter();
  const { logout } = useAuth();
  async function logoutHandler() {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  async function logoutHandler() {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  }

  const qsPages = [
    {
      name: "Pending Measurements",
      path: "Qs/PendingMeasurements",
      param: "pending-measurements",
    },
    {
      name: "Pending Site Quotes",
      path: "Qs/PendingSiteQuotes",
      param: "pending-site-quotes",
    },
    {
      name: "Pending Approval from Admin",
      path: "Qs/PendingAdminQs",
      param: "pending-admin-quotes",
    },
    {
      name: "Pending Approval from Client",
      path: "Qs/PendingClientQs",
      param: "pending-client-quotes",
    },
    {
      name: "Completed Quotes",
      path: "Qs/CompletedQs",
      param: "completed-quotes",
    },
    {
      name: "Rejected Quotes",
      path: "Qs/RejectedQs",
      param: "rejected-quotes",
    },
  ];

  return (
    <div>
      <div className="w-full px-8 flex flex-row justify-between">
        <button
          className="bg-slate-300 p-2 rounded-lg"
          onClick={() => router.back()}
        >
          Go Back
        </button>
        <button className="bg-red-500 p-2 rounded-lg" onClick={logoutHandler}>
          Logout
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-12 my-4">
        <p className="my-4 text-3xl text-center">QS {qsId} Dashboard</p>
      </div>
      <div className="flex flex-col gap-4 mt-8 items-center">
        {qsPages.map((page) => (
          <Link
            key={page["param"]}
            href={{
              pathname: page["path"],
              query: { param: `qs${qsId}-${page["param"]}` },
            }}
            className="bg-slate-300 p-2 rounded-lg text-center sm:w-1/3"
          >
            {page["name"]}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QSDashboard;
