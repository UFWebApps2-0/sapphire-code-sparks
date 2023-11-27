import '../ActivityLevels.less';
import { getVideoLink} from '../../../Utils/requests';

export default function CheckVideo(n) {
    const name = n; //Video name is passed in 
    let isVideo = false; 

    getVideoLink(name).then((res) => {
        if (res.data) {
            console.log("Video found");
          isVideo = true;
        
        } else {
          console.log("No video here");
        }
      });
       
return isVideo;
}