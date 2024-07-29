import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  disableNetwork,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
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
  const [isDialog, setIsDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [resolveDialog, setResolveDialog] = useState(null);
  const [dialogData, setDialogData] = useState("");
  const [newWarehouse, setNewWarehouse] = useState("");
  const [warehouseArr, setWarehouseArr] = useState([]);
  const [warehouse, setWarehouse] = useState("");
  const [combinedArr, setCombinedArr] = useState([]);
  const [newQty, setNewQty] = useState([]);
  const [exData, setExData] = useState([]);
  const [data, setData] = useState({
    number: "",
    tag: "",
    dateAndTime: currentDate.toUTCString(),
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

  const fetchData = async (warehouseList) => {
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
    console.log(allShowroomData);
    setCombinedArr(allShowroomData);
  };

  const fetchWarehouse = async () => {
    try {
      const warehouses = await getDoc(doc(db, `erpag`, "AllWarehouses"));
      if (warehouses.data()?.data) {
        const resArr = warehouses
          .data()
          ?.data?.sort((a, b) =>
            a?.name?.toLowerCase() > b?.name?.toLowerCase() ? 1 : -1
          );
        console.log(resArr);
        setWarehouseArr(resArr);
        fetchData(resArr);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);
  const [report, setReport] = useState([
    {
      SNo: 1,
      name: "",
      sku: "",
      quantity: "",
      UOM: "",
      stockPrice: "",
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
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      />
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
      {/* warehouse selection and addition ------------------------------------------------ */}
      <div className=" flex items-end gap-2">
        <div className=" flex flex-col">
          <label className=" text-sm font-semibold">Select Warehouse</label>
          <select
            type="text"
            placeholder="Warehouse Name"
            id="warehouse"
            name="warehouse"
            value={warehouse}
            onChange={(e) => {
              setWarehouse(e.target.value);
            }}
            className=" py-2 px-5  border border-black rounded-md "
          >
            <option value={""} className=" capitalize">
              Select Warehouse
            </option>
            {warehouseArr?.map((item, index) => {
              return (
                <option key={index} value={item?.name} className=" ">
                  {item?.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className=" flex items-end gap-2 ml-2">
          <div className=" flex flex-col">
            <label className=" text-sm font-semibold">Add New Warehouse</label>
            <input
              type="text"
              placeholder="Add New Warehouse"
              id="warehouse"
              value={newWarehouse}
              onChange={(e) => {
                setNewWarehouse(e.target.value);
              }}
              autoComplete="off"
              name="warehouse"
              className=" py-2 px-3  border border-black rounded-md "
            />
          </div>
          {uploading ? (
            <Image
              width={50}
              height={50}
              src="/loading.svg"
              alt="Loading ..."
            />
          ) : (
            <button
              onClick={async () => {
                try {
                  setUploading(true);
                  if (
                    warehouseArr?.find((e) => {
                      return (
                        e?.value ===
                        newWarehouse.toLowerCase().replace(/\s+/g, "")
                      );
                    })
                  ) {
                    enqueueSnackbar("Warehouse Already Exist !!", {
                      variant: "warning",
                    });
                    setUploading(false);
                    return;
                  } else {
                    const newArr = warehouseArr ? warehouseArr : [];
                    newArr.push({
                      name: newWarehouse,
                    });
                    await setDoc(
                      doc(db, `erpag/AllWarehouses`),
                      {
                        data: newArr,
                      },
                      { merge: true }
                    );
                    enqueueSnackbar("New Warehouse Added", {
                      variant: "success",
                    });
                    setNewWarehouse("");
                    fetchWarehouse();
                    setUploading(false);
                  }
                } catch (error) {
                  enqueueSnackbar("Some error occured", {
                    variant: "error",
                  });
                  console.error(error);
                  setUploading(false);
                }
              }}
              disabled={newWarehouse === ""}
              className=" disabled:bg-gray-400 disabled:text-gray-600 bg-blue-500 py-2 px-4 rounded-md text-white font-semibold"
            >
              Add
            </button>
          )}
        </div>
      </div>
      {isDialog && (
        <div className="w-full h-full fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white flex flex-col items-center justify-center w-[90%] md:w-[45%] h-fit md:max-h-[400px] min-h-[250px]">
            <div className="flex flex-col md:text-[17px]">
              <p>
                <b className="capitalize">{dialogData[0]?.name}</b> is already
                present in {warehouse}.
              </p>
              <p className="mb-6 text-center mt-1">
                Quantity : {dialogData[0]?.quantity} {dialogData[0]?.UOM}
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => {
                  setDoc(
                    doc(
                      db,
                      `erpag/inventory/${
                        warehouse ? warehouse : "mainwarehouse"
                      }`,
                      `${dialogData[0]?.name}`
                    ),
                    {
                      ...newQty[0],
                      quantity: Number(newQty[0]?.quantity),
                    }
                  );
                  setIsDialog(false);
                  if (resolveDialog) resolveDialog();
                }}
                className="py-2 px-4 rounded-full border border-green-400 text-sm bg-green-200 text-green-700 font-medium"
              >
                Make Total Quantity {newQty[0]?.quantity} {dialogData[0]?.UOM}
              </button>
              <button
                onClick={() => {
                  setDoc(
                    doc(
                      db,
                      `erpag/inventory/${
                        warehouse ? warehouse : "mainwarehouse"
                      }`,
                      `${dialogData[0]?.name}`
                    ),
                    {
                      ...newQty[0],
                      quantity:
                        Number(newQty[0]?.quantity) +
                        Number(dialogData[0]?.quantity),
                    }
                  );
                  setIsDialog(false);
                  if (resolveDialog) resolveDialog();
                }}
                className="py-2 px-4 rounded-full border border-blue-400 text-sm bg-blue-200 text-blue-700 font-medium"
              >
                Make Total Quantity {newQty[0]?.quantity}+
                {dialogData[0]?.quantity} {dialogData[0]?.UOM}
              </button>
            </div>
          </div>
        </div>
      )}
      {creating ? (
        <Image width={50} height={50} src="/loading.svg" alt="Loading ..." />
      ) : (
        <form
          onSubmit={async (e) => {
            // setCreating(true);
            e.preventDefault();
            try {
              console.log(combinedArr);
              for (const object of report) {
                const existingItem = combinedArr
                  ?.find((i) => i?.warehouseName === warehouse)
                  ?.data?.find((i) => i?.name === object?.name);
                console.log(existingItem);
                if (existingItem) {
                  setDialogData([existingItem]);
                  setNewQty([object]);
                  setIsDialog(true);

                  await new Promise((resolve) => {
                    setResolveDialog(() => resolve);
                  });
                } else {
                  await setDoc(
                    doc(
                      db,
                      `erpag/inventory/${
                        warehouse ? warehouse : "Main Warehouse"
                      }`,
                      object?.name
                    ),
                    object
                  );
                }
              }
              enqueueSnackbar("Inventory Updated Successfully", {
                variant: "success",
              });
              // setReport([
              //   {
              //     SNo: 1,
              //     name: "",
              //     sku: "",
              //     quantity: "",
              //     UOM: "",
              //     stockPrice: "",
              //     addInfo: "",
              //   },
              // ]);
              setCreating(false);
            } catch (error) {
              enqueueSnackbar("Some error occured", {
                variant: "error",
              });
              console.error(error);
              setUploading(false);
              setCreating(false);
            }
          }}
          className=" flex flex-col pb-10 bg-gray-200"
        >
          <h3 className=" font-semibold text-[18px] text-gray-800 mt-2 ">
            Items
          </h3>
          <table className=" custom-table">
            <thead className=" custom-table-head">
              <tr>
                <th className="custom-table-row">Sl.</th>
                <th className="custom-table-row">Name</th>
                <th className="custom-table-row">SKU</th>
                <th className="custom-table-row">Quantity</th>
                <th className="custom-table-row">UOM</th>
                <th className="custom-table-row">Stock Price</th>
                <th className="custom-table-row">Additional Info</th>
              </tr>
            </thead>
            <tbody className="">
              {report.map((item, index) => (
                <tr key={index}>
                  <td className="custom-table-data text-center p-1">
                    {index + 1}
                  </td>
                  <td className="custom-table-data">
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
                  <td className="custom-table-data">
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
                  <td className="custom-table-data">
                    <input
                      type="number"
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
                  <td className="custom-table-data">
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
                  <td className="custom-table-data">
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
                  <td className="custom-table-data">
                    <input
                      type="text"
                      value={item.addInfo}
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
                type="buttton"
                className="add-row-btn"
                onClick={handleAddRow}
              >
                + Add Row
              </button>
              <button
                type="button"
                className="delete-row-btn"
                onClick={handleRemoveRow}
              >
                Remove Row
              </button>
            </div>
            <button
              type="submit"
              disabled={report[0].name === "" || warehouse === ""}
              className=" w-fit mt-2 font-semibold text-xs md:text-sm bg-green-500 disabled:bg-gray-400 text-white p-2 md:p-2.5 rounded-lg"
            >
              Create Inventory
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Inventory;
