import React, {useState} from 'react';
import '../ActivityLevels.less';
import FlagButton from '../../FlagButton/FlagButton.jsx';

export default function DraggableVideo(props) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const [mouseDown, setMouseDown] = useState(false);
    const {name, videoId} = props; //Video name and link are passed in 

    //Draggable div reference: https://www.w3schools.com/howto/howto_js_draggable.asp
    const handleMouseDown = (e) => {
        setMouseDown(true);
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
      };

    const handleMouseMove = (e, elmnt) => {
        e.preventDefault();
        if(mouseDown){
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
    }

    const handleMouseUp = () => {
        setMouseDown(false);
        document.onmouseup = null;
        document.onmousemove = null;
    }

    return ( //Returns an iframe video wrapped in a div that will be used to drag the iframe around the workspace
        <div id = "draggableVideo"
        //Draggability is currently broken
        onMouseDown = {event => handleMouseDown(event)}
        onMouseUp = {handleMouseUp}
        onMouseMove = {event => handleMouseMove(event, document.getElementById("draggableVideo"))}
        >
        <h2 id="vidTitle">{name} Video <FlagButton id = {1}/>
        </h2>
        
        <iframe 
        width="280" height="200"
        src={videoId} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen
        />
        </div>
    );
}