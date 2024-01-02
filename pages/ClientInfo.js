import React from 'react'

function ClientInfo() {
    const searchParams = useSearchParams()
    const showroomName = searchParams.get('showroomName')
    return (
        <div>ClientInfo</div>
    )
}

export default ClientInfo