import './Search.less'

import React from 'react';
import { useRef, useEffect } from "react";

function Search({ filterUpdate, filterText }) {
    // useRef() to allow input to be mutable for when it is being typed into the search bar
    const input = useRef();

    // Focuses the cursor on the search bar when the gallery page is opened
    useEffect(() => {
        input.current.focus();
    }, []);

    // Sets the filterText to the typed input
    function handleChange(event) {
        filterUpdate(event);
    }

    // Shows the input as it is typed in the search bar
    return (
        <form>
            <input
                className="searchBar"
                ref={input}
                type="text"
                placeholder="Type to Filter. . ."
                value={filterText}
                onChange={handleChange}
            />
        </form>
    );
}
export default Search;
