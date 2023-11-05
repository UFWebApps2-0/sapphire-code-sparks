import React, { useRef } from 'react';

// Filter list of Student-grade data
function GradeSearch({filterUpdate}) {
    const input = useRef("");
    
    function handleChange() {
        filterUpdate(input.current.value)
    }

  return(
    <form>
      <input 
        type="text"
        placeholder="Student Name"
        ref={input}
        onChange={handleChange}
      />
    </form>
  );
}
export default GradeSearch;