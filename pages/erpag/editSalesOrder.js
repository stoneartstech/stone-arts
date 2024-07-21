import { db } from "@/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import React, { useEffect, useState } from "react";

const EditSalesOrder = ({ compType, handEditSalesOrder, selectedOrder }) => {
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
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [warehouseArr, setWarehouseArr] = useState([]);
  const [data, setData] = useState({
    number: "",
    tag: "",
    dateAndTime: "",
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
          placeholder: "eg-SD-00021",
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
          name: "Warehouse (Products)",
          value: warehouse,
          valueTag: "warehouse",
          options: [
            { name: "Select Warehouse", value: "" },
            ...allProducts?.map((item, index) => ({
              name: `${item?.warehouseName} (${item?.data?.length})`,
              value: item?.warehouseName,
            })),
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
            { name: "Select Priority", value: "" },
            { name: "Normal", value: "normal" },
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
            { name: "Select Customer", value: "" },
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
            { name: "Select Key", value: "" },
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
            { name: "Select Location", value: "" },
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
            { name: "Select Price Tier", value: "" },
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
          valueTag: "termsOfPayment",
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
          field: "select",
          type: "text",
          name: "Billing Address",
          value: billingAddress,
          valueTag: "billingAddress",
          options: [
            { name: "Select Address", value: "" },
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
  useEffect(() => {
    setReport(selectedOrder?.data);
    setData(selectedOrder?.details);
  }, []);

  const fetchData = async (warehouseList) => {
    setLoading(true);
    const allShowroomData = [];
    for (const showroom of warehouseList) {
      const querySnapshot = await getDocs(
        collection(db, `erpag/inventory`, showroom?.name)
      );
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      allShowroomData.push({
        warehouseName: showroom?.name,
        data: requests,
      });
    }
    // console.log(allShowroomData.flatMap((item) => item?.data));
    setAllProducts(allShowroomData);
    setLoading(false);
  };

  const fetchWarehouse = async () => {
    try {
      const warehouses = await getDoc(doc(db, `erpag`, "AllWarehouses"));
      if (warehouses.data()?.data) {
        setWarehouseArr(warehouses.data()?.data);
        const resArr = warehouses
          .data()
          ?.data?.sort((a, b) =>
            a?.name?.toLowerCase() > b?.name?.toLowerCase() ? 1 : -1
          );
        console.log(resArr);
        fetchData(resArr);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchWarehouse();
  }, []);

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
    const docRef = doc(db, `erpag/inventory/${warehouse}`, productName);
    const docSnap = (await getDoc(docRef)).data();
    // console.log(docSnap);
    if (
      Number(docSnap?.quantity) > 0 &&
      Number(docSnap?.quantity) < Number(prodQuantity)
    ) {
      // alert(      );
      enqueueSnackbar(
        `only ${docSnap?.quantity} ${docSnap?.UOM} ${productName} Avaialable`,
        {
          variant: "warning",
        }
      );
      setIsOkay(false);
    } else if (Number(docSnap?.quantity) > 0) {
      const newData = {
        ...docSnap,
        quantity: Number(docSnap?.quantity) - prodQuantity,
      };
      if (docSnap) {
        setDoc(doc(db, `erpag/inventory/${warehouse}`, productName), newData);
        setIsOkay(true);
      }
    } else {
      enqueueSnackbar(`${productName} Not Avaialable`, {
        variant: "warning",
      });
      setIsOkay(false);
    }
    // console.log(newData);
  };
  return (
    <div className=" w-full h-full pb-10 bg-gray-200 ">
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
      <h1 className=" font-semibold capitalize text-[27px] text-center text-gray-800 my-2 ">
        {compType} Sales Order
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            report.forEach((object) => {
              //   // console.log(object.name?.toLowerCase()?.replace(/\s+/g, "-"));
              updateData(object?.name, object?.quantity);
            });
            if (isOkay) {
              setDoc(
                doc(
                  db,
                  "erpag/reports/salesOrder",
                  `Order-${selectedOrder?.date}-${selectedOrder?.time}`
                ),
                {
                  details: data,
                  data: report,
                  date: selectedOrder?.date,
                  time: selectedOrder?.time,
                }
              );
              // console.log(getDoc(db,`erpag/Inventory/mainWarehouse/${report[0].name}`))
              if (compType?.toLowerCase() === "edit") {
                enqueueSnackbar("Invoice Edited Successfully", {
                  variant: "success",
                });
              } else {
                enqueueSnackbar("Invoice Created Successfully", {
                  variant: "success",
                });
              }
              setTimeout(() => {
                router.push("/erpag/Erpag");
              }, 3500);
            }
          } catch (error) {
            enqueueSnackbar("Some error occured", {
              variant: "error",
            });
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
                            required
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
                                <option
                                  className=" capitalize"
                                  key={index2}
                                  value={option?.value}
                                >
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
              <th className="px-2 border-gray-400 border">Amount1</th>
              <th className="px-2 border-gray-400 border">Tax(%)</th>
              <th className="px-2 border-gray-400 border">Amount2</th>
            </tr>
          </thead>
          <tbody className="">
            {report.map((item, index) => (
              <tr key={index}>
                <td className="bg-white border border-gray-400 text-center p-1">
                  {index + 1}
                </td>
                <td className="bg-white border border-gray-400">
                  {allProducts.find(
                    (prod) => prod.warehouseName === String(warehouse)
                  )?.data?.length <= 0 ? (
                    <p className=" text-xs">Empty Warehouse</p>
                  ) : (
                    <select
                      type="text"
                      placeholder="Warehouse Name"
                      id="warehouse"
                      name="warehouse"
                      value={item.name}
                      onChange={(e) => {
                        const list = [...report];
                        list[index].name = e.target.value;
                        let selItem = allProducts
                          ?.find(
                            (item) => item?.warehouseName === String(warehouse)
                          )
                          ?.data?.find(
                            (item2) => item2?.name === String(e.target.value)
                          );
                        list[index].UOM = selItem?.UOM;
                        list[index].sku = selItem?.sku;
                        // console.log(selItem);
                        setReport(list);
                      }}
                      className=" w-full px-2 border-none outline-none"
                    >
                      <option value={""} className=" capitalize">
                        Select Product
                      </option>
                      {allProducts
                        .find(
                          (prod) => prod.warehouseName === String(warehouse)
                        )
                        ?.data?.map((subItem, index2) => {
                          return (
                            <option
                              key={index2}
                              value={subItem?.name}
                              className=" text-black "
                            >
                              {subItem?.name}
                            </option>
                          );
                        })}
                    </select>
                  )}
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    required
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
                    required
                    type="text"
                    value={item.quantity}
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
                    required
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
                    required
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const list = [...report];
                      list[index].price = e.target.value;
                      if (list[index].discountPercentage !== "") {
                        list[index].amount1 = (
                          list[index].price *
                          (1 -
                            parseFloat(list[index]?.discountPercentage) * 0.01)
                        ).toFixed(2);
                      }
                      if (list[index].taxPercentage !== "") {
                        list[index].amount2 = (
                          list[index].amount1 *
                          (1 - parseFloat(list[index]?.taxPercentage) * 0.01)
                        ).toFixed(2);
                      }
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    required
                    type="number"
                    value={item.discountPercentage}
                    onChange={(e) => {
                      const list = [...report];
                      list[index].discountPercentage = e.target.value;
                      list[index].amount1 = (
                        list[index].price *
                        (1 - parseFloat(list[index].discountPercentage) * 0.01)
                      ).toFixed(2);
                      if (list[index].taxPercentage !== "") {
                        list[index].amount2 = (
                          list[index].amount1 *
                          (1 - parseFloat(list[index]?.taxPercentage) * 0.01)
                        ).toFixed(2);
                      }
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    required
                    type="number"
                    value={item.amount1}
                    readOnly
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
                    required
                    type="number"
                    value={item.taxPercentage}
                    onChange={(e) => {
                      const list = [...report];
                      list[index].taxPercentage = e.target.value;
                      list[index].amount2 = (
                        list[index].amount1 *
                        (1 - parseFloat(list[index].taxPercentage) * 0.01)
                      ).toFixed(2);
                      setReport(list);
                    }}
                    className="w-full px-2 border-none outline-none"
                  />
                </td>
                <td className="bg-white border border-gray-400">
                  <input
                    required
                    type="number"
                    value={item.amount2}
                    readOnly
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
              type="button"
              className="bg-slate-400 w-fit mt-2 font-semibold text-xs md:text-sm hover:bg-green-500 p-2 md:p-2.5 rounded-lg"
              onClick={handleAddRow}
            >
              + Add Row
            </button>
            <button
              type="button"
              className="bg-slate-400 w-fit mt-2 ml-2 font-semibold text-xs md:text-sm hover:bg-red-500 p-2 md:p-2.5 rounded-lg"
              onClick={handleRemoveRow}
            >
              Remove Row
            </button>
          </div>
          <button
            type="submit"
            disabled={
              data.customer === "" ||
              data.taxLocation === "" ||
              data.warehouse === "" ||
              data.termsOfPayment === "" ||
              data.priceTier === "" ||
              data.billingAddress === "" ||
              report[0].name === ""
            }
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

export default EditSalesOrder;
