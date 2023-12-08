import { server } from './hosts';
import axios from 'axios';
import { getToken } from './AuthRequests';

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';
const DELETE = 'DELETE';

// All request functions should utilize makeRequest and return an obj with structure {data, err}
const makeRequest = async ({ method, path, data, auth = false, error }) => {
  let res = null;
  let err = null;
  const config = auth
    ? {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    : null;
    
  try {
    switch (method) {
      case GET:
        res = (await axios.get(path, config)).data;
        break;
      case POST:
        res = (await axios.post(path, data, config)).data;
        break;
      case PUT:
        res = (await axios.put(path, data, config)).data;
        break;
      case DELETE:
        res = (await axios.delete(path, config)).data;
        break;
      default:
        throw Error('Invalid method.');
    }
  } catch (e) {
    err = error ? error : 'An error occurred.';
  }
  return { data: res, err: err };
};

export const deleteSchool = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/schools/${id}`,
    auth: true,
    error: 'Failed to delete classroom.',
  });

export const createClassroom = async (name, school, grade) =>
  makeRequest({
    method: POST,
    path: `${server}/classrooms/`,
    data: {
      name,
      school,
      grade
    },
    auth: true,
    error: 'Failed to create new classroom.',
  });

export const createSchool = async (name, state, county, organization) =>
  makeRequest({
    method: POST,
    path: `${server}/schools/`,
    data: {
      name,
      state,
      county,
      organization
    },
    auth: true,
    error: 'Failed to create new school.',
  });

export const deleteClassroom = async (id) =>
makeRequest({
  method: DELETE,
  path: `${server}/classrooms/${id}`,
  auth: true,
  error: 'Failed to create new classroom.',
});

export const updateClassroom = async (id, classroom) => 
  makeRequest({
    method: PUT,
    path: `${server}/classrooms/${id}`,
    data: classroom,
    auth: true,
    error: 'Failed to update classroom.',
  });

export const getSchool = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/schools/${id}`,
    auth: true,
    error: 'School information could not be retrieved',
  });

//For implementing organization handling
export const getOrganization = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/organizations/${id}`,
    auth: true,
    error: 'Organization information could not be retrieved',
  });

export const getOrganizations = async (ids) =>
  Promise.all(ids.map(async (id) => (await getOrganization(id)).data));

// For implementing the bare-bone administrators
export const getAllAdministrators = async () => 
  makeRequest({
    method: GET,
    path: `${server}/administrators`,
    auth: true,
    error: 'Your administrator information could not be fetched.'
  });


export const getModRecord = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/moderation_records/${id}`,
    auth: true,
    error: 'Moderation Record information could not be retrieved',
  });

export const getSchools = async () => 
  makeRequest({
    method: GET,
    path: `${server}/schools`,
    auth: true,
    error: 'Moderation Record information could not be retrieved',
  });

export const getModRecordCount = async () =>
  makeRequest({
    method: GET,
    path: `${server}/moderation_records/count`,
    auth: true,
    error: 'Moderation Record Count information could not be retrieved',
  });  
  
// Retrieves the user from the session's token (I think)
export const getUser = async () =>
  makeRequest({
    method: GET,
    path: `${server}/users/me`,
    auth: true,
    error: 'Your user information could not be fetched.'
  })

export const getUsers = async () =>
  makeRequest({
    method: GET,
    path: `${server}/users`,
    auth: true,
    error: 'Your user information could not be fetched.'
  })

export const getMentors = async () =>
  makeRequest({
    method: GET,
    path: `${server}/mentors`,
    auth: true,
    error: 'Your user information could not be fetched.'
  })

export const getActivities = async () =>
  makeRequest({
    method: GET,
    path: `${server}/activities`,
    auth: true,
    error: 'Activities could not be retrieved.',
  });

export const getTeachers = async () =>
  makeRequest({
    method: GET,
    path: `${server}/mentors`,
    auth: true,
    error: 'Teachers could not be retrieved.',
  });

export const deleteMentor = async (mentor) =>
makeRequest({
  method: DELETE,
  path: `${server}/mentors/${mentor}`,
  auth: true,
  error: 'Failed to delete mentor.',
});

