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
import CustomBlockCanvasPanel from "./CustomBlockCanvasPanel"

export default function CustomBlockCreator() {
  const isSandbox = true;
  const [value] = useGlobalState("currUser")
  const [activity, setActivity] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const setup = async () => {
      const sandboxActivity = JSON.parse(localStorage.getItem("sandbox-activity"))

      const AllToolboxRes = await getActivityToolboxAll()

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
    }

    setup()
  }, [isSandbox, navigate, value.role])

  return (
    <div className="container nav-padding">
      <NavBar />
      <div className="flex flex-row">
        <CustomBlockCanvasPanel activity={activity} setActivity={setActivity} isSandbox={isSandbox} />
      </div>
    </div>
  )
}
