import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function WorkshopDashboard() {
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
            currentUser.email !== "workshop@stonearts.com")
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
                Only Workshop/Admin can access this page.
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
                    {currentUser.email === "boqhead@stonearts.com"
                        ? "Workshop Dashboard"
                        : "Admin Workshop Dashboard"}
                </p>
            </div>
        </div>
    );

}