export const getAllClassrooms = async () =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms`,
    auth: true,
    error: 'Classrooms could not be retrieved.',
  });

export const getAllStudents = async () =>
  makeRequest({
    method: GET,
    path: `${server}/students`,
    auth: true,
    error: 'Students could not be retrieved.',
  });
export const getActivityToolboxAll = async () =>
  makeRequest({
    method: GET,
    path: `${server}/sandbox/toolbox`,
    error: 'Toolbox could not be retrieved.',
  });

// export cost getActivityLevels = async () =>
//   makeRequest({
//     method: GET,
//     path: `${server}/activities/`
//   })

// export const getLessonModuleActivities = async (lsId) =>
//   makeRequest({
//     method: GET,
//     path: `${server}/activities?lesson_module.id=${lsId}`,
//     auth: true,
//     error: 'Activity cannot be retrived',
//   });

export const getActivityToolbox = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/activities/toolbox/${id}`,
    auth: true,
    error: 'Toolbox could not be retrieved.',
  });

export const getMentor = async () =>
  makeRequest({
    method: GET,
    path: `${server}/classroom-managers/me`,
    auth: true,
    error: 'Your classroom manager information could not be retrieved.',
  });

export const getClassroom = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms/${id}`,
    auth: true,
    error: 'Classroom information could not be retrieved',
  });

export const getStudentClassroom = async () =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms/student`,
    auth: true,
    error: 'Classroom information could not be retrieved',
  });

export const getClassrooms = async (ids) =>
  Promise.all(ids.map(async (id) => (await getClassroom(id)).data));

export const getStudents = async (code) =>
  makeRequest({
    method: GET,
    path: `${server}/classrooms/join/${code}`,
    error: 'Student info could not be retrieved.',
  });

export const getStudent = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/students/${id}`,
    auth: true,
    error: 'Student info could not be retrieved.',
  });

export const postJoin = async (code, ids) =>
  makeRequest({
    method: POST,
    path: `${server}/classrooms/join/${code}`,
    data: {
      students: ids,
    },
    error: 'Login failed.',
  });

export const createActivity = async (activity, learningStandard) =>
  makeRequest({
    method: POST,
    path: `${server}/activities`,
    data: {
      lesson_module: learningStandard,
      number: activity,
      template: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>)',
    },
    auth: true,
    error: 'Login failed.',
  });

export const setEnrollmentStatus = async (id, enrolled) =>
  makeRequest({
    method: PUT,
    path: `${server}/students/enrolled/${id}`,
    data: {
      enrolled: enrolled,
    },
    auth: true,
    error: 'Failed to change enrollment status.',
  });

export const updateStudent = async (id, student) =>
  makeRequest({
    method: PUT,
    path: `${server}/students/${id}`,
    data: student,
    auth: true,
    error: 'Failed to update student.',
  });

  export const recoverStudent = async (id) =>
  makeRequest({
    method: PUT,
    path: `${server}/students/${id}`,
    data: {
      deleted: false, 
    },
    auth: true,
    error: 'Failed to recover student account.',
  });

export const getUnits = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/units?grade=${id}`,
    auth: true,
    error: 'Failed to retrieve units.',
  });

