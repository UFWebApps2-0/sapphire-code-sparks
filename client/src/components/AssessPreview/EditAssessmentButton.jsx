import { useEffect, useState} from 'react'
import { Link } from 'react-router-dom'


const doThing = () => {
    
}

const EditAssessmentButton = () => {
    return (
                <Link to = "/teacher-assessments/editor/:id">
                    <button onSubmit = {doThing}>Edit</button>
                </Link>
    )
}




export default EditAssessmentButton