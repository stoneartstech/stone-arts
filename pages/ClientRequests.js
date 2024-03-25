import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import * as XLSX from 'xlsx';
import ClientHistory from '../components/ClientHistory';

export default function ClientRequests() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const searchParams = new URLSearchParams(window.location.search);
  const showroomName = searchParams.get('showroomName');
  const [deleteClient, setDeleteClient] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  const handleEditClient = (clientId) => {
    router.push(`/EditClient?clientId=${clientId}&showroomName=${showroomName}`);
  };

  return (
    <div>
      <div className='flex flex-col sm:flex-row items-center justify-center gap-12'>
        <p className='my-4 text-3xl text-center'>{showroomName} Showroom</p>
      </div>
      <ClientHistory
        showroomName={showroomName}
        onEditClient={handleEditClient}
      />
    </div>
  );
}
