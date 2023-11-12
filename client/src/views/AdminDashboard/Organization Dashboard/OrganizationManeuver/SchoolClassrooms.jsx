import React from "react";
import { AddSVG, BackbagSVG, CodeSVG, LeftArrowSVG, MapSVG, PeopleSVG, StackSVG, TrashSVG } from "../../../../assets/SVG";

const ALL = -1;

export default function SchoolClassrooms(props) {
    const [classrooms, setClassrooms] = React.useState({});
    const [mentors, setMentors] = React.useState([]);
    const [students, setStudents] = React.useState([]);
    const [selectedClassroom, setSelectedClassroom] = React.useState({
        name: "",
        mentors: [],
        students: [],
    });
    const [selectedClassroomID, setSelectedClassroomID] = React.useState(ALL);
    

    // Unselects all .classElement(s)
    function unselectClassElements() {
        let selectedClassElements = document.querySelectorAll(`li.classElement.selected`);
        selectedClassElements.forEach((element) => {
            element.classList.remove("selected")
        });
    }


    // Selects .classElement w ID
    function selectClassElement(classroomID) {
        let classElement = document.querySelector(`li.classElement[classroomID='${classroomID}']`);
        if (classElement != null)
            classElement.classList.add("selected");
    }


    // Selects a Classroom
    function selectClassroom(classroomID, qMentors, qStudents) {
        setSelectedClassroomID(classroomID);

        // Toggling .selected 
        unselectClassElements();
        selectClassElement(classroomID);

        // Setting classroom
        if (classroomID == ALL) {
            setSelectedClassroom({
                name: "All Classrooms",
                mentors: qMentors == null ? mentors : qMentors,
                students: qStudents == null ? students : qStudents
            });
        }
        else {
            setSelectedClassroom(classrooms[classroomID])
        }
    }


    React.useEffect(() => {
        // Storing and organizing students and mentors
        let studentsData = {};
        let mentorsData = {};
        let classroomsData = {};

        if (props.school == null)
            return;
    
        props.school.classrooms.forEach((classroom) => {
            let classroomStudentsMembers = {};
            let classroomMentorMembers = {};

            if (classroom.data.students != null) {
                classroom.data.students.forEach((student) => {
                    studentsData[student.id] = {
                        studentID: student.id,
                        name: student.name,
                        character: student.character,
                        classroom: student.classroom
                    };

                    classroomStudentsMembers[student.id] = studentsData[student.id];
                })
            }

            if (classroom.data.mentors != null) {
                classroom.data.mentors.forEach((mentor) => {
                    mentorsData[mentor.id] = {
                        mentorID: mentor.id,
                        name: `${mentor.first_name} ${mentor.last_name}`,
                        first_name: mentor.first_name,
                        last_name: mentor.last_name,
                        organizationID: mentor.organization,
                        schoolID: mentor.school,
                        userID: mentor.user
                    };

                    classroomMentorMembers[mentor.id] = mentorsData[mentor.id];
                })
            }

            classroomsData[classroom.data.id] = {
                classroomID: classroom.data.id,
                code: classroom.data.code,
                name: classroom.data.name,
                schoolID: classroom.data.school,
                mentors: classroomMentorMembers,
                students: classroomStudentsMembers
            };
            
        })

        selectClassroom(ALL, mentorsData, studentsData);
        setClassrooms(classroomsData);
        setStudents(studentsData);
        setMentors(mentorsData);
    }, []);


    return (
        <div id='school-container'>
            <div className='shadow'>
                <div id='school-header-container' className='top'>
                    <div id='school-header'>
                        <button onClick={() => props.goBack()} id='go-back-btn'>
                            <LeftArrowSVG/>
                            <span>Go Back to Schools</span>
                        </button>
                        <h1>{props.school.name}</h1>
                        <p><MapSVG/>In {props.school.organization.name}</p>
                        <p><PeopleSVG/>{Object.keys(mentors).length} Mentors</p>
                        <p><BackbagSVG/>{Object.keys(students).length} Students</p>
                        <p><StackSVG/>{Object.keys(classrooms).length} Classes</p>
                    </div>
                    <div className='action-buttons'>
                        <button>
                            <AddSVG/>
                            <span>Add Classroom</span>
                        </button>
                        <button>
                            <AddSVG/>
                            <span>Add Mentor</span>
                        </button>
                        <button>
                            <AddSVG/>
                            <span>Add Student</span>
                        </button>
                        <button id='delete-school-btn'>
                            <TrashSVG/>
                            <span>Delete School</span>
                        </button>
                    </div>
                </div>        
                <div id='classroom-container'className='classes'>
                    <ul id='classroomMenu'>
                        {/* Default Class Element */}
                        <li 
                            className='classElement'
                            classroomid={ALL} 
                            key={ALL} 
                            onClick={() => selectClassroom(ALL)}>
                            <span>All Classrooms</span>
                        </li>

                        {/* Generated Class Elements */}
                        {Object.keys(classrooms).map((classroomID) => {
                            let classroom = classrooms[classroomID];
                            return (
                                <li 
                                    className='classElement' 
                                    classroomid={classroom.classroomID} 
                                    key={classroom.classroomID} 
                                    onClick={() => selectClassroom(classroom.classroomID)}>
                                    <span>{classroom.name}</span>
                                </li>
                            )
                        })}
                    </ul>
                    <div id='classroom-info' className='class-breakdown'>
                        {/* Classroom Name */}
                        <h3>{selectedClassroom.name}</h3>

                        {/* Buttons */}
                        <div className='action-buttons'>
                            <button>
                                <CodeSVG/>
                                <span>Go to {selectedClassroomID == ALL ? "" : "Classroom's"} Gallery</span>
                            </button>
                            <button id='delete-classroom-btn'>
                                <TrashSVG/>
                                <span>Delete {selectedClassroomID == ALL ? "All Classrooms" : "Classroom"}</span>
                            </button>
                        </div>

                        {/* Mentor Table for Class Goes Here */}
                        <div className='mentors'>
                            <p>Mentors</p>
                            <div>
                                {/* Use Example */}
                                {
                                    Object.keys(selectedClassroom.mentors).map((mentorID) => {
                                        return <li key={mentorID}>{selectedClassroom.mentors[mentorID].name}</li>
                                    })    
                                }
                            </div>
                        </div>

                        {/* Student Table for Class Goes Here */}
                        <div className='students'>
                            <p>Students</p>
                            <div>
                                {/* Use Example */}
                                {
                                    Object.keys(selectedClassroom.students).map((studentID) => {
                                        return <li key={studentID}>{selectedClassroom.students[studentID].name}</li>
                                    })    
                                }
                            </div>
                        </div>
                    </div>         
                </div>
            </div>
        </div>
    )
}