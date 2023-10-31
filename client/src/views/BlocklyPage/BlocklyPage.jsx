import { message } from "antd"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BlocklyCanvasPanel from "../../components/ActivityPanels/BlocklyCanvasPanel/BlocklyCanvasPanel"
import NavBar from "../../components/NavBar/NavBar"
import {
  getAuthorizedWorkspaceToolbox,
  getActivityToolbox,
  getActivityToolboxAll,
} from "../../Utils/requests"
import { useGlobalState } from "../../Utils/userState"

export default function BlocklyPage({ isSandbox }) {
  const [isChallengeActivity, setIsChallengeActivity] = useState(false);
  const [value] = useGlobalState("currUser")
  const [activity, setActivity] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    setIsChallengeActivity(false);
    const setup = async () => {
      // if we are in sandbox mode show all toolbox
      const sandboxActivity = JSON.parse(localStorage.getItem("sandbox-activity"))
      if (isSandbox) {
        const AllToolboxRes = await getActivityToolboxAll()
        if (!sandboxActivity?.id || value.role === "Mentor") {
          if (AllToolboxRes.data) {
            let loadedActivity = {
              ...sandboxActivity,
              toolbox: AllToolboxRes.data.toolbox,
            }
            localStorage.setItem("sandbox-activity", JSON.stringify(loadedActivity))
            setActivity(loadedActivity)
          } else {
            message.error(AllToolboxRes.err)
          }
        } else if (value.role === "ContentCreator") {
          const res = await getAuthorizedWorkspaceToolbox(sandboxActivity.id)
          if (res.data) {
            let loadedActivity = { ...sandboxActivity, selectedToolbox: res.data.toolbox }
            loadedActivity = { ...loadedActivity, toolbox: AllToolboxRes.data.toolbox }

            localStorage.setItem("sandbox-activity", JSON.stringify(loadedActivity))
            setActivity(loadedActivity)
          } else {
            message.error(res.err)
          }
        }
      }
      // else show toolbox based on the activity we are viewing
      else {
        const localActivity = JSON.parse(localStorage.getItem("my-activity"))
        // FIXME: Remove this debugging console log
        console.log(`the following was found for local activity: ${localActivity}`);

        if (localActivity) {
            setIsChallengeActivity(localActivity?.is_challenge == true);
            // FIXME: Remove this debugging console log
            console.log(`Set is challenge activity to: ${isChallengeActivity}`);
          if (localActivity.toolbox) {
            setActivity(localActivity)
          } else {
            const res = await getActivityToolbox(localActivity.id)
            if (res.data) {
              let loadedActivity = { ...localActivity, toolbox: res.data.toolbox }

              localStorage.setItem("my-activity", JSON.stringify(loadedActivity))
              setActivity(loadedActivity)
              setIsChallengeActivity(localActivity?.is_challenge == true);
            } else {
              message.error(res.err)
            }
          }
        } else {
          navigate(-1)
        }
      }
    }

    setup()
  }, [isSandbox, navigate, value.role])

  return (
    <div className="container nav-padding">
      <NavBar />
      <div className="flex flex-row">
        <BlocklyCanvasPanel activity={activity} setActivity={setActivity} isSandbox={isSandbox} isChallengeActivity={isChallengeActivity} />
      </div>
    </div>
  )
}
