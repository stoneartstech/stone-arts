import React, { useState, useEffect, useMemo } from 'react';
import { useTable } from 'react-table';
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import * as XLSX from 'xlsx';

export default function ClientHistory({ showroomName }) {
    const showroomDbNames = {
        "Galleria": "clients",
        "Mirage": "mirage-clients",
        "Kisumu": "kisumu-clients",
        "Mombasa Road": "mombasa-clients",
    }
    console.log(showroomName)
    const showroomDbName = showroomDbNames[showroomName]
    const [clientRequests, setClientRequests] = useState([]);
    const [originalClientRequests, setOriginalClientRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [deleteClient, setDeleteClient] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetch = onSnapshot(collection(db, showroomDbName), (snapshot) => {
            var requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            requests.forEach((clientRequest) => {
                if (clientRequest.aspects) clientRequest.aspects = clientRequest.aspects.join(',')
                clientRequest.date = clientRequest.date
            })
            requests.sort((a, b) => b.clientId - a.clientId);
            setClientRequests(requests)
            setOriginalClientRequests(requests)
            setLoading(false)
        })

        return fetch
    }, [])

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
                || clientRequest.clientCode.toString().includes(searchParam)
                || clientRequest.clientId.toString().includes(searchParam)
                || clientRequest.email.toLowerCase().includes(searchParam)
                || clientRequest.number.toString().includes(searchParam)
                || clientRequest.address.toLowerCase().includes(searchParam)
                || clientRequest.aspects.toLowerCase().includes(searchParam)
                || clientRequest.option.toLowerCase().includes(searchParam)
                || clientRequest.sourceInfo.toLowerCase().includes(searchParam)
            )
        }
        ))
    }

    function parseDateString(dateString) {
        const [day, month, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    function parseDate(dateString) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    function handleDateSearch() {
        //make sure end date is greater than start date
        if (startDate && endDate) {
            if (parseDate(startDate) > parseDate(endDate)) {
                alert('End date should be greater than start date');
                return;
            }
        }
        setClientRequests(originalClientRequests.filter((clientRequest) => {
            const requestDate = parseDateString(clientRequest.date);
            console.log(requestDate)
            console.log(parseDateString(startDate))
            return ((requestDate >= parseDate(startDate) || !startDate) &&
                (requestDate <= new parseDate(endDate) || !endDate))
        }
        ))
    }

    async function handleDelete() {
        //delete client with clientId as deleteClient
        if (deleteClient === '') {
            alert('Please enter a client id')
            return
        }
        const clientsRef = collection(db, showroomDbName);
        try {
            // Attempt to delete the client with the specified ID
            await deleteDoc(doc(clientsRef, deleteClient));
            alert('Client id successfully deleted!');
        } catch (error) {
            alert('Error deleting client ', error);
        }

    }

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }

    function handleExportToExcel() {
        const sheetData = clientRequests.map((clientRequest) => {
            // Map the data to match your Excel columns
            return {
                'Id': clientRequest.clientId,
                'Client Code': clientRequest.clientCode,
                'First Name': clientRequest.name,
                'Last Name': clientRequest.lastname,
                'Client Email': clientRequest.email,
                'Client Number': clientRequest.number,
                'Client Address': clientRequest.address,
                'Date of Request': clientRequest.date,
                'Sales Person': clientRequest.salesPerson,
                'Interested Aspects': clientRequest.aspects,
                'Request Category': clientRequest.option,
                'Client Source': clientRequest.sourceInfo,
                '(Other Source)': clientRequest.specificInfo,
                'Measurement Cost': clientRequest.measurementData?.cost,
                'Measurement Date': clientRequest.measurementData?.date,
                'Measurement Time': clientRequest.measurementData?.time,
                'Measurement Supply/Fix': clientRequest.measurementData?.supplyFix,
                'Measurement Contact Person': clientRequest.measurementData?.contactPerson,
            };
        });

        const ws = XLSX.utils.json_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ClientRequests');

        // Generate a binary Excel file
        const binaryData = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        // Convert the binary data to a Blob
        const blob = new Blob([s2ab(binaryData)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Save the Blob as an Excel file
        const fileName = `ClientRequests_${showroomName}.xlsx`;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    // Convert string to ArrayBuffer
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    return (
        <>
            {!loading && (
                <div>
                    <div className='w-full pl-8'>
                        <button className='bg-slate-300 p-2 rounded-lg'
                            onClick={() => router.back()}>
                            Go Back
                        </button>
                    </div>
                    {/* <div className='flex flex-col'>
                        <p className='mt-8 text-2xl text-center font-bold mb-4'>
                            Delete A Client
                        </p>
                        <div className='mx-auto'>
                            <input
                                onChange={(e) => setDeleteClient(e.target.value)}
                                className='mx-auto border-2 border-black p-2'
                                placeholder='Enter Client Id(Not Code)'
                            />
                            <button
                                className='bg-red-500 hover:bg-red-600 p-3 rounded-lg mx-2'
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div> */}
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
                            <div className='bg-slate-300'>
                                {search && originalClientRequests
                                    .filter((clientRequest) => {
                                        var searchParam = search.toLowerCase()
                                        return (
                                            clientRequest.name.toLowerCase().includes(searchParam) ||
                                            clientRequest.clientCode.toString().includes(searchParam)
                                        )
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
                        <p className='mt-8 text-2xl text-center font-bold'>
                            Search in date range
                        </p>
                        <div className='mx-auto flex gap-4'>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className='border-2 border-black p-2'
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className='border-2 border-black p-2'
                            />
                            <button
                                className='bg-slate-300 hover:bg-slate-400 p-3 rounded-lg mx-2'
                                onClick={handleDateSearch}
                            >
                                Search
                            </button>
                        </div>
                        <div className='mx-auto'>
                            <button className='bg-slate-300 p-2' onClick={handleExportToExcel}>
                                Export to Excel
                            </button>
                        </div>

                        <div className='table-container overflow-x-auto'>
                            <table {...getTableProps()} className='border-collapse'>
                                <thead>
                                    {headerGroups.map((headerGroup) => (
                                        <tr key={headerGroup.id}
                                            {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th key={column.id}
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
                                                    <td key={cell.id} {...cell.getCellProps()}
                                                        className='p-6 border-black border'>
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

                </div >
            )
            }
        </>
    );
}
