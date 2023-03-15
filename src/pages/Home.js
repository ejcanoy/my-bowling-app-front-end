import React from "react";
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <h1>HOME</h1>
            <Link to="/leagues" class="link-button">Leagues</Link>
        </>
    );
}

export default Home;