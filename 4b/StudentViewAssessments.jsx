import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import './StudentViewAssessments.css';
import "../client/src/Utils/requests";
import NavBar from "../client/src/components/NavBar/NavBar";
import {getAssessments, getStudent} from "../client/src/Utils/requests";
import message from "../client/src/components/Message";

function StudentViewAssessments() {
    // name, attempts, points, questions, showGrades, openDate, dueDate, timeLimit
    const navigate = useNavigate();
    const [assessmentList, setAssessmentList] = React.useState({});
    const handleAdd = () => {
        //Create a new entry in the database
        //Navigate to the editor of that entry.
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAssessments();
                return res.data;
            } catch {
                return { err: "Data fetch failed" };
            }
        };
        fetchData().then((res) => {
            if (res) {
                setAssessmentList(res); //Whatever the react state for the assessment is.
            } else {
                message.error(res.err);
                const navigate = useNavigate();
                navigate("/PageNotFound");
            }
        });
    }, []);
    return (
        <body className="background">
        <NavBar/>
        <CalculateGrade assessmentList={assessmentList}/>
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
                assessmentList={assessmentList}
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

// navigate("/student-response/"+assessID)
function PrintMiddleEntries(assessmentList) {
    const sampleList = ["Red and Blue", "Yellow", "Gold and Silver", "Crystal", "Ruby and Sapphire", "FireRed and LeafGreen", "Emerald", "Diamond and Pearl", "Platinum", "HeartGold and SoulSilver", "Black and White", "Black 2 and White 2", "X and Y", "Omega Ruby and Alpha Sapphire", "Sun and Moon", "Ultra Sun and Ultra Moon", "Let's Go, Pikachu! and Let's Go, Eevee!", "Sword and Shield", "The Isle of Armor (DLC)", "The Crown Tundra (DLC)", "Brilliant Diamond and Shining Pearl", "Legends: Arceus", "Scarlet and Violet", "The Teal Mask (DLC)", "The Indigo Disk (DLC)"]; // Can replace with database
    const navigate = useNavigate();
    if (assessmentList !== undefined && Array.isArray(assessmentList.assessmentList)) {
        return ( // TODO: Replace this stuff with a structure for assessmentList.name and it should work.
            <div>
                {assessmentList.assessmentList.map((directory) => (
                    <div className="tableMid tableHover" onClick={() => navigate("/about")}>
                        <p2 className="alignLeft bold">{directory.name}</p2>
                        <p3><br></br>Due: <PrintDate directoryDate={directory.dueDate}/> |
                            Attempts Remaining: <PrintAttemptsMade directory={directory}/>/{directory.attempts} | <PrintIfGraded directory={directory}/>/{directory.points} Points</p3>
                    </div>
                ))}
            </div>
        );
    }
}

function PrintAttemptsMade(directory) {
    let numAttempts = 0
    let numAttemptsMade = 0
    if (directory.attempts !== undefined) {
        numAttempts = directory.attempts
    }
    if (directory.attemptsMade !== undefined) {
        numAttemptsMade = directory.attemptsMade
    }
    return numAttempts - numAttemptsMade
}

function PrintIfGraded(directory) {
    if (directory.showGrades === true) {
        return directory.grade
    }
    else {
        return "-"
    }
}

function PrintDate({directoryDate}) {
    return directoryDate.substring(0, directoryDate.indexOf("T"))
}

function CalculateGrade(assessmentList) {
    let gradeTotal = 0
    //let assessmentMap = new Map(assessmentList.entries());
    /*assessmentList.assessmentList.map((directory) => (
        if (directory.grade !== undefined && directory.showGrades) {
            console.log("hi")
        }
    ))*/
    // TODO: Idea to iterate thru assessmentList and average out grade/find num assessments completed
    //  Cant find way to do it with jsx. Possibility of getStudent(id) but we need to have students have matching id.
}

function HandleAdd() {
    // TODO: Call class to create new assessment - basically like the AddBuilding in Bootcamp 3.
}

export default StudentViewAssessments;
