import React from 'react';
import { NavLink, Outlet } from "react-router-dom";
import Breadcrumbs from '../components/Breadcrumbs';

const RootLayout = () => {
    return (
        <>
        <div>
            <header>
                <nav>
                    <h1>Bowling App</h1>
                    <NavLink to="/">Home</NavLink>              
                </nav>
                <Breadcrumbs />
            </header>
        </div>
        
        <main>
            <Outlet />
        </main>
        </>
    )
}

export default RootLayout;