import React, {useState} from 'react';
import '../ActivityLevels.less';
import FlagButton from '../../FlagButton/FlagButton.jsx';
import { getVideoLink} from '../../../Utils/requests';

export default function DraggableVideo(props) {
    const [pos1, setPos1] = useState(0);
    const [pos2, setPos2] = useState(0); 
    const [pos3, setPos3] = useState(0); 
    const [pos4, setPos4] = useState(0); 
 
    const [mouseDown, setMouseDown] = useState(false);
    const {name, videoId} = props; //Video name and link are passed in 

    //Draggable div reference: https://www.w3schools.com/howto/howto_js_draggable.asp
    //New Ref?? https://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable 
    const handleMouseDown = (e) => {
        setMouseDown(true);
        e.preventDefault();
        // get the mouse cursor position at startup:
        setPos3(e.clientX);
        setPos4(e.clientY);
        console.log("Mousedown pos 3: "+pos3);
        // document.onmouseup = handleMouseUp;
        // document.onmousemove = handleMouseMove(e);
      };

    const handleMouseMove = (e, elmnt) => {
        //alert("Working");
        //e = e;
        e.preventDefault();
        if(mouseDown){
            //alert("Mousedown")
            // calculate the new cursor position:
            console.log("Moving pos 3: "+pos3);

            setPos1(pos3 - e.clientX);
            setPos2(pos4 - e.clientY);
            setPos3(e.clientX);
            setPos4(e.clientY);
            console.log("Moving pos 1: "+pos1);
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
    }

    const handleMouseUp = () => {
        console.log("mouseup");
        setMouseDown(false);
        document.onmouseup = null;
        document.onmousemove = null;
    }

    const getLink = (id) => {
        getVideoLink(id).then((res) => {
            if (res.data) {
                console.log("URL: " + res.data.URL);
              return res.data.URL;
            
            } else {
              console.log("No video");
            }
          });
    }
    const vidLink = getLink(2);


    return ( //Returns an iframe video wrapped in a div that will be used to drag the iframe around the workspace
        <div id = "draggableVideo"
        //Draggability is currently broken
        onMouseDown = {event => handleMouseDown(event)}
        onMouseUp = {handleMouseUp}
        onMouseMove = {event => handleMouseMove(event, document.getElementById("draggableVideo"))}
        >
        <h2 id="vidTitle">{name} Video <FlagButton id = {1}/>
        </h2>
        
        {/* Retrieve video link */}
        

        <iframe 
        width="280" height="200"
        src={vidLink} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen
        />
        </div>
    );
}