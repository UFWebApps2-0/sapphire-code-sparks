import { useEffect, useState} from 'react'


//components
import AssignmentTitle from '../components/AssignmentTitle'
import PreviewAssessment from '../components/PreviewAssessment'
import DataVis from '../components/DataVisualization'
import ButtonSet from '../components/ButtonSet'

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
