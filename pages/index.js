import Head from 'next/head'
import Login from '../components/Login'
import Layout from '@/components/Layout'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '@/components/AdminDashboard'
import ClientForm from './ClientForm.js'
import SalesDashboard from '@/components/SalesDashboard'
import DesignHead from 'pages/DesignHead.js'
import DesignerDashboard from 'pages/DesignerDashboard.js'

export default function Home() {
  const { currentUser } = useAuth()
  const salesMails = {
    'stoneartsgalleria@stonearts.com': "Galleria",
    'stoneartsmirage@stonearts.com': "Mirage",
    'stoneartskisumu@stonearts.com': "Kisumu",
    'stoneartsmombasaroad@stonearts.com': "Mombasa Road",
  }
  const designMails = {
    'designer1@stonearts.com': '1',
    'designer2@stonearts.com': '2',
    'designer3@stonearts.com': '3',
  }
  return (
    <>
      <Head>
        <title>Stone Arts App</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      {!currentUser && <Login />}

      {/* ADMIN */}
      {currentUser && currentUser.email === 'admin@stonearts.com' && <AdminDashboard />}

      {/* SALES */}
      {currentUser && salesMails[currentUser.email] &&
        <SalesDashboard showroomName={salesMails[currentUser.email]} />}

      {/* DESIGN */}
      {currentUser && currentUser.email === 'designhead@stonearts.com' && <DesignHead />}
      {currentUser && designMails[currentUser.email] &&
        <DesignerDashboard designerId={designMails[currentUser.email]} />}

    </>
  )
}
