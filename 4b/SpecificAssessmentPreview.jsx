import { useEffect, useState} from 'react'

//components
import AssignmentTitle from "./AssignmentTitle"
import PreviewAssessment from "./PreviewAssessment"
import DataVis from "./DataVisualization"
import ButtonSet from "./ButtonSet"

const SpecificAssessmentPreview = () => {

    

    return (
        <div>
            <div>
                <AssignmentTitle/>
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <ButtonSet/>
            </div>
            <div class= "spaceBig" />
            <div>
                <PreviewAssessment/>
            </div>
            <div class= "spaceBig" />
            <div>
                <DataVis/>
            </div>
        </div>

    )
}

export default SpecificAssessmentPreview
