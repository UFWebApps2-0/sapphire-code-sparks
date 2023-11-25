import { AddSVG } from "../../../../assets/SVG"

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
                            <button id='add-school-btn'><AddSVG/> Add New School</button>
                            
                            {/* Container for the School-Cards */}
                            <div id='school-card-container'>
                                
                                {/* Card for "All Schools" */}
                                <div 
                                    className='school-card' 
                                    onClick={() => props.selectSchool(ALL)}
                                >
                                    <h2>All Schools</h2>
                                </div>

                                {/* Generated Cards for Organization's Schools */}
                                {props.schools.map((school) => {
                                    return (
                                        <div 
                                            key={school.id} 
                                            className='school-card' 
                                            onClick={() => props.selectSchool(school.id)}
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