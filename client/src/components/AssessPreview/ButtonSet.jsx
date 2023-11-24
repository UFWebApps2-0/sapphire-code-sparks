import { useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

import EditAssessmentButton from './EditAssessmentButton'
import AssignToClassroomButton from './AssignToClassroomButton'
import GradeButton from './GradeButton'
import TimeOpenButton from './ChangeWindowOpenButton'



const ButtonSet = () => {
    return (
                <Link to = "/">
                    <EditAssessmentButton/> <AssignToClassroomButton/><GradeButton/><TimeOpenButton/>
                </Link>
    )
}




export default ButtonSet