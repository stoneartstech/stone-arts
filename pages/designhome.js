import React from 'react'
import DesignHead from '../components/DesignHead'

export default function designhome() {
    const salesMails = {
        'stoneartsgalleria@stonearts.com': "Galleria",
        'stoneartsmirage@stonearts.com': "Mirage",
        'stoneartskisumu@stonearts.com': "Kisumu",
        'stoneartsmombasaroad@stonearts.com': "Mombasa Road",
    }
    return (
        <div>
            {/* <p className='text-4xl mb-6 text-center'>All Sales Teams</p> */}
            <div className='flex flex-col'>
                <DesignHead />
            </div>

        </div>
    )
}