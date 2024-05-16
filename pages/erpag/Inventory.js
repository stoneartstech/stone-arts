import { db } from "@/firebase";
import { deleteDoc, disableNetwork, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Inventory = ({ compType, handEditSalesOrder, selectedOrder }) => {
  const today = new Date();
  const date =
    today.getDate() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    today.getFullYear();
  // Extract date
  const router = useRouter();
  const currentDate = new Date();
  //   alert(currentDate.toUTCString());
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Add leading zero if necessary
  const day = ("0" + currentDate.getDate()).slice(-2);

  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);

  const time = hours + "-" + minutes + "-" + seconds;
  const [data, setData] = useState({
    number: "",
    tag: "",
    dateAndTime: currentDate.toUTCString(),
    warehouse: "",
    deadline: "",
    price: "",
    priority: "",
    type: "",
    customer: "",
    key: "",
    taxLocation: "",
    priceTier: "",
    termsOfPayment: "",
    totalAmount: "",
    billingAddress: "",
  });

  useEffect(() => {
    if (compType?.toLowerCase() === "edit") {
      setData(selectedOrder);
    }
  }, []);
  const { number, tag, dateAndTime, warehouse, name } = data;
  const FormFields = [
    {
      name: "Document Header",
      form: [
        {
          field: "input",
          type: "text",
          name: "number",
          placeholder: "SD-00021",
          value: number,
          valueTag: "number",
        },
        {
          field: "input",
          type: "text",
          name: "tag",
          value: tag,
          valueTag: "tag",
        },
        {
          field: "input",
          type: "text",
          disabled: true,
          name: "Date And Time",
          value: dateAndTime,
          valueTag: "dateAndTime",
        },
        {
          field: "select",
          type: "text",
          name: "Warehouse",
          value: warehouse,
          valueTag: "warehouse",
          options: [
            { name: "Main Warehouse", value: "main-warehouse" },
            { name: "Parts Store", value: "parts-store" },
          ],
        },
        {
          field: "input",
          type: "text",
          placeholder: "name",
          name: "name",
          value: name,
          valueTag: "type",
        },
      ],
    },
  ];
  const [report, setReport] = useState([
    {
      SNo: 1,
      name: "",
      sku: "",
      quantity: "",
      UOM: "",
      stockPrice: "",
      stockAmount: "",
      addInfo: "",
    },
  ]);
  const handleAddRow = () => {
    const row = {
      SNo: report.length + 1,
      name: "",
      sku: "",
      quantity: "",
      UOM: "",
      stockPrice: "",
      stockAmount: "",
      addInfo: "",
    };
    setReport([...report, row]);
  };
  const handleRemoveRow = (index) => {
    if (report?.length > 1) {
      const list = [...report];
      list.splice(-1);
      setReport(list);
    }
  };

  return (
    <div className=" w-full h-full pb-10 bg-gray-200 overflow-x-auto ">
      <div className=" flex items-center justify-start">
        {" "}
        <button
          onClick={() => {
            router.back();
          }}
          className=" flex items-center gap-1 bg-gray-400 py-2 px-4 rounded-md text-xs md:text-sm font-medium"
        >
          Go Back
        </button>
      </div>
      <h1 className=" font-semibold capitalize text-[27px] text-center text-gray-800 my-2 ">
        Create Inventory
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            report.forEach((object) => {
              setDoc(
                doc(
                  db,
                  `erpag/Inventory/mainWarehouse`,
                  `${object?.name?.toLowerCase()?.replace(/\s+/g, "-")}`
                ),
                object
              );
            });
            alert("Inventory Updated Successfully");
            router.push("/erpag/Erpag");
          } catch (error) {
            alert("Error Updating Inventory");
          }
        }}
        className=" flex flex-col pb-10 bg-gray-200"
      >
        <h3 className=" font-semibold text-[18px] text-gray-800 my-2 ">
          Items
        </h3>
        <table className="table-auto overflow-x-auto">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-2 border-gray-400 border">Sl.</th>
              <th className="px-2 border-gray-400 border">Name</th>
              <th className="px-2 border-gray-400 border">SKU</th>
              <th className="px-2 border-gray-400 border">Quantity</th>
              <th className="px-2 border-gray-400 border">UOM</th>
              <th className="px-2 border-gray-400 border">Stock Price</th>
              <th className="px-2 border-gray-400 border">Stock Amount</th>
              <th className="px-2 border-gray-400 border">Additional Info</th>
            </tr>
          </thead>
          <tbody className="">
            {report.map((item, index) => (
              <tr key={index}>
                <td className="bg-white border border-gray-400 text-center p-1">
                  {index + 1}
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="text"
                    value={item.name}
                    required
                    onChange={(e) => {
                      const list = [...report];
                      list[index].name = e.target.value;
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="text"
                    value={item.sku}
                    required
                    onChange={(e) => {
                      const list = [...report];
                      list[index].sku = e.target.value;
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="text"
                    value={item.quantity}
                    required
                    onChange={(e) => {
                      const list = [...report];
                      list[index].quantity = e.target.value;
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="text"
                    value={item.UOM}
                    required
                    onChange={(e) => {
                      const list = [...report];
                      list[index].UOM = e.target.value;
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="number"
                    value={item.stockPrice}
                    required
                    onChange={(e) => {
                      const list = [...report];
                      list[index].stockPrice = e.target.value;
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="number"
                    value={item.stockAmount}
                    required
                    onChange={(e) => {
                      const list = [...report];
                      list[index].stockAmount = e.target.value;
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="text"
                    value={item.addInfo}
                    required
                    onChange={(e) => {
                      const list = [...report];
                      list[index].addInfo = e.target.value;
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className=" flex items-center justify-between">
          <div className=" flex items-center">
            <button
              className="bg-slate-400 w-fit mt-2 font-semibold text-xs md:text-sm hover:bg-green-500 p-2 md:p-2.5 rounded-lg"
              onClick={handleAddRow}
            >
              + Add Row
            </button>
            <button
              className="bg-slate-400 w-fit mt-2 ml-2 font-semibold text-xs md:text-sm hover:bg-red-500 p-2 md:p-2.5 rounded-lg"
              onClick={handleRemoveRow}
            >
              Remove Row
            </button>
          </div>
          <button
            type="submit"
            disabled={report[0].name === ""}
            className=" w-fit mt-2 font-semibold text-xs md:text-sm bg-green-500 disabled:bg-gray-400 text-white p-2 md:p-2.5 rounded-lg"
          >
            Create Inventory
          </button>
        </div>
      </form>
    </div>
  );
};

export default Inventory;
