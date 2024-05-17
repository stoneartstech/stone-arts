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
  const [data, setData] = useState({
    number: "",
    tag: "",
    dateAndTime: date,
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
  const {
    number,
    tag,
    dateAndTime,
    warehouse,
    deadline,
    price,
    priority,
    type,
    customer,
    key,
    taxLocation,
    priceTier,
    termsOfPayment,
    totalAmount,
    billingAddress,
  } = data;
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
          type: "date",
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
          type: "date",
          name: "Deadline",
          value: deadline,
          valueTag: "deadline",
        },
        {
          field: "select",
          type: "text",
          name: "Priority",
          value: priority,
          valueTag: "priority",
          options: [
            { name: "Normal ", value: "normal" },
            { name: "Medium", value: "medium" },
            { name: "High", value: "high" },
            { name: "Urgent", value: "urgent" },
          ],
        },
        {
          field: "input",
          type: "type",
          placeholder: "",
          name: "Type",
          value: type,
          valueTag: "type",
        },
      ],
    },
    {
      name: "Document Header",
      form: [
        {
          field: "select",
          type: "text",
          name: "Customer",
          value: customer,
          valueTag: "customer",
          options: [
            { name: "seelct Customer", value: "" },
            { name: "customer 1", value: "customer-1" },
            { name: "customer 2", value: "customer-2" },
            { name: "customer 3", value: "customer-3" },
          ],
        },
        {
          field: "select",
          type: "text",
          name: "Key",
          value: key,
          valueTag: "key",
          options: [
            { name: "key 1", value: "key-1" },
            { name: "key 2", value: "key-2" },
            { name: "key 3", value: "key-3" },
          ],
        },
        {
          field: "select",
          type: "text",
          name: "Tax Location",
          value: taxLocation,
          valueTag: "taxLocation",
          options: [
            { name: "location 1", value: "location-1" },
            { name: "location 2", value: "location-2" },
            { name: "location 3", value: "location-3" },
          ],
        },
        {
          field: "select",
          type: "text",
          name: "Price Tier",
          value: priceTier,
          valueTag: "priceTier",
          options: [
            { name: "price-Tier 1", value: "price-Tier-1" },
            { name: "price-Tier 2", value: "price-Tier-2" },
            { name: "price-Tier 3", value: "price-Tier-3" },
          ],
        },
        {
          field: "select",
          type: "text",
          name: "Terms Of Payment",
          value: termsOfPayment,
          valueTag: "termsOfpayment",
          options: [
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
          field: "select",
          type: "text",
          name: "Billing Address",
          value: billingAddress,
          valueTag: "billingAddress",
          options: [
            { name: "address 1", value: "address-1" },
            { name: "address 2", value: "address-2" },
            { name: "address 3", value: "address-3" },
          ],
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
      taxPercentage: "",
      amount2: "",
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
      taxPercentage: "",
      amount2: "",
    };
    setReport([...report, row]);
  };
  const handleRemoveRow = (index) => {
    const list = [...report];
    list.splice(-1);
    setReport(list);
  };
  const [isOkay, setIsOkay] = useState(false);
  const updateData = async (productName, prodQuantity) => {
    const docRef = doc(db, "erpag/Inventory/mainWarehouse", productName);
    const docSnap = (await getDoc(docRef)).data();
    // console.log(docSnap);
    if (
      Number(docSnap?.quantity) > 0 &&
      Number(docSnap?.quantity) < Number(prodQuantity)
    ) {
      alert(
        `only ${docSnap?.quantity} ${docSnap?.UOM} ${productName} Avaialable`
      );
      setIsOkay(false);
    } else if (Number(docSnap?.quantity) > 0) {
      const newData = {
        ...docSnap,
        quantity: Number(docSnap?.quantity) - prodQuantity,
      };
      if (docSnap) {
        setDoc(doc(db, `erpag/Inventory/mainWarehouse`, productName), newData);
        setIsOkay(true);
      }
    } else {
      alert(`${productName} Not Avaialable`);
      setIsOkay(false);
    }
    // console.log(newData);
  };
  return (
    <div className=" w-full h-full pb-10 bg-gray-200 ">
      <h1 className=" font-semibold capitalize text-[27px] text-center text-gray-800 my-2 ">
        {compType} Sales Order
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            report.forEach((object) => {
              // console.log(object.name?.toLowerCase()?.replace(/\s+/g, "-"));
              updateData(
                object?.name?.toLowerCase()?.replace(/\s+/g, "-"),
                object?.quantity
              );
            });
            // alert(isOkay);
            if (isOkay) {
              setDoc(
                doc(db, "erpag/reports/salesOrder", `Order-${date}-${time}`),
                {
                  details: data,
                  data: report,
                  date,
                  time,
                }
              );
              // console.log(getDoc(db,`erpag/Inventory/mainWarehouse/${report[0].name}`))
              if (compType?.toLowerCase() === "edit") {
                alert("Invoice Edited Successfully");
              } else {
                alert("Invoice Created Successfully");
              }
              router.push("/erpag/Erpag");
            }
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
              <th className="px-2 border-gray-400 border">Price</th>
              <th className="px-2 border-gray-400 border">Discount(%)</th>
              <th className="px-2 border-gray-400 border">Amount</th>
              <th className="px-2 border-gray-400 border">Tax(%)</th>
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
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="number"
                    value={item.amount1}
                    onChange={(e) => {
                      const list = [...report];
                      list[index].amount1 = e.target.value;
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="number"
                    value={item.taxPercentage}
                    onChange={(e) => {
                      const list = [...report];
                      list[index].taxPercentage = e.target.value;
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    type="number"
                    value={item.amount2}
                    onChange={(e) => {
                      const list = [...report];
                      list[index].amount2 = e.target.value;
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
            disabled={data.customer === "" || report[0].name === ""}
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
