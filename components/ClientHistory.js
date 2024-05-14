import React, { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useRouter } from 'next/router';
import * as XLSX from 'xlsx';

export default function ClientHistory({ showroomName, onEditClient }) {
  const showroomDbNames = {
    "Galleria": "clients",
    "Mirage": "mirage-clients",
    "Kisumu": "kisumu-clients",
    "Mombasa Road": "mombasa-clients",
  };

  const showroomDbName = showroomDbNames[showroomName];
  const [clientRequests, setClientRequests] = useState([]);
  const [originalClientRequests, setOriginalClientRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetch = onSnapshot(collection(db, showroomDbName), (snapshot) => {
      var requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      requests.forEach((clientRequest) => {
        if (clientRequest.aspects) clientRequest.aspects = clientRequest.aspects.join(',');
        clientRequest.date = clientRequest.date;
      });
      requests.sort((a, b) => b.clientId - a.clientId);
      setClientRequests(requests);
      setOriginalClientRequests(requests);
      setLoading(false);
    });

    return fetch;
  }, []);

  const data = useMemo(() => clientRequests, [clientRequests]);

  const columns = useMemo(
    () => [
      { Header: 'Id', accessor: 'clientId', minSize: 50 },
      { Header: 'Client Code', accessor: 'clientCode', minSize: 50 },
      { Header: 'First Name', accessor: 'name', minSize: 200 },
      { Header: 'Last Name', accessor: 'lastname', minSize: 200 },
      { Header: 'Client Email', accessor: 'email', minSize: 200 },
      { Header: 'Client Number', accessor: 'number', minSize: 200 },
      { Header: 'Client Address', accessor: 'address', minSize: 200 },
      { Header: 'Date of Request', accessor: 'date', minSize: 200 },
      { Header: 'Sales Person', accessor: 'salesPerson', minSize: 200 },
      { Header: 'Interested Aspects', accessor: 'aspects', minSize: 200 },
      { Header: 'Request Category', accessor: 'option', minSize: 200 },
      { Header: 'Client Source', accessor: 'sourceInfo', minSize: 200 },
      { Header: '(Other Source)', accessor: 'specificInfo', minSize: 200 },
      { Header: 'Measurement Cost', accessor: 'measurementData.cost', minSize: 200 },
      { Header: 'Measurement Date', accessor: 'measurementData.date', minSize: 200 },
      { Header: 'Measurement Time', accessor: 'measurementData.time', minSize: 200 },
      { Header: 'Measurement Supply/Fix', accessor: 'measurementData.supplyFix', minSize: 200 },
      { Header: 'Measurement Contact Person', accessor: 'measurementData.contactPerson', minSize: 200 },
      {
        Header: 'Edit', accessor: 'id',
        Cell: ({ row }) => (
          <button onClick={() => handleEditClient(row.original.id)} className='hover:underline'>Edit</button>
        )
      },
      {
        Header: 'Delete', accessor: 'delete',
        Cell: ({ row }) => (
          <button onClick={() => handleDeleteClient(row.original.id)} className='hover:underline text-red-500'>Delete</button>
        )
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  function handleEditClient(clientId) {
    onEditClient(clientId);
  }

  async function handleDeleteClient(clientId) {
    if (confirm('Are you sure you want to delete this client request?')) {
      await deleteDoc(doc(db, showroomDbName, clientId));
    }
  }

  function handleSearch() {
    setClientRequests(originalClientRequests.filter((clientRequest) => {
      var searchParam = search.toLowerCase();
      return (
        (clientRequest.name && clientRequest.name.toLowerCase().includes(searchParam)) ||
        (clientRequest.clientCode && clientRequest.clientCode.toString().includes(searchParam)) ||
        (clientRequest.clientId && clientRequest.clientId.toString().includes(searchParam)) ||
        (clientRequest.email && clientRequest.email.toLowerCase().includes(searchParam)) ||
        (clientRequest.number && clientRequest.number.toString().includes(searchParam)) ||
        (clientRequest.address && clientRequest.address.toLowerCase().includes(searchParam)) ||
        (clientRequest.aspects && clientRequest.aspects.toLowerCase().includes(searchParam)) ||
        (clientRequest.option && clientRequest.option.toLowerCase().includes(searchParam)) ||
        (clientRequest.sourceInfo && clientRequest.sourceInfo.toLowerCase().includes(searchParam))
      );
    }));
  }

  return (
    <>
      {!loading && (
        <div>
          <div className='w-full pl-8'>
            <button className='bg-slate-300 p-2 rounded-lg' onClick={() => router.back()}>
              Go Back
            </button>
          </div>
          <p className='mt-8 text-2xl text-center font-bold mb-4'>Requests from Clients</p>
          <div className='flex flex-col gap-4 '>
            <div className='mx-auto'>
              <input
                onChange={(e) => setSearch(e.target.value)}
                className='mx-auto
                border-2 border-black p-2'
              />
              <button
                className='bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2'
                onClick={handleSearch}
              >
                Search
              </button>
              <div className='bg-slate-300'>
                {search && originalClientRequests
                  .filter((clientRequest) => {
                    var searchParam = search.toLowerCase();
                    return (
                      clientRequest.name.toLowerCase().includes(searchParam) ||
                      clientRequest.clientCode.toString().includes(searchParam)
                    );
                  })
                  .slice(0, 10)
                  .map((clientRequest) => (
                    <p
                      key={clientRequest.clientId}
                      onClick={() => {
                        setSearch(clientRequest.name);
                        handleSearch();
                      }}
                      className='p-2 text-black cursor-pointer'
                    >
                      {clientRequest.clientCode} : {clientRequest.name}
                    </p>
                  ))}
              </div>
            </div>
            <div className='table-container overflow-x-auto'>
              <table {...getTableProps()} className='border-collapse'>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          key={column.id}
                          {...column.getHeaderProps()}
                          className='border-black border'
                          style={{ minWidth: column.minSize }}
                        >
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr key={row.id} {...row.getRowProps()} className='border'>
                        {row.cells.map((cell) => (
                          <td key={cell.id} {...cell.getCellProps()} className='p-6 border-black border'>
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

