import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function PMTHead() {
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

  const { currentUser } = useAuth();

  if (
    !currentUser ||
    (currentUser.email !== "admin@stonearts.com" &&
      currentUser.email !== "pmthead@stonearts.com")
  ) {
    return (
      <div>
        <div className="w-full mb-8 flex justify-start items-start">
          <button
            className="bg-slate-300 p-2 rounded-lg"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
        Only PMT Head/Admin can access this page.
      </div>
    );
  }

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
      <div className="flex flex-col mt-4">
        <p className="text-2xl mx-auto font-bold">
          {currentUser.email === "pmthead@stonearts.com"
            ? "PMT Head Dashboard"
            : "Admin PMT Dashboard"}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col items-center my-12 gap-3">
          <Link
            href={{
              pathname: "/PMTHead/PendingSites",
            }}
            className="bg-slate-300 p-2 rounded-lg text-center sm:w-1/3"
          >
            Sites not assigned yet
          </Link>
          <Link
            href={{
              pathname: "/Workshop/OngoingSites",
            }}
            className="bg-slate-300 p-2 rounded-lg text-center sm:w-1/3"
          >
            Sites in Progress
          </Link>
          <Link
            href={{
              pathname: "/Workshop/UploadOrder",
            }}
            className="bg-slate-300 p-2 rounded-lg text-center sm:w-1/3 font-bold my-6"
          >
            Upload Order
          </Link>
          <Link
            href={{
              pathname: "/PMTHead/Reports",
            }}
            className="bg-slate-300 p-2 rounded-lg text-center sm:w-1/3 font-bold "
          >
            Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
