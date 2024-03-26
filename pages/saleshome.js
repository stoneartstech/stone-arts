import React from 'react'
import SalesDashboard from '../components/SalesDashboard'
import { useAuth } from '../context/AuthContext'

export default function saleshome() {
    const salesMails = {
        'stoneartsgalleria@stonearts.com': "Galleria",
        'stoneartsmirage@stonearts.com': "Mirage",
        'stoneartskisumu@stonearts.com': "Kisumu",
        'stoneartsmombasaroad@stonearts.com': "Mombasa Road",
    }

    const { currentUser } = useAuth();

    if (!currentUser || currentUser.email !== 'admin@stonearts.com') {
        return <div>
            <div className='w-full mb-8 flex justify-start items-start'>
                <button className='bg-slate-300 p-2 rounded-lg' onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
            Only Admin can access this page.
        </div>;
    }

    return (
        <div>
            <p className='text-4xl mb-6 text-center'>All Sales Teams</p>
            <div className='flex flex-col gap-24 sm:gap-4'>
                {Object.keys(salesMails).map((mail) => (
                    <SalesDashboard key={mail} showroomName={salesMails[mail]} />
                ))}
            </div>

        </div>
    )
}
