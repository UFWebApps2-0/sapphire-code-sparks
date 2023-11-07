import React, {useState} from 'react';
import '../ActivityLevels.less';

export default function DraggableVideo() {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const [mouseDown, setMouseDown] = useState(false);

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

    // function dragElement(elmnt) {
    //     var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    //     if (document.getElementById(elmnt.id + "header")) {
    //       // if present, the header is where you move the DIV from:
    //       document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    //     } else {
    //       // otherwise, move the DIV from anywhere inside the DIV:
    //       elmnt.onmousedown = dragMouseDown;
    //     }
      
    //     function dragMouseDown(e) {
    //       e = e || window.event;
    //       e.preventDefault();
    //       // get the mouse cursor position at startup:
    //       pos3 = e.clientX;
    //       pos4 = e.clientY;
    //       document.onmouseup = closeDragElement;
    //       // call a function whenever the cursor moves:
    //       document.onmousemove = elementDrag;
    //     }
      
    //     function elementDrag(e) {
    //       e = e || window.event;
    //       e.preventDefault();
    //       // calculate the new cursor position:
    //       pos1 = pos3 - e.clientX;
    //       pos2 = pos4 - e.clientY;
    //       pos3 = e.clientX;
    //       pos4 = e.clientY;
    //       // set the element's new position:
    //       elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    //       elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    //     }
      
    //     function closeDragElement() {
    //       // stop moving when mouse button is released:
    //       document.onmouseup = null;
    //       document.onmousemove = null;
    //     }
    //   }
    return (
        <div id = "draggableVideo"
        onMouseDown = {event => handleMouseDown(event)}
        onMouseMove = {event => handleMouseMove(event, document.getElementById("draggableVideo"))}
        onMouseUp = {handleMouseUp}
        >
        <h2>Test</h2>
        <iframe 
        src="https://www.youtube.com/embed/jfKfPfyJRdk?si=UHs_9lQeGlWGU_C1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen
        />
            {/* <iframe id = "draggableVideoHeader"/> */}
        </div>
    );
}