import axios from "axios";
import React from "react";
import { Link, useLoaderData } from 'react-router-dom';

const Games = () => {
    const games = useLoaderData();
    console.log(typeof(games[0].game_id));
    return (
        <>
        <h1>Games</h1>
            {games.map((games, count) => ( 
                <div>
                    <Link to={(games.game_id).toString()} className="link-button" key={games.game_id}>{"Game " + (count + 1)}</Link>
                </div>
            ))}
        </>
    );
}

export const gamesLoader = async () => {
    const res = await axios.get('http://localhost:8000/games');
    const arr = JSON.parse(res.data).Items.slice();
    arr.sort((a, b) => a.game_id - b.game_id);
    return arr;
};

export default Games;