import React, { useEffect, useState } from "react";
import { Tabs } from "antd";

import NavBar from "../../components/NavBar/NavBar";
import { useGlobalState } from "../../Utils/userState";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import AssessmentEditor from "./AssessmentEditor";
import Assessment from "../../Utils/AssessmentObj";

const { TabPane } = Tabs;

export default function AssessmentEditorView() {
  const [value] = useGlobalState("currUser");
  const [assessment, setAssessment] = useState(new Assessment());
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    sessionStorage.setItem("assessmentId", id);
    // TODO: Add something to fetch current assessment.
    /*
    TODO: Create function in '../../Utils/requests';
    const fetchData = async () => {
      try {
        const res = await getStudentClassroom();
        if (res.data) {
          if (res.data.lesson_module) {
            setLessonModule(res.data.lesson_module);
          }
        } else {
          message.error(res.err);
        }
      } catch {}
    };
    fetchData();
     */
  }, [id]);

  const handleViewAssessments = () => {
    navigate(`/teacher-assessments`);
  };

  return (
    <div className="container nav-padding">
      <div id="main-header">Assessment Editor</div>
      <NavBar />
      <div id="classrooms-container">
        {
          /* Assessment editor goes here */
          <AssessmentEditor
            assessment={assessment}
            onSave={() => {
              // TODO: Handle updating the database object.
            }}
          />
          /**/
        }
      </div>
    </div>
  );
}
