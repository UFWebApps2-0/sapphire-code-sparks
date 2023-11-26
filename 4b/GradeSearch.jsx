import React, { useRef } from 'react';
import "./TeacherViewAssessments.css";

// Filter list of Student-grade data
function GradeSearch({filterUpdate}) {
    const input = useRef("");
    
    function handleChange() {
        filterUpdate(input.current.value)
    }

  // Text box for user to type in
  return(
    <main className="background setFullMargins">
      <form>
        <input
          type="text"
          placeholder="Student Name"
          ref={input}
          onChange={handleChange}
        />
      </form>
    </main>
  );
}
export default GradeSearch;