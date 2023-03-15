import React from "react";
import { Link, Outlet } from 'react-router-dom';


const Leagues = () => {
    return (
        <>
            <h1>Leagues</h1>
            <Link to="sets" class="link-button">Sets</Link>
        </>
    );
}

export default Leagues;