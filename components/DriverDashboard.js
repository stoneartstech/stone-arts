import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

function DriverDashboard({ driverId }) {
  const router = useRouter();
  const { logout } = useAuth();

  const [driver, setDriver] = useState("");
  const [orders, setOrders] = useState("");
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(locationData);
            resolve(locationData);
          },
          (error) => {
            console.error(error.message);
            reject(error);
          }
        );
      } else {
        const error = "Geolocation is not supported by this browser.";
        console.error(error);
        reject(new Error(error));
      }
    });
  };

  const fetchDriverData = async () => {
    try {
      // Fetch the driver data
      const driverResult = await getDoc(doc(db, `Drivers/Driver-127`));
      const driverData = driverResult?.data();
      setDriver(driverData);

      // Fetch location
      const locationData = await getLocation();

      // Proceed only if both driver data and location data are available
      if (driverData && locationData) {
        if (driverData?.ongoingOrders) {
          setOrders(driverData.ongoingOrders);
        }

        const locationDoc = await getDoc(
          doc(db, `Location/${driverData?.name}`)
        );
        const locationDocData = locationDoc?.data();

        const tempLocation = locationDocData?.data ? locationDocData.data : [];
        tempLocation.unshift({
          name: driverData?.name,
          location: {
            latitude: "-0.46666698574534504",
            longitude: "37.650000023631726",
          },
          time: new Date().toLocaleTimeString(),
          date: new Date().toISOString(),
        });

        await setDoc(doc(db, `Location/${driverData?.name}`), {
          data: tempLocation,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

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
          <Link href="/DriverDashboard/Costs" className=" main-btn col-span-2">
            <p>Upload Costs</p>
          </Link>
          <Link
            href="/DriverDashboard/ViewCosts"
            className=" main-btn col-span-2"
          >
            <p>View Costs</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;
