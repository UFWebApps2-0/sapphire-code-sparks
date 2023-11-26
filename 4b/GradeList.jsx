import {useNavigate} from "react-router-dom";
import './TeacherViewAssessments.css';

function GradeList ({data, filterText, assessID}){
  const navigate = useNavigate();
  //Display scrollable list of student - grade data for specific assessment    
  /*const gradeList = data.filter(grades => {
      !grades.student.toLowerCase().includes(filterText.toLowerCase()) && !grades.name.includes(assessID)
  });*/
  return(
    <main className="background">
      <div className="tableTop">Student Grades</div>
      <div>
        {data.map(grades => (
        // TODO: Update with json formatting for how student name/id and grade are associated
          <div className="tableMid">
            <p2 className="alignLeft bold">{grades.student}</p2>
            <p3 className="alignRight">{grades.score}/<i>total</i></p3>
            <p3 className="alignRight">{grades.grade}%</p3>
            <button onClick={() => navigate("/student-response/"+assessID)} className="alignRight shortenTransform2 button3"> {/*not made yet, need more params?*/}
              Responses
            </button>
          </div>
        ))}
      </div>
      </main>
  );
}
// What have we learned? It works it seems, but the filter is off and is making nothing appear. css needs work, but its just trial and error. i could probably do it.

export default GradeList;
  