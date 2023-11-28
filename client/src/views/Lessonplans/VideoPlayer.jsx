import React, {useState} from 'react';
import '../../components/ActivityPanels/ActivityLevels.less';
import FlagButton from '../../components/FlagButton/FlagButton.jsx';
import { getVideoLink} from '../../Utils/requests';

export default function DraggableVideo(props) {
 
 
    const [mouseDown, setMouseDown] = useState(false);
    const { name} = props; //Video name and link are passed in 
    const [vidLink, setVidLink] = useState(videoId); 

    const getLink = (id) => {
        getVideoLink(id).then((res) => {
            if (res.data) {
                console.log("URL: " + res.data[0].URL);
              setVidLink(res.data[0].URL);
            
            } else {
              console.log("No video");
            }
          });
    }
    getLink(name);

    if(vidLink != null){
    return ( //Returns an iframe video wrapped in a div that will be used to drag the iframe around the workspace
        <div id = "draggableVideo"
        >
        <h2 id="vidTitle">{name} Video <FlagButton id = {1}/>
        </h2>
        
        {/* Retrieve video link */}
        {console.log("Video: " + vidLink)}

        <iframe 
        src={vidLink} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen
        />
        </div>
    );}
}