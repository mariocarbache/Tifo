'use client'

import { UserButton, useUser } from "@clerk/nextjs"

export default function DashboardPage(){

    const { user } = useUser();

    return(
        <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
                <h1>Dashboard</h1>
                <UserButton />
            </div>
            <p>Welcome, {user?.firstName ?? 'Tifoso'}.</p>
        </main>
    )
}