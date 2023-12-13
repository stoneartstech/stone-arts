import React, { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function ClientHistory({ showroomName }) {
    const [clientRequests, setClientRequests] = useState([]);
    const [originalClientRequests, setOriginalClientRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetch = onSnapshot(collection(db, 'clients'), (snapshot) => {
            var clientRequests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            clientRequests = clientRequests.filter((clientRequest) => clientRequest.showroom === showroomName)
            clientRequests.forEach((clientRequest) => {
                clientRequest.aspects = clientRequest.aspects.join(',')
                clientRequest.date = clientRequest.date
            })
            console.log(clientRequests)

            setClientRequests(clientRequests)
            setOriginalClientRequests(clientRequests)
            setLoading(false)
        })

        return fetch
    }, [])

    const data = useMemo(() => clientRequests, [clientRequests]);

    const columns = useMemo(
        () => [
            { Header: 'Client ID', accessor: 'clientId', minSize: 50 },
            { Header: 'Client Name', accessor: 'name', minSize: 200 },
            { Header: 'Client Email', accessor: 'email', minSize: 200 },
            { Header: 'Client Number', accessor: 'number', minSize: 200 },
            { Header: 'Date of Request', accessor: 'date', minSize: 200 },
            { Header: 'Interested Aspects', accessor: "aspects", minSize: 200 },
            { Header: 'Request Category', accessor: 'option', minSize: 200 },
            { Header: 'Client Source', accessor: 'sourceInfo', minSize: 200 },
            { Header: '(Other Source)', accessor: 'specificInfo', minSize: 200 },
            { Header: 'Measurement Cost', accessor: 'measurementData.cost', minSize: 200 },
            { Header: 'Measurement Date', accessor: 'measurementData.date', minSize: 200 },
            { Header: 'Measurement Time', accessor: 'measurementData.time', minSize: 200 },
            { Header: 'Measurement Supply/Fix', accessor: 'measurementData.supplyFix', minSize: 200 },
            { Header: 'Measurement Contact Person', accessor: 'measurementData.contactPerson', minSize: 200 },
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

    function handleSearch() {
        setClientRequests(originalClientRequests.filter((clientRequest) => {
            var searchParam = search.toLowerCase()
            return (clientRequest.name.toLowerCase().includes(searchParam)
                || clientRequest.clientId.toString().includes(searchParam)
                || clientRequest.email.toLowerCase().includes(searchParam)
                || clientRequest.number.toString().includes(searchParam)
                || clientRequest.address.toLowerCase().includes(searchParam)
                || clientRequest.date.toString().toLowerCase().includes(searchParam)
                || clientRequest.aspects.toLowerCase().includes(searchParam)
                || clientRequest.option.toLowerCase().includes(searchParam)
                || clientRequest.sourceInfo.toLowerCase().includes(searchParam)
            )
        }
        ))
    }

    return (
        <>
            {!loading && (
                <div>
                    <p className='mt-8 text-2xl text-center font-bold mb-4'>
                        Requests from Clients
                    </p>
                    <div className='flex flex-col gap-4 '>
                        <div className='mx-auto'>
                            <input
                                onChange={(e) => setSearch(e.target.value)}
                                className='mx-auto border-2 border-black p-2'
                            />
                            <button
                                className='bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2'
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>

                        <div className='table-container overflow-x-auto'>
                            <table {...getTableProps()} className='border-collapse'>
                                <thead>
                                    {headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th
                                                    {...column.getHeaderProps()}
                                                    className='border'
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
                                            <tr {...row.getRowProps()} className='border'>
                                                {row.cells.map((cell) => (
                                                    <td {...cell.getCellProps()} className='p-6'>
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
