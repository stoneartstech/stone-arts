import React from 'react'
import SalesDashboard from '../components/SalesDashboard'

export default function saleshome() {
    const salesMails = {
        'stoneartsgalleria@stonearts.com': "Galleria",
        'stoneartsmirage@stonearts.com': "Mirage",
        'stoneartskisumu@stonearts.com': "Kisumu",
        'stoneartsmombasaroad@stonearts.com': "Mombasa Road",
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
