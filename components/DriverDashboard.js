import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

function DriverDashboard({ driverId }) {
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

  return (
    <div>
      <div className="w-full px-8 flex flex-row justify-end">
        <button className=" logout-btn " onClick={logoutHandler}>
          Logout
        </button>
      </div>
      <div className="flex flex-col sm:flex-col items-center justify-center w-full my-4">
        <p className="page-heading">Driver {driverId} Dashboard</p>
        <div className="flex flex-col gap-2">
          <Link href="/DriverDashboard/PendingOrders" className=" main-btn">
            <p>Pending Orders</p>
          </Link>
          <Link href="/DriverDashboard/OngoingOrders" className=" main-btn">
            <p>Ongoing Orders</p>
          </Link>
          <Link
            href="/DriverDashboard/CompletedOrders"
            className=" main-btn col-span-2"
          >
            <p>Completed Orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
