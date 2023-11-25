import {useNavigate} from "react-router-dom";
import './StudentViewAssessments.css';
import NavBar from "../client/src/components/NavBar/NavBar";

function StudentViewAssessments( { assessmentList } ) {
    // name, attempts, points, questions, showGrades, openDate, dueDate, timeLimit
    const navigate = useNavigate();
    return (
        <body className="background">
        <NavBar />
        <p1 className = "blackText header bold noBottomBorder"> Student Name</p1>
        <p1 className = "smallerText header"> Number Incomplete Assessments: x/y<br></br>Current Grade: z%</p1>
        <button onClick={() => navigate("Grade")} className="alignRight button3">
            Sort by Type
        </button>
        <button onClick={() => navigate("/about")} className="alignRight button3">
            Sort by Date
        </button>
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

function PrintMiddleEntries() {
    const sampleList = ["Red and Blue", "Yellow", "Gold and Silver", "Crystal", "Ruby and Sapphire", "FireRed and LeafGreen", "Emerald", "Diamond and Pearl", "Platinum", "HeartGold and SoulSilver", "Black and White", "Black 2 and White 2", "X and Y", "Omega Ruby and Alpha Sapphire", "Sun and Moon", "Ultra Sun and Ultra Moon", "Let's Go, Pikachu! and Let's Go, Eevee!", "Sword and Shield", "The Isle of Armor (DLC)", "The Crown Tundra (DLC)", "Brilliant Diamond and Shining Pearl", "Legends: Arceus", "Scarlet and Violet", "The Teal Mask (DLC)", "The Indigo Disk (DLC)"]; // Can replace with database
    const navigate = useNavigate();
    return ( // TODO: Replace this stuff with a structure for assessmentList.name and it should work.
        <div>
            {sampleList.map(sampleList => (
                <div className="tableMid tableHover" onClick={() => navigate("/about")}>
                    <p2 className="alignLeft bold">{sampleList}</p2>
                    <p3><br></br>Due: dueDate | attempts Attempts | -/points | [Not Yet Graded]</p3>
                </div>
            ))}
        </div>
    );
}

function HandleAdd() {
    // TODO: Call class to create new assessment - basically like the AddBuilding in Bootcamp 3.
}

export default StudentViewAssessments;
