import { useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

import EditAssessmentButton from '../components/EditAssessmentButton'
import AssignToClassroomButton from '../components/AssignToClassroomButton'
import GradeButton from '../components/GradeButton'
import TimeOpenButton from '../components/ChangeWindowOpenButton'



const ButtonSet = () => {
    return (
                <Link to = "/">
                    <EditAssessmentButton/> <AssignToClassroomButton/><GradeButton/><TimeOpenButton/>
                </Link>
    )
}




export default ButtonSet