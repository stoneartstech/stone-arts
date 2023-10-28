import Head from 'next/head'
import Login from '../components/Login'
import Layout from '@/components/Layout'

export default function Home() {
  return (
    <>
      <Head>
        <title>Stone Arts App</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <Login />
    </>
  )
}
