import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./friends.css";

import axios from "./axios";

export default function FindPeople() {
    const [person, setPerson] = useState("");
    const [people, setPeople] = useState([]);

    useEffect(() => {
        let ignore = false;

        console.log("GOING TO MAKE A REQUEST TO " + person);
        axios.get(`/api/users/${person}`).then((res) => {
            if (!ignore) {
                setPeople(res.data);
            }
        });

        return () => {
            ignore = true;
        };
    }, [person]);

    const handleChange = (e) => {
        setPerson(e.target.value);
    };

    console.log(people);

    return (
        <>
            <span>
                Find Friends:
                <input name="Person" type="text" onChange={handleChange} />
            </span>
            <div className="resultsearch">
                <ul>
                    {people.map((personData) => (
                        <li key={personData.id}>
                            <Link to={`/user/${personData.id}`}>
                                <img
                                    className="imageUser"
                                    src={
                                        personData.image ||
                                        "/images/profile.png"
                                    }
                                />
                                {personData.first} {personData.last}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
