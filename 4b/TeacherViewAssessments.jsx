import {useNavigate} from "react-router-dom";
import './TeacherViewAssessments.css';
import NavBar from "../client/src/components/NavBar/NavBar";

function TeacherViewAssessments( { assessmentList } ) {
    // TODO: Don't know how to run program to test implementation with Assignments, fix up.
    return (
        <body className="background">
            <div id="main-header"> 
                <br></br>View Assessments 
                <button onClick={() => HandleAdd()} className="alignRight button2">{/*need to fix text color bc it was moved*/}
                        Create New<br></br>Assignment
                </button>
            </div>
            <NavBar />
            <div className="projectText">
                <p1 className="tableTop bold">
                    Assessments:
                </p1>
                <PrintMiddleEntries
                    filteredData={assessmentList}
                />
            </div>
        </body>
    );
}

function PrintMiddleEntries( { assessmentList } ) {
    const sampleList = [{id:1, name:"Red and Blue"},{id:2, name:"Yellow"},{id:3, name:"Gold and Silver"},{id:4,name: "Crystal"},{id:5,name: "Ruby and Sapphire"},{id:6,name: "FireRed and LeafGreen"},{id:7,name: "Emerald"},{id:8,name: "Diamond and Pearl"},{id:9,name: "Platinum"},{id:10,name: "HeartGold and SoulSilver"},{id:11,name: "Black and White"},{id:12,name: "Black 2 and White 2"},{id:13,name: "X and Y"},{id:14,name: "Omega Ruby and Alpha Sapphire"},{id:15,name: "Sun and Moon"},{id:16,name: "Ultra Sun and Ultra Moon"},{id:17,name: "Let's Go, Pikachu! and Let's Go, Eevee!"},{id:18,name: "Sword and Shield"},{id:19,name: "The Isle of Armor (DLC)"},{id:20,name: "The Crown Tundra (DLC)"},{id:21,name:"Brilliant Diamond and Shining Pearl"},{id:22,name: "Legends: Arceus"},{id:23,name: "Scarlet and Violet"},{id:24,name: "The Teal Mask (DLC)"},{id:25,name: "The Indigo Disk (DLC)"}]; // Can replace with database
    const navigate = useNavigate();
    return ( // TODO: Replace this stuff with a structure for assessmentList.name and it should work.
        <div>
            {sampleList.map(sampleList => (
                <div className="tableMid">
                    <p2 className="alignLeft bold">{sampleList.name}</p2>
                    <p3><br></br>Assigned: openDate | Due: dueDate</p3>
                    <button onClick={() => navigate("/assessment-grade/"+sampleList.name)} className="alignRight">
                        Grade
                    </button>
                    <button onClick={() => navigate("/teacher-assessments/editor/"+sampleList.id)} className="alignRight shortenTransform">
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
