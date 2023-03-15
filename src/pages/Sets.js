import React from "react";
import { Link, Outlet } from 'react-router-dom';


const Sets = () => {
    return (
        <>
            <h1>HOME</h1>
            <Link to="games" class="link-button">Games</Link>
        </>
    );
}

export default Sets;