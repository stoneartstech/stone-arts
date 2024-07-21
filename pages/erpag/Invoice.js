// import React, { Fragment, useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import {
//   IoAddSharp,
//   IoBarChartSharp,
//   IoReorderThreeOutline,
//   IoTabletLandscapeSharp,
// } from "react-icons/io5";
// import Head from "next/head";
// import { AiOutlineBorderlessTable } from "react-icons/ai";
// import { Text, View, Page, Document, StyleSheet } from "@react-pdf/renderer";
// import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
// import {
//   collection,
//   doc,
//   getDoc,
//   onSnapshot,
//   setDoc,
// } from "firebase/firestore";
// import { db } from "@/firebase";
// import { useRouter } from "next/router";

// const columns = [
//   { field: "id", headerName: "ID", width: 70 },
//   { field: "number", headerName: "Number", width: 70 },
//   { field: "invoiceDate", headerName: "Invoice Date", width: 130 },
//   { field: "salesOrder", headerName: "Sales Order ", width: 130 },
//   { field: "dateAndTime", headerName: "Date and Time", width: 130 },
//   { field: "customer", headerName: "Customer", width: 130 },
//   { field: "status", headerName: "Status", width: 130 },
//   { field: "amount", headerName: "Amount", width: 130 },
//   { field: "totalAmount", headerName: "Total Amount", width: 130 },
//   { field: "warehouse", headerName: "Warehouse", width: 130 },
//   { field: "paymentStatus", headerName: "Payment Status", width: 130 },
//   { field: "unpaidAmt", headerName: "Unpaid Amount", width: 130 },
// ];

// const rows = [
//   {
//     id: 1,
//     number: "IN-000003",
//     invoiceDate: "01/03/2023 14:12",
//     salesOrder: "SO-00007",
//     dateAndTime: "04/03/2023 14:12",
//     customer: "PC WORLD LLC",
//     status: "FULFILLED",
//     amount: 185.99,
//     totalAmount: 199.99,
//     warehouse: "Main Warehouse",
//     paymentStatus: "PAID",
//     unpaidAmt: 0.0,
//   },
//   {
//     id: 2,
//     number: "IN-000003",
//     invoiceDate: "01/03/2023 14:12",
//     salesOrder: "SO-00007",
//     dateAndTime: "04/03/2023 14:12",
//     customer: "PC WORLD LLC",
//     status: "FULFILLED",
//     amount: 185.99,
//     totalAmount: 199.99,
//     warehouse: "Main Warehouse",
//     paymentStatus: "PAID",
//     unpaidAmt: 0.0,
//   },
//   {
//     id: 3,
//     number: "IN-000003",
//     invoiceDate: "01/03/2023 14:12",
//     salesOrder: "SO-00007",
//     dateAndTime: "04/03/2023 14:12",
//     customer: "PC WORLD LLC",
//     status: "FULFILLED",
//     amount: 185.99,
//     totalAmount: 199.99,
//     warehouse: "Main Warehouse",
//     paymentStatus: "PAID",
//     unpaidAmt: 0.0,
//   },
//   {
//     id: 4,
//     number: "IN-000003",
//     invoiceDate: "01/03/2023 14:12",
//     salesOrder: "SO-00007",
//     dateAndTime: "04/03/2023 14:12",
//     customer: "PC WORLD LLC",
//     status: "FULFILLED",
//     amount: 185.99,
//     totalAmount: 199.99,
//     warehouse: "Main Warehouse",
//     paymentStatus: "PAID",
//     unpaidAmt: 0.0,
//   },
//   {
//     id: 5,
//     number: "IN-000003",
//     invoiceDate: "01/03/2023 14:12",
//     salesOrder: "SO-00007",
//     dateAndTime: "04/03/2023 14:12",
//     customer: "PC WORLD LLC",
//     status: "FULFILLED",
//     amount: 185.99,
//     totalAmount: 199.99,
//     warehouse: "Main Warehouse",
//     paymentStatus: "PAID",
//     unpaidAmt: 0.0,
//   },
//   {
//     id: 6,
//     number: "IN-000003",
//     invoiceDate: "01/03/2023 14:12",
//     salesOrder: "SO-00007",
//     dateAndTime: "04/03/2023 14:12",
//     customer: "PC WORLD LLC",
//     status: "FULFILLED",
//     amount: 185.99,
//     totalAmount: 199.99,
//     warehouse: "Main Warehouse",
//     paymentStatus: "PAID",
//     unpaidAmt: 0.0,
//   },
//   {
//     id: 7,
//     number: "IN-000003",
//     invoiceDate: "01/03/2023 14:12",
//     salesOrder: "SO-00007",
//     dateAndTime: "04/03/2023 14:12",
//     customer: "PC WORLD LLC",
//     status: "FULFILLED",
//     amount: 185.99,
//     totalAmount: 199.99,
//     warehouse: "Main Warehouse",
//     paymentStatus: "PAID",
//     unpaidAmt: 0.0,
//   },
//   {
//     id: 8,
//     number: "IN-000003",
//     invoiceDate: "01/03/2023 14:12",
//     salesOrder: "SO-00007",
//     dateAndTime: "04/03/2023 14:12",
//     customer: "PC WORLD LLC",
//     status: "FULFILLED",
//     amount: 185.99,
//     totalAmount: 199.99,
//     warehouse: "Main Warehouse",
//     paymentStatus: "PAID",
//     unpaidAmt: 0.0,
//   },
// ];

