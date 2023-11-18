import React, { useEffect, useState } from "react";
import { Tabs, message } from "antd";

import NavBar from "../../components/NavBar/NavBar";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import AssessmentEditor from "./AssessmentEditor";
import Assessment from "../../Utils/AssessmentObj";
import {
  getAssessment,
  updateAssessment,
  deleteAssessment,
} from "../../Utils/requests";

const { TabPane } = Tabs;

export default function AssessmentEditorView() {
  const [assessment, setAssessment] = useState(new Assessment());
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    sessionStorage.setItem("assessmentId", id);
    const fetchData = async () => {
      try {
        const res = await getAssessment(id);
        return res;
      } catch {
        return { err: "Data fetch failed" };
      }
    };
    fetchData().then((res) => {
      if (res.data) {
        setAssessment(
          new Assessment({
            ...res.data,
            dueDate: res.data.dueDate,
            openDate: res.data.openDate,
            publishDate: res.data.publishDate,
          })
        );
      } else {
        message.error(res.err);
        navigate("/PageNotFound");
      }
    });
  }, [id]);

  const handleViewAssessments = () => {
    navigate(`/teacher-assessments`);
  };

  return (
    <div className="container nav-padding">
      <div id="main-header">Assessment Editor</div>
      <NavBar />
      <div id="classrooms-container">
        <button
          onClick={() => {
            const res = confirm("Permanently delete this assessment?");
            if (res) {
              // IF we delete,
              deleteAssessment(id);
              message.success("Assessment Deleted");
              navigate("/teacher-assessments");
            }
          }}
        >
          Delete Assessment
        </button>
        <AssessmentEditor
          data={assessment}
          setData={setAssessment}
          onSave={(data) => {
            // TODO: Handle updating the database object.
            console.log(data);
            updateAssessment(id, data);
            message.success(`Updated ${assessment.name}`);
          }}
        />
      </div>
    </div>
  );
}
