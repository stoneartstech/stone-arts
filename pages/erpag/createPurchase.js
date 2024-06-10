import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const CreateSalesOrder = ({ compType, handEditSalesOrder, selectedOrder }) => {
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
  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Add leading zero if necessary
  const day = ("0" + currentDate.getDate()).slice(-2);

  const hours = ("0" + currentDate.getHours()).slice(-2);
  const minutes = ("0" + currentDate.getMinutes()).slice(-2);
  const seconds = ("0" + currentDate.getSeconds()).slice(-2);

  const time = hours + "-" + minutes + "-" + seconds;
  const [purchaseTotal, setPurchaseTotal] = useState(0);
  const [unpaidTotal, setUnpaidTotal] = useState(0);
  const [paidTotal, setPaidTotal] = useState("");
  const [data, setData] = useState({
    number: "",
    tag: "",
    dateAndTime: date + " : " + time,
    docDate: date,
    expected: "",
    type: "",
    supplier: "",
    key: "",
    referenceNo: "",
    termsOfPayment: "",
    totalAmount: "",
    orderStatus: "",
    paymentStatus: "",
  });

  useEffect(() => {
    if (compType?.toLowerCase() === "edit") {
      setData(selectedOrder);
    }
  }, []);
  const {
    number,
    tag,
    dateAndTime,
    docDate,
    expected,
    supplier,
    key,
    referenceNo,
    termsOfPayment,
    totalAmount,
    orderStatus,
    paymentStatus,
  } = data;
  const FormFields = [
    {
      name: "Document Header",
      form: [
        {
          field: "input",
          type: "text",
          name: "number",
          placeholder: "eg:PO-00021",
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
          name: "Date And Time",
          value: dateAndTime,
          valueTag: "dateAndTime",
        },
        {
          field: "input",
          type: "date",
          name: "Expected",
          value: expected,
          valueTag: "expected",
        },
      ],
    },
    {
      name: "Supplier",
      form: [
        {
          field: "select",
          type: "text",
          name: "Supplier",
          value: supplier,
          valueTag: "supplier",
          options: [
            { name: "Select Supplier", value: "" },
            { name: "supplier 1", value: "supplier-1" },
            { name: "supplier 2", value: "supplier-2" },
            { name: "supplier 3", value: "supplier-3" },
          ],
        },
        {
          field: "select",
          type: "text",
          name: "Key",
          value: key,
          valueTag: "key",
          options: [
            { name: "Select Key", value: "" },
            { name: "key 1", value: "key-1" },
            { name: "key 2", value: "key-2" },
            { name: "key 3", value: "key-3" },
          ],
        },
        {
          field: "input",
          type: "text",
          name: "Reference No.",
          valueTag: "referenceNo",
          value: referenceNo,
        },
        {
          field: "input",
          type: "text",
          name: "Documnet Date ",
          value: docDate,
          valueTag: "dateAndTime",
        },
        {
          field: "select",
          type: "text",
          name: "Terms Of Payment",
          value: termsOfPayment,
          valueTag: "termsOfpayment",
          options: [
            { name: "Select Mode", value: "" },
            { name: "mode 1", value: "mode-1" },
            { name: "mode 2", value: "mode-2" },
            { name: "mode 3", value: "mode-3" },
          ],
        },
        {
          field: "input",
          type: "text",
          name: "Total Amount",
          valueTag: "totalAmount",
          value: totalAmount,
        },
        {
          field: "input",
          type: "text",
          name: "Order Status",
          valueTag: "orderStatus",
          value: orderStatus,
        },
        {
          field: "input",
          type: "text",
          name: "Payment Status",
          valueTag: "paymentStatus",
          value: paymentStatus,
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
      price: "",
      discountPercentage: "",
      amount1: "",
    },
  ]);
  const handleAddRow = () => {
    const row = {
      SNo: report.length + 1,
      name: "",
      sku: "",
      quantity: "",
      UOM: "",
      price: "",
      discountPercentage: "",
      amount1: "",
    };
    setReport([...report, row]);
  };
  const handleRemoveRow = (index) => {
    const list = [...report];
    list.splice(-1);
    setReport(list);
  };

  return (
    <div className=" w-full h-full pb-10 bg-gray-200 ">
      <h1 className=" font-semibold capitalize text-[27px] text-center text-gray-800 my-2 ">
        {compType} Purchase
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            setDoc(
              doc(db, "erpag/reports/purchase", `Purchase-${date}-${time}`),
              {
                details: data,
                data: report,
                total: purchaseTotal,
                unpaid: unpaidTotal,
                date,
                time,
              }
            );
            alert("Invoice Created Successfully");
            router.push("/erpag/Erpag");
          } catch (error) {
            alert("Error Creating Sales Order");
          }
        }}
        className=" flex flex-col pb-10 bg-gray-200"
      >
        {FormFields?.map((form, index) => {
          return (
            <div key={index} className="">
              <h3 className=" font-semibold text-[18px] text-gray-800 my-2 ">
                {form?.name}
              </h3>
              <div className=" grid grid-cols-2 md:grid-cols-7 items-center gap-2 flex-wrap">
                {form?.form?.map((subItem, index1) => {
                  return (
                    <div key={index1}>
                      {subItem?.field?.toLocaleLowerCase() === "input" ? (
                        <div className=" flex flex-col">
                          <label
                            className=" text-sm capitalize"
                            htmlFor="number"
                          >
                            {subItem?.name}
                          </label>
                          <input
                            type={subItem?.type}
                            name={subItem?.name}
                            id={subItem?.name}
                            placeholder={subItem?.placeholder}
                            value={subItem?.value}
                            onChange={(e) => {
                              const newData = { ...data }; // Make a shallow copy of data
                              (newData[subItem?.valueTag] = e.target.value),
                                setData(newData);
                            }}
                            className="  bg-white rounded-md py-2 px-4"
                          />
                        </div>
                      ) : (
                        <div className=" flex flex-col">
                          <label
                            className=" text-sm capitalize"
                            htmlFor="warehouse"
                          >
                            {subItem?.name}
                          </label>
                          <select
                            name={subItem?.name}
                            id={subItem?.name}
                            value={subItem?.value}
                            onChange={(e) => {
                              const newData = { ...data }; // Make a shallow copy of data
                              (newData[subItem?.valueTag] = e.target.value),
                                setData(newData);
                            }}
                            className="  bg-white rounded-md py-2 px-4"
                          >
                            {subItem?.options?.map((option, index2) => {
                              return (
                                <option key={index2} value={option?.value}>
                                  {option?.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <h3 className=" font-semibold text-[18px] text-gray-800 my-2 ">
          Items
        </h3>
        <table className="table-auto">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-2 border-gray-400 border">Sl.</th>
              <th className="px-2 border-gray-400 border">Name</th>
              <th className="px-2 border-gray-400 border">SKU</th>
              <th className="px-2 border-gray-400 border">Quantity</th>
              <th className="px-2 border-gray-400 border">UOM</th>
              <th className="px-2 border-gray-400 border">Purchase Price</th>
              <th className="px-2 border-gray-400 border">Discount(%)</th>
              <th className="px-2 border-gray-400 border">Amount</th>
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
                    value={item.price}
                    required
                    onChange={(e) => {
                      const list = [...report];
                      list[index].price = e.target.value;
                      if (list[index].discountPercentage !== "") {
                        list[index].amount1 = (
                          list[index].price *
                          (1 -
                            parseFloat(list[index]?.discountPercentage) * 0.01)
                        ).toFixed(2);
                        const total1 = list?.reduce(
                          (total, item) => Number(total) + Number(item.amount1),
                          0
                        );
                        setPurchaseTotal(total1);
                      }
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="number"
                    value={item.discountPercentage}
                    onChange={(e) => {
                      const list = [...report];
                      list[index].discountPercentage = e.target.value;
                      list[index].amount1 = (
                        list[index].price *
                        (1 - parseFloat(list[index].discountPercentage) * 0.01)
                      ).toFixed(2);
                      const total1 = list?.reduce(
                        (total, item) => Number(total) + Number(item.amount1),
                        0
                      );
                      setPurchaseTotal(total1);
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="number"
                    disabled
                    value={item.amount1}
                    onChange={(e) => {
                      const list = [...report];
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className=" flex flex-col py-2">
          <div className=" w-full flex items-center py-1 justify-between border-b border-gray-300">
            <p className=" font-semibold">Total-</p>
            <p>{purchaseTotal}</p>
          </div>
          <div className=" w-full flex items-center py-1 justify-between">
            <p className=" font-semibold">Paid-</p>
            <div>
              <input
                type={"text"}
                name={"unpaidTotal"}
                id={"unpaidTotal"}
                placeholder={"0"}
                value={paidTotal}
                onChange={(e) => {
                  setPaidTotal(Number(e.target.value));
                  setUnpaidTotal(purchaseTotal - Number(e.target.value));
                }}
                className="  bg-white rounded-md py-2 px-4"
              />
            </div>
          </div>
          <div className=" w-full flex items-center py-1 justify-between border-b border-gray-300">
            <p className=" font-semibold">Total Unpaid-</p>
            <p>{unpaidTotal}</p>
          </div>
        </div>
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
            disabled={data.supplier === "" || report[0].name === ""}
            className=" w-fit mt-2 font-semibold text-xs md:text-sm bg-green-500 disabled:bg-gray-400 text-white p-2 md:p-2.5 rounded-lg"
          >
            {compType?.toLowerCase() === "edit"
              ? "Edit Invoice"
              : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSalesOrder;