// const Header = ({ Invoice1 }) => {
//   const bulkOptions = [
//     { name: "Print", action: "print" },
//     { name: "Save to GDRIVE", action: "gdrive" },
//     { name: "Mail To", action: "mailto" },
//     { name: "Download", action: "download" },
//   ];
//   const router = useRouter();
//   const [isBulkMenu, setIsBulkMenu] = useState(false);
//   return (
//     <div className=" flex flex-col gap-2 lg:flex-row w-full py-2 lg:items-center justify-between">
//       <div className=" relative flex items-center gap-2  ">
//         <button
//           onClick={() => {
//             router.back();
//           }}
//           className=" flex items-center gap-1 bg-gray-400 py-2 px-4 rounded-md text-sm font-medium"
//         >
//           Go Back
//         </button>
//         <button
//           onClick={() => {
//             setIsBulkMenu((prev) => (prev === true ? false : true));
//           }}
//           className=" flex items-center gap-1 bg-green-400 py-2 px-4 rounded-md text-sm font-medium"
//         >
//           <IoAddSharp />
//           Bulk Action
//         </button>
//         {isBulkMenu && (
//           <div className=" absolute top-11 -right-7 shadow-sm shadow-black/60 bg-white flex flex-col z-30 text-sm ">
//             {/* {bulkOptions?.map((item, index) => { */}
//             {/* //   return ( */}
//             <PDFDownloadLink document={<Invoice1 />} fileName={`pdf-quote.pdf`}>
//               <p className=" py-2 px-6 min-w-max cursor-pointer hover:bg-blue-400">
//                 Download
//               </p>
//             </PDFDownloadLink>
//             {/* ); */}
//             {/* })} */}
//           </div>
//         )}
//       </div>
//       <div className=" flex items-center gap-2">
//         <button className=" flex items-center gap-1 bg-gray-300 py-2 px-4 rounded-md">
//           <AiOutlineBorderlessTable />
//           View
//         </button>
//         <button className=" flex items-center gap-1 bg-gray-300 py-2 px-4 rounded-md">
//           <IoBarChartSharp />
//           Chart
//         </button>
//         <button className=" flex items-center gap-1 bg-gray-300 py-2 px-4 rounded-md">
//           <IoReorderThreeOutline />
//           More
//         </button>
//       </div>
//     </div>
//   );
// };
// const Invoice = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();

//   const today = new Date();
//   const date =
//     today.getDate() +
//     "-" +
//     ("0" + (today.getMonth() + 1)).slice(-2) +
//     "-" +
//     today.getFullYear();
//   // Extract date components
//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Add leading zero if necessary
//   const day = ("0" + currentDate.getDate()).slice(-2);

//   const hours = ("0" + currentDate.getHours()).slice(-2);
//   const minutes = ("0" + currentDate.getMinutes()).slice(-2);
//   const seconds = ("0" + currentDate.getSeconds()).slice(-2);

//   const time = hours + "-" + minutes + "-" + seconds;

//   useEffect(() => {
//     const fetch = onSnapshot(
//       collection(db, "erpag/reports/invoices"),
//       (snapshot) => {
//         var reports = snapshot.docs.map((doc) => ({
//           ...doc.data(),
//         }));
//         setData(reports[0]?.data);
//         setLoading(false);
//       }
//     );
//     return fetch;
//   }, []);

//   const Invoice2 = () => {
//     const styles = StyleSheet.create({
//       page: {
//         fontSize: 11,
//         paddingTop: 20,
//         paddingLeft: 40,
//         paddingRight: 40,
//         lineHeight: 1.5,
//         flexDirection: "column",
//       },

//       spaceBetween: {
//         flex: 1,
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         color: "#3E3E3E",
//       },

//       titleContainer: { flexDirection: "row", marginTop: 24 },

//       logo: { width: 90 },

//       reportTitle: { fontSize: 16, textAlign: "center" },

//       addressTitle: { fontSize: 11, fontStyle: "bold" },

//       invoice: { fontWeight: "bold", fontSize: 20 },

//       invoiceNumber: { fontSize: 11, fontWeight: "bold" },

//       address: { fontWeight: 400, fontSize: 10 },

