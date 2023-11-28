import React, { useEffect, useState } from 'react';
import './Gallery.less';
import {
  getClassroom,
  getLessonModule,
  getLessonModuleActivities,
} from '../../../../Utils/requests';
import MentorSubHeader from '../../../../components/MentorSubHeader/MentorSubHeader';
import DisplayCodeModal from './DisplayCodeModal';
import MentorActivityDetailModal from './MentorActivityDetailModal';
import LessonModuleModal from './LessonModuleSelect/LessonModuleModal';
import { message, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Home({ classroomId, viewing }) {
  const [classroom, setClassroom] = useState({});
  const [activities, setActivities] = useState([]);
  const [gradeId, setGradeId] = useState(null);
  const [activeLessonModule, setActiveLessonModule] = useState(null);
  const [activityDetailsVisible, setActivityDetailsVisible] = useState(false)
  const navigate = useNavigate();

  const SCIENCE = 1;
  const MAKING = 2;
  const COMPUTATION = 3;

  useEffect(() => {
    const fetchData = async () => {
      const res = await getClassroom(classroomId);
      if (res.data) {
        const classroom = res.data;
        setClassroom(classroom);
        setGradeId(classroom.grade.id);
        classroom.selections.forEach(async (selection) => {
          if (selection.current) {
            const lsRes = await getLessonModule(
              selection.lesson_module
            );
            if (lsRes.data) setActiveLessonModule(lsRes.data);
            else {
              message.error(lsRes.err);
            }
            const activityRes = await getLessonModuleActivities(lsRes.data.id);
            if (activityRes) setActivities(activityRes.data);
            else {
              message.error(activityRes.err);
            }
          }
        });
      } else {
        message.error(res.err);
      }
    };
    fetchData();
  }, [classroomId]);

  const handleViewActivity = (activity, name) => {
    activity.lesson_module_name = name;
    localStorage.setItem('sandbox-activity', JSON.stringify(activity));
    navigate('/sandbox');
  };

  const openActivityInWorkspace = (activity, name) => {
    activity.lesson_module_name = name;
    activity.template = activity.activity_template;
    delete activity.id;
    delete activity.activity_template;
    localStorage.setItem('sandbox-activity', JSON.stringify(activity));
    navigate('/sandbox');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const color = [
    'magenta',
    'purple',
    'green',
    'cyan',
    'red',
    'geekblue',
    'volcano',
    'blue',
    'orange',
    'gold',
    'lime',
  ];

  return (
    <div>
      <button id='home-back-btn' onClick={handleBack}>
        <i className='fa fa-arrow-left' aria-hidden='true' />
      </button>
      <DisplayCodeModal code={classroom.code} />
      <MentorSubHeader title={classroom.name}></MentorSubHeader>
      <div id='home-content-container'>
        <div id='active-lesson-module'>
          TEMP GALLERY!
        </div>
      </div>
    </div>
  );
}
