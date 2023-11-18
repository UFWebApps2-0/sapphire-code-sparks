import {useNavigate} from "react-router-dom";
import './TeacherViewAssessments.css';
import NavBar from "../client/src/components/NavBar/NavBar";

function TeacherViewAssessments( { assessmentList } ) {
    // TODO: Don't know how to run program to test implementation with Assignments, fix up.
    return (
        <body className="background">
            <div id="main-header"> <br></br>View Assessments </div>
            <NavBar />
            <div className="projectText">
                <p1 className="tableTop bold">
                    Assessments:
                </p1>
                <PrintMiddleEntries
                    filteredData={assessmentList}
                />
                <div>
                    <button onClick={() => HandleAdd()} className="alignRight button2">
                        Create New<br></br>Assignment
                    </button>
                </div>
            </div>
        </body>
    );
}

function PrintMiddleEntries( { assessmentList } ) {
    const sampleList = ["Red and Blue", "Yellow", "Gold and Silver", "Crystal", "Ruby and Sapphire", "FireRed and LeafGreen", "Emerald", "Diamond and Pearl", "Platinum", "HeartGold and SoulSilver", "Black and White", "Black 2 and White 2", "X and Y", "Omega Ruby and Alpha Sapphire", "Sun and Moon", "Ultra Sun and Ultra Moon", "Let's Go, Pikachu! and Let's Go, Eevee!", "Sword and Shield", "The Isle of Armor (DLC)", "The Crown Tundra (DLC)", "Brilliant Diamond and Shining Pearl", "Legends: Arceus", "Scarlet and Violet", "The Teal Mask (DLC)", "The Indigo Disk (DLC)"]; // Can replace with database
    const navigate = useNavigate();
    return ( // TODO: Replace this stuff with a structure for assessmentList.name and it should work.
        <div>
            {sampleList.map(sampleList => (
                <div className="tableMid">
                    <p2 className="alignLeft bold">{sampleList}</p2>
                    <p3><br></br>Assigned: openDate | Due: dueDate</p3>
                    <button onClick={() => navigate("Grade")} className="alignRight">
                        Grade
                    </button>
                    <button onClick={() => navigate("/teacher-assessments/editor/:id")} className="alignRight shortenTransform">
                        Edit
                    </button>
                    <button onClick={() => navigate("/about")} className="alignRight shortenTransform2">
                        Assign
                    </button>
                </div>
            ))}
        </div>
    );
}

/*
                    <button onClick={() => navigate("Live X to Y")} className="alignRight">
                        Live X to Y
                    </button>
 */

function HandleAdd() {
    // TODO: Call class to create new assessment - basically like the AddBuilding in Bootcamp 3.
}

export default TeacherViewAssessments;
