import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useParams } from 'react-router-dom';

const Games = () => {
    const games = useLoaderData();
    const { setId } = useParams();
    return (
        <>
            <h1>Games</h1>
            <LinkGames setId={setId} />
        </>
    );
}



function LinkGames({ setId }) {
    const [linkGames, setLinkGames] = useState([]);

    useEffect(() => {
        fetchData();
        console.log(linkGames);
    }, []);

    async function fetchData() {
        const res = await axios.get('http://localhost:8000/set/' + setId + '/games');
        let arr = JSON.parse(res.data).Responses.Game_Information.slice();
        arr.sort((a, b) => a.game_id - b.game_id);
        setLinkGames(arr);
    }

    return (
        <>
            <h1>Games</h1>
            {
                linkGames.map((game, count) => (
                    <div key={game.game_id}>
                        <Link to={"games/" + game.game_id.toString()} className="link-button">
                            {"Game " + (count + 1)}
                        </Link>
                    </div>
                ))}
        </>
    )
}

export default Games;