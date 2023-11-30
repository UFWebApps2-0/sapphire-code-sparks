import { AddSVG } from "../../../../assets/SVG"
import SchoolCreator from "../SchoolCreator/SchoolCreator";

const ALL = -1;


export default function OSchools(props) {

    return (
        <div id='schools-wrapper'>
            {
                props.schools != null &&
                    (<div id='schools-container'>
                        <div id='page-header'>
                            <h1>{props.organizationName} Schools</h1>
                        </div>
                        <div id='home-content-container'>
                            {/* Add School Button */}
                            <SchoolCreator
                                organizationID={props.organizationID}
                                organizationName={props.organizationName}
                                load={props.load}
                            />  
                            
                            {/* Container for the School-Cards */}
                            <div id='school-card-container'>
                                
                                {/* Card for "All Schools" */}
                                <div 
                                    className='school-card' 
                                    onClick={() => props.selectSchool(ALL, ALL)}
                                >
                                    <h2>All Schools</h2>
                                </div>

                                {/* Generated Cards for Organization's Schools */}
                                {props.schools.map((school) => {
                                    return (
                                        <div 
                                            key={school.id} 
                                            className='school-card' 
                                            onClick={() => props.selectSchool(school.id, ALL)}
                                        >
                                            <h2>{school.name}</h2>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>)
            }
        </div>
    )
}