import Link from "next/link";
import { useRouter } from "next/router";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import React, { useState } from "react";

const LogIDashboard = () => {
  const [pastTrips, setPastTrips] = useState([]);
  const [filteredPastTrips, setFilteredPastTrips] = useState(pastTrips);
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    let desOp = pastTrips.filter((item) => {
      if (search === "") {
        return item;
      } else {
        return item?.name?.toLowerCase()?.includes(search?.toLowerCase());
      }
    });
    setFilteredPastTrips(desOp);
  };
  const handleDateSearch = () => {
    if (toDate === "" && fromDate === "") {
      enqueueSnackbar("To and From Dates are required", {
        variant: "warning",
      });
    } else if (toDate === "" && fromDate !== "") {
      enqueueSnackbar("To Date is required", {
        variant: "warning",
      });
    } else if (fromDate === "" && toDate !== "") {
      enqueueSnackbar("From Date is required", {
        variant: "warning",
      });
    } else if (new Date(toDate) < new Date(fromDate)) {
      enqueueSnackbar("To Date should be greater than From Date", {
        variant: "warning",
      });
    } else {
      let desOp = pastTrips.filter((item) => {
        return (
          new Date(item.date) >= new Date(fromDate) &&
          new Date(item.date) <= new Date(toDate)
        );
      });
      setFilteredPastTrips(desOp);
    }
  };
  const router = useRouter();
  return (
    <div>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
      <div className=" flex flex-col md:flex-row md:items-center justify-center relative">
        <button
          className="bg-slate-300 p-2 rounded-lg w-fit md:absolute left-0 top-0"
          onClick={() => router.back()}
        >
          Go Back
        </button>
        <p className=" text-center text-lg md:text-2xl font-medium my-3 md:my-0">
          Past Orders
        </p>
        <Link
          href="/Logistics/PendingOrders"
          className="bg-green-500 font-medium text-[14.5px] p-2 rounded-lg text-center md:absolute right-0 top-0"
        >
          View Pending Orders
        </Link>
      </div>
      <div className="  ">
        <div className=" md:col-span-2 flex flex-col  px-3 rounded-lg pb-5 h-full max-h-[350px] relative overflow-y-auto">
          <div className=" grid grid-cols-1 md:grid-cols-2 py-2 my-3">
            <div className=" flex items-center flex-col md:flex-row gap-3">
              <div className=" flex items-center border border-black px-2 py-0.5 rounded-md">
                <p>From-</p>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                  }}
                  className=" p-2 border-none bg-transparent outline-none text-sm md:text-base "
                />
              </div>
              <div className=" flex items-center border border-black px-2 py-0.5 rounded-md">
                <p>To-</p>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                  }}
                  className=" p-2 border-none bg-transparent text-sm md:text-base outline-none "
                />
              </div>
              <button
                onClick={() => {
                  handleDateSearch();
                }}
                className=" bg-[#94e63d] hover:bg-[#83cb37] py-2.5 px-4  font-medium rounded-md ml-2 text-sm md:text-base"
              >
                Search
              </button>
            </div>
            <div className=" flex items-center mt-3 md:mt-0 ">
              <div className=" flex items-center border border-black p-2 rounded-md">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  placeholder="Search by Name"
                  className=" border-none bg-transparent outline-none text-sm md:text-base "
                />
              </div>
              <button
                onClick={() => {
                  handleSearch();
                }}
                className=" bg-[#94e63d] hover:bg-[#83cb37] py-2.5 px-4  font-medium rounded-md ml-2 text-sm md:text-base"
              >
                Search
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            {filteredPastTrips?.length === 0 && (
              <p className=" mt-2">No Past Orders !!</p>
            )}{" "}
            {filteredPastTrips?.map((order, index) => {
              return (
                <div
                  key={index}
                  className=" mt-2.5 md:w-[70%] grid grid-cols-3 md:grid-cols-5"
                >
                  <div className=" py-1.5 md:py-0  col-span-3 md:col-span-2 text-sm md:text-base  border-black border flex items-center justify-center font-semibold">
                    {order?.name}
                  </div>
                  <button
                    onClick={() => {
                      // setActiveOrder(order);
                      // setViewOrder(true);
                      // setOrderType(0);
                      console.log(order);
                    }}
                    className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-2.5 px-4 border-black border md:border-l-0"
                  >
                    Check Location History
                  </button>
                  <button
                    onClick={() => {}}
                    className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-2.5 px-4 border-black border border-l-0"
                  >
                    Check Vehicle Information
                  </button>
                  <button
                    onClick={() => {
                      // handleSiteOrders(order.clientId);
                    }}
                    className=" bg-[#94e63d] hover:bg-[#83cb37] text-xs md:text-sm font-semibold py-2.5 px-4 border-black border border-l-0"
                  >
                    Check Delivery Information
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIDashboard;
