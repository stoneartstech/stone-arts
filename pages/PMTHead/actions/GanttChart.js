import React, { useRef } from "react";
import {
  GanttComponent,
  Inject,
  Toolbar,
  PdfExport,
  Selection,
} from "@syncfusion/ej2-react-gantt";

const GanttChart = ({ report }) => {
  const ganttRef = useRef(null);

  const taskSettings = {
    id: "TaskID",
    name: "TaskName",
    startDate: "StartDate",
    endDate: "EndDate",
    duration: "Duration",
    progress: "Progress",
  };

  const ganttData = report.map((item) => ({
    TaskID: item.No,
    TaskName: item.MaterialName,
    StartDate: new Date(item.StartDate),
    EndDate: new Date(item.EndDate),
    Duration: item.Duration,
    Progress: item.Progress,
  }));
  let ganttChart;

  const clickHandler = (args) => {
    if (args.item.id === "GanttExport_pdfexport" && ganttRef.current) {
      ganttRef.current.pdfExport();
    }
    if (args.item.text === "Pdf export") {
      ganttChart.pdfExport({ name: "GanttChart.pdf" });
    }
  };

  return (
    <GanttComponent
      ref={(gantt) => (ganttChart = gantt)}
      dataSource={ganttData}
      treeColumnIndex={1}
      taskFields={taskSettings}
      height="450px"
      allowPdfExport={true}
      toolbar={["PdfExport"]}
      toolbarClick={clickHandler}
    >
      <Inject services={[Toolbar, PdfExport]} />
    </GanttComponent>
  );
};

export default GanttChart;
