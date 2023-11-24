import {useNavigate} from "react-router-dom";

function GradeList ({data, filterText, assessID}){
  const navigate = useNavigate();
  //Display scrollable list of student - grade data for specific assessment    
  const gradeList = data.filter(grades => {
      grades.student.toLowerCase().includes(filterText.toLowerCase()) && grades.name.includes(assessID)
  });
  
  return( 
    <div>
    {gradeList.map(grades => (
      // TODO: Update with json formatting for how student name/id and grade are associated
      <div className="tableMid">
        <p2 className="alignLeft bold">{grades.student}</p2>
        <p3 className="alignRight">{grades.score}/<i>total</i></p3>
        <p3 className="alignRight shortenTransform">{grades.grade}%</p3>
        <button onClick={() => navigate("/student-response/"+assessID)} className="alignRight shortenTransform2"> {/*not made yet, need more params?*/}
            Responses
        </button>
      </div>         
      ))}
    </div>
  );
}

export default GradeList;
  