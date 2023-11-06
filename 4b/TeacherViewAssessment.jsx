import { useNavigate } from "react-router-dom";

function TeacherViewAssessments( { assessmentList } ) {
    // TODO: Don't know how to run program to test implementation with Assignments, fix up.
    return (
        <div className="projectText">
            <p1 className="testingProjectTop bold">
                Assessments:
            </p1>
            <PrintMiddleEntries
                filteredData={assessmentList}
            />
            <div className="projectText">
                <button onClick={() => HandleAdd()} className="alignRight button2">
                    Create New<br></br>Assignment
                </button>
            </div>
        </div>
    );
}

function PrintMiddleEntries( { assessmentList } ) {
    const sampleList = ["Assessment 1", "Assessment 2", "Assessment 3"]; // Can replace with database
    return ( // TODO: Replace this stuff with a structure for assessmentList.name and it should work.
        <div>
            {sampleList.map(sampleList => (
                <div className="testingProjectMid projectText">
                    <p2 className="alignLeft">{sampleList}</p2>
                    <button onClick={() => Navigate("Live X to Y")} className="alignRight">
                        Live X to Y
                    </button>
                    <button onClick={() => Navigate("Grade")} className="alignRight">
                        Grade
                    </button>
                    <button onClick={() => Navigate("Assign to Classroom")} className="alignRight">
                        Assign to Classroom
                    </button>
                </div>
            ))}
        </div>
    );
}

function Navigate( { linkPage } ) {
    // TODO: Navigation placeholder
    let navigate = useNavigate();
    const routeChange = () => {
        navigate(linkPage);
    }
}

function HandleAdd() {
    // TODO: Call class to create new assessment - basically like the AddBuilding in Bootcamp 3.
}

export default TeacherViewAssessments;