import React, {useEffect, useState} from "react";
import { Link, useLoaderData } from 'react-router-dom';
import axios from "axios";
import Button from 'react-bootstrap/Button';


const Sets = () => {
    const sets = useLoaderData();



    return (
        <>
            <Set />
        </>
    );
}

function Set() {
    const [sets, setSets] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    async function handleSubmit() {
        await axios.post('http://localhost:8000/set');
        fetchData();
    }

    async function fetchData() {
        const res = await axios.get('http://localhost:8000/set');
        const arr = JSON.parse(res.data).Items.slice();
        arr.sort((a, b) => a.set_id - b.set_id);
        console.log(arr)
        setSets(arr);
      }
      console.log(typeof(sets))

    return (
        <>
            <Button onClick={() => handleSubmit()}>Create New Set</Button>
            {sets.length === 0 ?
                <h2>No Sets</h2> :
                sets.map((set, count) => (
                    <div key={set.set_id.N}>
                      <Link to={set.set_id.N.toString()} className="link-button">
                        {"set " + (count + 1) + " " + set.date.S}
                      </Link>
                    </div>
                  ))}
        </>
    )
}


export default Sets;