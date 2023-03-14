import React from "react";
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
        <Link to="/leagues" class="link-button">Leagues</Link>
        <h1>HOME</h1>
        </>
    );
}

export default Home;