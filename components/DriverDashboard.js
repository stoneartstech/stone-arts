import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

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
                <p className="my-4 text-3xl text-center">Driver {driverId} Dashboard</p>
            </div>

        </div>
    );
}

export default DriverDashboard;
