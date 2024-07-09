import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function LogiHead() {
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
      currentUser.email !== "logisticshead@stonearts.com")
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
        Only Logistics Head/Admin can access this page.
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
          {currentUser.email === "logisticshead@stonearts.com"
            ? "Logistics Head Dashboard"
            : "Admin Logistics Dashboard"}
        </p>
      </div>
      <div className=" flex flex-col gap-2 items-center mt-4">
        <Link
          href="/Logistics/Vehicles"
          className=" bg-gray-300 hover:bg-gray-400 rounded-md py-3 px-4 font-semibold w-full text-center max-w-[300px]"
        >
          <p>Vehicles</p>
        </Link>
        <Link
          href="/Logistics/Drivers"
          className=" bg-gray-300 hover:bg-gray-400 rounded-md py-3 px-4 font-semibold w-full text-center max-w-[300px]"
        >
          <p>Drivers</p>
        </Link>
        <Link
          href="/Logistics/LogiDashboard"
          className=" bg-gray-300 hover:bg-gray-400 rounded-md py-3 px-4 font-semibold w-full text-center max-w-[300px]"
        >
          <p>Past Orders</p>
        </Link>
        <Link
          href="/Logistics/PendingOrders"
          className=" bg-gray-300 hover:bg-gray-400 rounded-md py-3 px-4 font-semibold w-full text-center max-w-[300px]"
        >
          <p>Pending Orders</p>
        </Link>
      </div>
      {/* <LogIDashboard /> */}
    </div>
  );
}
