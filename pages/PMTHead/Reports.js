import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Reports() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const reports = [
    {
      name: "Running Sites Balance Report",
      upload: "/PMTHeadReports/RunningSitesBalanceReportUpload",
      history: "/PMTHeadReports/RunningSitesBalanceReportHistory",
    },
    {
      name: "Completed Sites Balance Report",
      upload: "/PMTHeadReports/CompletedSitesBalanceReportUpload",
      history: "/PMTHeadReports/CompletedSitesBalanceReportHistory",
    },
    {
      name: "Site Progress Report",
      upload: "/PMTHeadReports/RunningSiteProgressReportUpload",
      history: "/PMTHeadReports/RunningSiteProgressReportHistory",
    },
    {
      name: "Site Supervisor Report (Daily)",
      upload: "/PMTHeadReports/SupervisorDailyReportUpload",
      history: "/PMTHeadReports/SupervisorDailyReportHistory",
    },
    {
      name: "Site Supervisor Report (Weekly)",
      upload: "/PMTHeadReports/SupervisorWeeklyReportUpload",
      history: "/PMTHeadReports/SupervisorWeeklyReportHistory",
    },
  ];

  return (
    <div>
      <div className="w-full md:pl-8">
        <button
          className="bg-slate-300 p-2 rounded-lg"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      <p className="mt-2 text-2xl text-center font-bold mb-4">Reports</p>
      {reports.map((report, index) => (
        <div
          key={index}
          className="items-center sm:mx-24 flex flex-col gap-1 md:grid grid-cols-3 gap-x-12 mb-4"
        >
          <p className="text-lg text-center">{report.name}</p>
          <Link
            href={{
              pathname: report.upload,
            }}
            className="bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center"
          >
            Upload
          </Link>

          <Link
            href={{
              pathname: report.history,
            }}
            className="bg-slate-300 hover:bg-slate-500 text-black p-3 w-full sm:max-w-[25vw] text-center"
          >
            History
          </Link>
        </div>
      ))}
    </div>
  );
}