//       theader: {
//         marginTop: 20,
//         fontSize: 10,
//         fontStyle: "bold",
//         paddingTop: 4,
//         paddingLeft: 7,
//         flex: 1,
//         height: 20,
//         backgroundColor: "#3b82f6",
//         borderColor: "whitesmoke",
//         borderRightWidth: 1,
//         borderBottomWidth: 1,
//       },

//       theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

//       tbody: {
//         fontSize: 9,
//         paddingTop: 4,
//         paddingLeft: 7,
//         flex: 1,
//         borderColor: "whitesmoke",
//         borderRightWidth: 1,
//         borderBottomWidth: 1,
//       },

//       total: {
//         fontSize: 9,
//         paddingTop: 4,
//         paddingLeft: 7,
//         flex: 1.5,
//         borderColor: "#ffedd5",
//         borderBottomWidth: 1,
//       },

//       tbody2: { flex: 2, borderRightWidth: 1 },
//     });

//     const InvoiceTitle = () => {
//       return (
//         <View style={styles.titleContainer}>
//           <View style={styles.spaceBetween}>
//             <Text style={styles.reportTitle}>Stone Arts</Text>
//           </View>
//         </View>
//       );
//     };

//     const TableHead = () => {
//       return (
//         <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>Sl No.</Text>
//           </View>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>number</Text>
//           </View>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>invoiceDate</Text>
//           </View>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>salesOrder</Text>
//           </View>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>dateAndTime</Text>
//           </View>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>customer</Text>
//           </View>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>status</Text>
//           </View>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>amount</Text>
//           </View>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>totalAmount</Text>
//           </View>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>warehouse</Text>
//           </View>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>paymentStatus</Text>
//           </View>
//           <View style={[styles.theader, styles.theader2]}>
//             <Text>unpaidAmt</Text>
//           </View>
//         </View>
//       );
//     };

//     const TableBody = () => {
//       return rows?.map((receipt) => (
//         <Fragment key={receipt.id}>
//           <View style={{ width: "100%", flexDirection: "row" }}>
//             <View style={[styles.tbody]}>
//               <Text>{receipt.id}</Text>
//             </View>
//             <View style={styles.tbody}>
//               <Text>{receipt.number}</Text>
//             </View>
//             <View style={styles.tbody}>
//               <Text>{receipt.invoiceDate}</Text>
//             </View>
//             <View style={styles.tbody}>
//               <Text>{receipt.salesOrder}</Text>
//             </View>
//             <View style={styles.tbody}>
//               <Text>{receipt.dateAndTime}</Text>
//             </View>
//             <View style={styles.tbody}>
//               <Text>{receipt.customer}</Text>
//             </View>
//             <View style={styles.tbody}>
//               <Text>{receipt.status}</Text>
//             </View>
//             <View style={styles.tbody}>
//               <Text>{receipt.amount}</Text>
//             </View>
//             <View style={styles.tbody}>
//               <Text>{receipt.totalAmount}</Text>
//             </View>
//             <View style={styles.tbody}>
//               <Text>{receipt.warehouse}</Text>
//             </View>
//             <View style={styles.tbody}>
//               <Text>{receipt.paymentStatus}</Text>
//             </View>
//             <View style={styles.tbody}>
//               <Text>{receipt.unpaidAmt}</Text>
//             </View>
//           </View>
//         </Fragment>
//       ));
//     };

//     return (
//       <Document>
//         <Page size="A4" style={styles.page}>
//           <InvoiceTitle />
//           <TableHead />
//           <TableBody />
//         </Page>
//       </Document>
//     );
//   };
//   return (
//     <div style={{ height: 400, width: "100%" }}>
//       {loading ? (
//         <div className=" w-full h-full flex items-center justify-center">
//           Loading...
//         </div>
//       ) : (
//         <>
//           <Header Invoice1={Invoice2} />
//           <DataGrid
//             rows={data}
//             columns={columns}
//             initialState={{
//               pagination: {
//                 paginationModel: { page: 0, pageSize: 5 },
//               },
//             }}
//             pageSizeOptions={[5, 10]}
//             checkboxSelection
//             sx={{
//               "& .MuiDataGrid-columnHeaders": {
//                 fontWeight: 700,
//                 borderRadius: "var(--none, 0px)",
//                 borderBottom: "1px solid var(--divider, rgba(0, 0, 0, 0.12))",
//                 borderLeft:
//                   "var(--none, 0px) solid var(--divider, rgba(0, 0, 0, 0.12))",
//                 borderRight:
//                   "var(--none, 0px) solid var(--divider, rgba(0, 0, 0, 0.12))",
//                 borderTop:
//                   "var(--none, 0px) solid var(--divider, rgba(0, 0, 0, 0.12))",
//                 background: "rgba(33, 150, 243, 0.08)",
//                 alignItems: "space-between !important",
//               },
//             }}
//           />
//         </>
//       )}
//     </div>
//   );
// };
// export default Invoice;
