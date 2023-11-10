import './Search.less'

import React from 'react';
import { useState, useRef, useEffect } from "react";

function Search({ filterUpdate, filterText }) {
    const input = useRef();

    useEffect(() => {
        input.current.focus();
    }, []);

    function handleChange(event) {
        filterUpdate(event);
    }

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
