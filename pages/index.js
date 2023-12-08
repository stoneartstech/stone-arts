import Head from 'next/head'
import Login from '../components/Login'
import Layout from '@/components/Layout'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '@/components/AdminDashboard'
import ClientForm from './ClientForm.js'
import SalesDashboard from '@/components/SalesDashboard'

export default function Home() {
  const { currentUser } = useAuth()
  const salesMails = {
    'stoneartsgalleria@stonearts.com': "Galleria",
    'stoneartsmirage@stonearts.com': "Mirage",
    'stoneartskisumu@stonearts.com': "Kisumu",
    'stoneartsmombasaroad@stonearts.com': "Mombasa Road",
  }
  return (
    <>
      <Head>
        <title>Stone Arts App</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      {!currentUser && <Login />}
      {currentUser && currentUser.email === 'admin@stonearts.com' && <AdminDashboard />}
      {currentUser && salesMails[currentUser.email] &&
        <SalesDashboard showroomName={salesMails[currentUser.email]} />}
    </>
  )
}
