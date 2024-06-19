import { useRouter } from "next/router";

export default function ViewOrder({ order, setViewOrder }) {
  const router = useRouter();
  console.log(order);

  return (
    <>
      <div>
        <div className="w-full pl-6 pr-12 flex justify-between">
          <button
            className="bg-slate-300 p-2 rounded-lg"
            onClick={() => setViewOrder(false)}
          >
            Go Back
          </button>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-3xl">Check Order</p>
          <div className="flex flex-col sm:flex-row md:p-8 gap-3 md:gap-16 w-full">
            <div className=" grid grid-cols-2 md:grid-cols-5  gap-3 items-center  w-full">
              <p className="mt-2 p-2 bg-white px-4">Date : {order?.date}</p>
              <p className="mt-2 p-2 bg-white px-4">
                Order ID : {order?.orderId}
              </p>
              <p className="mt-2 p-2 bg-white px-4">
                Client Code : {order?.clientCode}
              </p>
              <p className="mt-2 p-2 bg-white px-4">
                Invoice Number : {order?.invoiceNumber}
              </p>
              <p className="mt-2 p-2 bg-white px-4">
                Workshop : {order?.workshop}
              </p>
              <p className="mt-2 p-2 bg-white px-4">
                Location : {order?.location}
              </p>
              <p className="mt-2 p-2 bg-white px-4">
                Order Designation : {order?.orderDesignation}
              </p>
              <p className="mt-2 p-2 bg-white px-4">
                Order Type : {order?.orderType}
              </p>
              <p className="mt-2 p-2 bg-white px-4">
                Client Name : {order?.name}
              </p>
            </div>
          </div>
          <table className=" overflow-x-auto text-base md:text-base  w-full mt-2 table-auto">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-2 border-gray-400 border">Sl. No.</th>
                <th className="px-2 border-gray-400 border">Product Name</th>
                <th className="px-2 border-gray-400 border">
                  Product Description
                </th>
                <th className="px-2 border-gray-400 border">Size</th>
                <th className="px-2 border-gray-400 border">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {order?.order?.map((item, index) => (
                <tr key={index}>
                  <td className="bg-white border border-gray-400 text-center">
                    {index + 1}
                  </td>
                  <td className="bg-white border border-gray-400">
                    {item?.prodName}
                  </td>
                  <td className="bg-white border border-gray-400">
                    {item?.prodDesc}
                  </td>
                  <td className="bg-white border border-gray-400">
                    {item?.Size}
                  </td>
                  <td className="bg-white border border-gray-400">
                    {item?.Qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
