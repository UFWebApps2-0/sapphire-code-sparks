import './Search.less'

import React from 'react';
import { useRef } from "react";

function Search() {
    const input = useRef();

  function handleChange() {
    // TODO: Update the value of the filter with the input from the textbox
    // Hint: You will need to use the "current" property of the input variable
    // console.log("handleChange called");
    filterUpdate(input.current.value);
  }  

  return (
    // TODO: Add a ref attribute to the input tag
    // TODO: Add an onChange attribute to the input tag
    <form>
        <input 
          className="searchBar"
          type="text"
          placeholder="Type to Filter"
          ref={input}
          onChange={handleChange}
        />
    </form>
  );
}
export default Search;