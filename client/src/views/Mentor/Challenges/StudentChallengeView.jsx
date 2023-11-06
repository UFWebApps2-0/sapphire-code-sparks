//Import stuff
import React, { useEffect, useRef, useState, useReducer } from 'react';


//Function component for student to view list of challenges. Get prop of array of challenges
function studentChallengeView ({challenges})
{
    //Scrolling list for array of challenges, use map function
    return (
        <div style={{overflow: 'auto', maxHeight: '300px'}}>
            {challenges && challenges.map((challenge, index) => (
                <div key={index}>{challenge}</div>
                ))
            }

        </div>
    )
}

export default studentChallengeView;

