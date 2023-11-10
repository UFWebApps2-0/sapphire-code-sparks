import './Search.less'

import React from 'react';
import { useState, useRef, useEffect } from "react";

function Search({ filterUpdate, filterText }) {
    const input = useRef();

    useEffect(() => {
        input.current.focus();
    }, []);

    function handleChange(event) {
        // TODO: Update the value of the filter with the input from the textbox
        // Hint: You will need to use the "current" property of the input variable
        // console.log("handleChange called");
        filterUpdate(event);
    }

    return (
        // TODO: Add a ref attribute to the input tag
        // TODO: Add an onChange attribute to the input tag
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