export const getLessonModule = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/lesson-modules/${id}`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getUnit = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/units/${id}`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getAllUnits = async () =>
  makeRequest({
    method: GET,
    path: `${server}/units`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getLessonModulecount = async () =>
  makeRequest({
    method: GET,
    path: `${server}/lesson-modules/count`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const getLessonModuleAll = async () =>
  makeRequest({
    method: GET,
    path: `${server}/lesson-modules?_sort=unit.name:ASC,name:ASC`,
    auth: true,
    error: 'Failed to retrieve learning standard.',
  });

export const setSelection = async (classroom, learningStandard) =>
  makeRequest({
    method: POST,
    path: `${server}/selections/`,
    data: {
      classroom: classroom,
      lesson_module: learningStandard,
    },
    auth: true,
    error: 'Failed to set active learning standard.',
  });

export const saveWorkspace = async (activity, workspace, replay) =>
  makeRequest({
    method: POST,
    path: `${server}/saves`,
    data: {
      activity,
      workspace,
      replay,
    },
    auth: true,
    error: 'Failed to save your workspace.',
  });

export const getSaves = async (activity) =>
  makeRequest({
    method: GET,
    path: `${server}/saves/activity/${activity}`,
    auth: true,
    error: 'Past saves could not be retrieved.',
  });

export const getSave = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/saves/${id}`,
    auth: true,
    error: 'Save could not be retrieved.',
  });

export const createSubmission = async (id, workspace, sketch, path, isAuth) =>
  makeRequest({
    method: POST,
    path: `${server}${path}`,
    data: {
      activity: id,
      workspace: workspace,
      board: 'arduino:avr:uno',
      sketch: sketch,
    },
    auth: isAuth,
    error: 'Failed to create submission.',
  });

export const getSubmission = async (submissionId, path, isAuth) =>
  makeRequest({
    method: GET,
    path: `${server}${path}/${submissionId}`,
    auth: isAuth,
    error: 'Failed to retrieve submission status',
  });

export const addStudent = async (name, character, classroom) =>
  makeRequest({
    method: POST,
    path: `${server}/students`,
    data: {
      name: name,
      character: character,
      classroom: classroom,
    },
    auth: true,
    error: 'Failed to add student.',
  });

export const addMentor = async (first_name, last_name, school, classrooms, organization) =>
  makeRequest({
    method: POST,
    path: `${server}/mentors`,
    data: {
      first_name,
      last_name,
      school,
      classrooms,
      organization
    },
    auth: true,
    error: 'Failed to add student.',
  });

export const updateMentor = async (id, mentor) =>
  makeRequest({
    method: POST,
    path: `${server}/mentors/${id}`,
    data: {
      ...mentor
    },
    auth: true,
    error: 'Failed to update mentor.',
  });

export const addStudents = async (students, classroom) =>
  makeRequest({
    method: POST,
    path: `${server}/students`,
    data: { students: students, classroom: classroom },
    auth: true,
    error: 'Failed to add students.',
  });

export const deleteStudent = async (student) =>
  makeRequest({
    method: DELETE,
    path: `${server}/students/${student}`,
    auth: true,
    error: 'Failed to delete student.',
  });

export const updateActivityLevelTemplate = async (id, workspace, blocksList) =>
  makeRequest({
    method: PUT,
    path: `${server}/activities/template/${id}`,
    data: {
      template: workspace,
      blocks: blocksList,
    },
    auth: true,
    error: 'Failed to update the template for the activity',
  });

export const updateActivityTemplate = async (id, workspace) =>
  makeRequest({
    method: PUT,
    path: `${server}/activities/activity_template/${id}`,
    data: {
      activity_template: workspace,
      //blocks: blocksList,
    },
    auth: true,
    error: 'Failed to update the activity template for the activity',
  });

export const deleteActivity = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/activities/${id}`,
    auth: true,
    error: 'Failed to delete activity.',
  });

export const deleteLessonModule = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/lesson-modules/${id}`,
    auth: true,
    error: 'Failed to delete student.',
  });

export const createLessonModule = async (
  description,
  name,
  number,
  unit,
  standards,
  link
) =>
  makeRequest({
    method: POST,
    path: `${server}/lesson-modules`,
    data: {
      expectations: description,
      name,
      number,
      unit,
      standards,
      link,
    },
    auth: true,
    error: 'Login failed.',
  });

export const createUnit = async (number, name, standardsID, standardsDescrip, grade) =>
  makeRequest({
    method: POST,
    path: `${server}/units`,
    data: {
      number: parseInt(number, 10),
      name: name,
      grade: parseInt(grade, 10),
      standards_id: standardsID,
      standards_description: standardsDescrip,
    },
    auth: true,
    error: 'Fail to create new unit.',
  });

export const createOrganization = async (name) =>
  makeRequest({
    method: POST,
    path: `${server}/organizations/`,
    data: {
      name: name,
    },
    auth: true,
    error: 'Failed to create new organization.',
  });

export const updateOrganization = async (id, schools, adminId) =>
  makeRequest({
    method: PUT,
    path: `${server}/organizations/${id}`,
    data: {
      schools: schools,
      administrators: adminId,
    },
    auth: true,
    error: 'Failed to update organization.',
  });

export const updateUnit = async (
  id,
  number,
  name,
  standardsID,
  standardsDescrip,
  grade
) =>
  makeRequest({
    method: PUT,
    path: `${server}/units/${id}`,
    data: {
      number: parseInt(number, 10),
      name: name,
      grade: parseInt(grade, 10),
      standards_id: standardsID,
      standards_description: standardsDescrip,
    },
    auth: true,
    error: 'Failed to update unit',
  });

export const getGrades = async () =>
  makeRequest({
    method: GET,
    path: `${server}/grades`,
    auth: true,
    error: 'Grades could not be retrieved',
  });

export const getGrade = async (grade) =>
  makeRequest({
    method: GET,
    path: `${server}/grades/${grade}`,
    auth: true,
    error: 'Grade could not be retrieved',
  });

export const updateLessonModule = async (
  id,
  name,
  expectations,
  standards,
  link
) =>
  makeRequest({
    method: PUT,
    path: `${server}/lesson-modules/${id}`,
    data: {
      name,
      standards,
      expectations,
      link,
    },
    auth: true,
    error: 'Failed to update unit',
  });

export const updateActivityDetails = async (
  id,
  description,
  // template,
  // activity_template,
  StandardS,
  images,
  link,
  scienceComponents,
  makingComponents,
  computationComponents
) =>
  makeRequest({
    method: PUT,
    path: `${server}/activities/${id}`,
    data: {
      description,
      // template,
      // activity_template,
      StandardS,
      images,
      link,
      scienceComponents,
      makingComponents,
      computationComponents,
    },
    auth: true,
    error: 'Failed to update unit',
  });

export const getLessonModuleActivities = async (lsId) =>
  makeRequest({
    method: GET,
    path: `${server}/activities?lesson_module.id=${lsId}`,
    auth: true,
    error: 'Activity cannot be retrived',
  });

  export const getActivityLevels = async (lsId) =>
  makeRequest({
    method: GET,
    path: `${server}/authorized-workspaces?activities.id=${lsId}`,
    auth: true,
    error: 'Activities cannot be retrieved',
  });

export const getActivity = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/activities/${id}`,
    auth: true,
    error: 'Activity cannot be retrived',
  });

