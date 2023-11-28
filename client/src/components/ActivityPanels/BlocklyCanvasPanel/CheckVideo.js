import '../ActivityLevels.less';
import { getVideoLink} from '../../../Utils/requests';

export default function CheckVideo(n) {
  let checker = false;
  getVideoLink(n).then((res) => {
        if (res.data[0]){
          if(res.data[0].name == n) {
            console.log("Video found");
          checker = true;}
        }
        else {
          console.log("No video here");
        }
      });

      console.log(checker);

    return true;
}