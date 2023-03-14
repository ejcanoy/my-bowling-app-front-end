import React from "react";
import { Link, Outlet } from 'react-router-dom';


const Leagues = () => {
    return (
        <>
        <Link to="games" class="link-button">Games</Link>
        <h1>Leagues</h1>
        </>
    );
}

export default Leagues;