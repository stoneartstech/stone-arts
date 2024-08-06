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
        <Link href="/Logistics/Vehicles" className=" main-btn">
          <p>Vehicles</p>
        </Link>
        <Link href="/Logistics/Drivers" className=" main-btn">
          <p>Drivers</p>
        </Link>
        {/* <div className=" my-2"> */}
        <Link href="/Logistics/PendingOrders" className=" main-btn mt-2">
          <p>Pending Orders</p>
        </Link>
        <Link href="/Logistics/OngoingOrders" className=" main-btn">
          <p>Ongoing Orders</p>
        </Link>
        <Link href="/Logistics/CompletedOrders" className=" main-btn">
          <p>Completed Orders</p>
        </Link>
        {/* </div> */}
        <Link
          href="/Logistics/AssignOrders"
          className="  main-btn mt-3 bg-green-500 hover:bg-green-600"
        >
          <p>Assign Order</p>
        </Link>
        <Link href="/Logistics/Reports" className="  main-btn">
          <p>Reports</p>
        </Link>
      </div>
    </div>
  );
}