export const forgetPassword = async (email) =>
  makeRequest({
    method: POST,
    path: `${server}/auth/forgot-password`,
    data: {
      email,
    },
    error: 'cannot retrive data from the provided email',
  });

export const resetPassword = async (code, password, passwordConfirmation) =>
  makeRequest({
    method: POST,
    path: `${server}/auth/reset-password`,
    data: {
      code,
      password,
      passwordConfirmation,
    },
    error:
      'Cannot update new password. Please try again or get a new link from the forgot password page.',
  });

export const getSessions = async () =>
  makeRequest({
    method: GET,
    path: `${server}/sessions`,
    auth: true,
    error: 'Sessions could not be retrieved.',
  });

export const getSessionsWithFilter = async (filterOptions) =>
  makeRequest({
    method: GET,
    path: `${server}/sessions?${filterOptions}`,
    auth: true,
    error: 'Sessions could not be retrieved.',
  });

export const getSessionCount = async () =>
  makeRequest({
    method: GET,
    path: `${server}/sessions/count`,
    auth: true,
    error: 'Session count could not be retrieved.',
  });

export const getSessionCountWithFilter = async (filterOptions) =>
  makeRequest({
    method: GET,
    path: `${server}/sessions/count?${filterOptions}`,
    auth: true,
    error: 'Session count could not be retrieved.',
  });

export const getSession = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/sessions/${id}`,
    auth: true,
    error: 'Sessions could not be retrieved.',
  });
export const submitBugReport = async (
  description,
  steps,
  name,
  email,
  systemInfo
) =>
  makeRequest({
    method: POST,
    path: `${server}/bug-report`,
    data: {
      description,
      steps,
      name,
      email,
      systemInfo,
    },
    error: 'Unable to submit bug-report',
  });

export const getAuthorizedWorkspaces = async () =>
  makeRequest({
    method: GET,
    path: `${server}/authorized-workspaces`,
    auth: true,
    error: 'Unable to retrive cc worksapces',
  });

export const getAuthorizedWorkspace = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/authorized-workspaces/${id}`,
    auth: true,
    error: 'Unable to retrive cc workspace',
  });

export const createAuthorizedWorkspace = async (
  name,
  description,
  template,
  blocks,
  classroomId
) =>
  makeRequest({
    method: POST,
    path: `${server}/authorized-workspaces`,
    auth: true,
    data: {
      name,
      description,
      template,
      blocks,
      classroomId,
    },
    error: 'Unable to create cc workspace',
  });
export const getAuthorizedWorkspaceToolbox = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/authorized-workspaces/toolbox/${id}`,
    auth: true,
    error: 'Toolbox could not be retrieved.',
  });

export const updateAuthorizedWorkspace = async (id, template, blocks) =>
  makeRequest({
    method: PUT,
    path: `${server}/authorized-workspaces/${id}`,
    auth: true,
    data: {
      template,
      blocks,
    },
    error: 'Unable to create cc workspace',
  });
export const deleteAuthorizedWorkspace = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/authorized-workspaces/${id}`,
    auth: true,
    error: 'Unable to delete cc workspace',
  });
  //For deleting organizations
  export const deleteOrganization = async (id) =>
  makeRequest({
    method: DELETE,
    path: `${server}/organizations/${id}`,
    auth: true,
    error: 'Failed to delete organization.',
  });

export const getClassroomWorkspace = async (id) =>
  makeRequest({
    method: GET,
    path: `${server}/classroom/workspaces/${id}`,
    auth: true,
    error: 'Unable to retrive classroom workspaces',
  });
