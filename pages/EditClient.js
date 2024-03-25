import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditClient() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [error, setError] = useState("");
  const clientId = router.query.clientId;
  const fetchedClientRef = useRef(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId || !currentUser) {
        return;
      }

      try {
        const clientDoc = await getDoc(doc(db, "clients", clientId));
        if (clientDoc.exists()) {
          fetchedClientRef.current = clientDoc.data();
          setClient(fetchedClientRef.current); 
          setLoading(false);
        } else {
          setError("Client not found");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching client:", error);
        setError("Error fetching client");
        setLoading(false);
      }
    };

    fetchClient();

    
  }, [clientId, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient({
      ...client,
      [name]: value,
    });
  };

  const handleUpdateClient = async () => {
    try {
      await updateDoc(doc(db, "clients", clientId), client);
      setNotification("Client updated successfully"); 
      setTimeout(() => {
       
        setNotification("");
      }, 3000);
      router.push(`/clientrequests?showroomName=${client.showroomName}`);
    } catch (error) {
      console.error("Error updating client:", error);
      setError("Error updating client");
    }
  };

  if (!currentUser) {
    router.push("/login");
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!client) {
    return <div>Client not found.</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Client</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={client.name || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="lastname"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={client.lastname || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Client Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={client.email || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="number"
            className="block text-sm font-medium text-gray-700"
          >
            Client Number
          </label>
          <input
            type="tel"
            id="number"
            name="number"
            value={client.number || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Client Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={client.address || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Request
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={client.date || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="salesPerson"
            className="block text-sm font-medium text-gray-700"
          >
            Sales Person
          </label>
          <input
            type="text"
            id="salesPerson"
            name="salesPerson"
            value={client.salesPerson || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="aspects"
            className="block text-sm font-medium text-gray-700"
          >
            Interested Aspects
          </label>
          <input
            type="text"
            id="aspects"
            name="aspects"
            value={client.aspects || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="option"
            className="block text-sm font-medium text-gray-700"
          >
            Request Category
          </label>
          <input
            type="text"
            id="option"
            name="option"
            value={client.option || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="sourceInfo"
            className="block text-sm font-medium text-gray-700"
          >
            Client Source
          </label>
          <input
            type="text"
            id="sourceInfo"
            name="sourceInfo"
            value={client.sourceInfo || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="specificInfo"
            className="block text-sm font-medium text-gray-700"
          >
            (Other Source)
          </label>
          <input
            type="text"
            id="specificInfo"
            name="specificInfo"
            value={client.specificInfo || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="measurementData.cost"
            className="block text-sm font-medium text-gray-700"
          >
            Measurement Cost
          </label>
          <input
            type="text"
            id="measurementData.cost"
            name="measurementData.cost"
            value={client.measurementData?.cost || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="measurementData.date"
            className="block text-sm font-medium text-gray-700"
          >
            Measurement Date
          </label>
          <input
            type="date"
            id="measurementData.date"
            name="measurementData.date"
            value={client.measurementData?.date || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="measurementData.time"
            className="block text-sm font-medium text-gray-700"
          >
            Measurement Time
          </label>
          <input
            type="text"
            id="measurementData.time"
            name="measurementData.time"
            value={client.measurementData?.time || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="measurementData.supplyFix"
            className="block text-sm font-medium text-gray-700"
          >
            Measurement Supply/Fix
          </label>
          <input
            type="text"
            id="measurementData.supplyFix"
            name="measurementData.supplyFix"
            value={client.measurementData?.supplyFix || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="measurementData.contactPerson"
            className="block text-sm font-medium text-gray-700"
          >
            Measurement Contact Person
          </label>
          <input
            type="text"
            id="measurementData.contactPerson"
            name="measurementData.contactPerson"
            value={client.measurementData?.contactPerson || ""}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <button
          type="button"
          onClick={handleUpdateClient}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Update Client
        </button>
      </form>
      {notification && ( 
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
           {notification}
        </div>
      )}
    </div>
  );
}
