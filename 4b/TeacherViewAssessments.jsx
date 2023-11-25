import {useNavigate} from "react-router-dom";
import './TeacherViewAssessments.css';
import "../client/src/Utils/requests";
import NavBar from "../client/src/components/NavBar/NavBar";
import {getAssessments} from "../client/src/Utils/requests";

const TeacherViewAssessments = async() => {
    const assessmentList = fetchData();
    return (
        <body className="background">
            <div id="main-header"> <br></br>View Assessments</div>
            <NavBar />
            <div className="projectText">
                <p1 className="tableTop bold">
                    Assessments:
                </p1>
                <PrintMiddleEntries
                    filteredData={ assessmentList }
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

const PrintMiddleEntries = async( { assessmentList } ) => {
    const sampleList = ["Red and Blue", "Yellow", "Gold and Silver", "Crystal", "Ruby and Sapphire", "FireRed and LeafGreen", "Emerald", "Diamond and Pearl", "Platinum", "HeartGold and SoulSilver", "Black and White", "Black 2 and White 2", "X and Y", "Omega Ruby and Alpha Sapphire", "Sun and Moon", "Ultra Sun and Ultra Moon", "Let's Go, Pikachu! and Let's Go, Eevee!", "Sword and Shield", "The Isle of Armor (DLC)", "The Crown Tundra (DLC)", "Brilliant Diamond and Shining Pearl", "Legends: Arceus", "Scarlet and Violet", "The Teal Mask (DLC)", "The Indigo Disk (DLC)"]; // Can replace with database
    const navigate = useNavigate();
    if (assessmentList !== undefined) {
        return ( // TODO: Replace this stuff with a structure for assessmentList.name and it should work.
            <div>
                {assessmentList.map(directory => (
                    <div className="tableMid">
                        <p2 className="alignLeft bold">{directory?.name}</p2>
                        <p3><br></br>Assigned: openDate | Due: dueDate</p3>
                        <button onClick={() => navigate("Grade")} className="alignRight">
                            Grade
                        </button>
                        <button onClick={() => navigate("/teacher-assessments/editor/:id")}
                                className="alignRight shortenTransform">
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
}

const fetchData = async () => {
    try {
        const res = await getAssessments().data;
        console.log(res);
        return res;
    } catch {
        return { err: "Data fetch failed" };
    }
};

export default TeacherViewAssessments;
