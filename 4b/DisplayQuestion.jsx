import "./AssessmentObj";
import "./QuestionObj";
import "./QuesitonList";
import React from "react";
import { RadioGroup } from 'react-bootstrap';
import Editable from "react-editable-title";
import "../client/src/assets/style.less";

function displayQuestion( { assesment } ) {
    const [data, setData] = React.useState(assesment);
    const [question, setQuestion] = React.useState(assesment.questions);

    function handleSubmission() {
        // TODO: Handle form
    };

    function handleChange() {
        // TODO: Handle question input
    };

    function questionRender(q) {
        if(q.type in q.TYPES) {
            switch (q.type) {
                case ('multipleChoice'): {
                    return (
                        <div onChange={handleChange}>
                            {q.choices.map((c, index) => (
                                <input type="radio" value={c}></input>
                            ))}
                        </div>
                    );
                }

                case ('multiSelect'): {
                    return (
                        <div onChange={handleChange}>
                            {q.choices.map((c, index) => (
                                <input type=""></input>
                            ))}
                        </div>
                    );
                }

                case ('dropDown'): {
                    return (
                        <div onChange={handleChange}>
                            {q.choices.map((c, index) => (
                                <input type=""></input>
                            ))}
                        </div>
                    );
                }

                case ('freeResponse'): {
                    return (
                        <div onChange={handleChange}>
                            <input> </input>
                        </div>
                    );
                }

                case ('codingQ'): {
                    // Call existing code workspace
                    break;
                }
            }
        }
    }

    const questionForm = ( { question } ) => {
        return (
            <form>
                {question.map((q, index) => (
                    <div key={index}>
                        <label>{q.prompt}</label>
                        {questionRender(q)}
                    </div>
                ))}
            </form>
        );
    };

    // return (
    //     <div>
    //         {}
    //         <div className="row">
    //             <div className="col">
    //                 <h1>{this.data.name}</h1>
    //                 <h2>{this.question.length} Questions</h2>
    //             </div>
    //             <form id="mainForm" onSubmit={handleSubmission}>
                    

    //             </form>
    //         </div>
    //     </div>
    // );

}