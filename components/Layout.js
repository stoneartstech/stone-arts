import React from 'react'
import Footer from './Footer'
import Header from './Header'

function Layout(props) {
    const { children } = props
    return (
        <div className=' flex flex-col min-h-screen relative bg-slate-200 justify-center'>
            <Header />
            <main className='flex flex-col p-4 '>
                {children}
            </main>
            <Footer />
        </div>

    )
}

export default Layout