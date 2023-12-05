import { Button, Form, Input, message, Modal } from "antd"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  getLessonModule,
  updateLessonModule,
  getLessonHistories,
  updateLessonHistory,
  getLessonHistory,
  createLessonHistory,
} from "../../../Utils/requests"
import ActivityEditor from "../ActivityEditor/ActivityEditor"

export default function LessonEditor({learningStandard, dName, viewing, setViewing, tab, page}) {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState(learningStandard.name)
  const [description, setDescription] = useState("")
  const [standards, setStandards] = useState("")
  const [link, setLink] = useState("")
  const [linkError, setLinkError] = useState(false)
  const [displayName, setDisplayName] = useState(name)
  // eslint-disable-next-line
  const [_, setSearchParams] = useSearchParams()

  // Lesson reversion variables
  const [revertVisible, setRevertVisible] = useState(false);
  const [lessonHistories, setLessonHistories] = useState([]);

  // Show Revert modal if button clicked
  const showRevertModal = async () => {
    const histories = await getLessonHistories(learningStandard.id);

    // if (Array.isArray(histories)) { // Edit button
    //   setLessonHistories(histories);
    //   setRevertVisible(true);
    // }
    // else {
    //   console.error("Expected an array for lesson history, received:", histories);
    
    if (histories.data) { // Main (just in case)
      setLessonHistories([...histories.data.lesson_histories]);
      console.log(lessonHistories);

      if (!Array.isArray(lessonHistories))
      {
        console.error("Expected an array for lessonHistories, received:", lessonHistories);
      }
      else {
        setRevertVisible(true);
      }
    }
    else {
      console.error("Expected an array for histories, received:", histories);
    }
  }
  

  const fetchAndUpdateLessonModule = async () => {
    try {
      const res = await getLessonModule(learningStandard.id);
      if (res && res.data) {
        setName(res.data.name);
        setDescription(res.data.expectations);
        setStandards(res.data.standards);
        setLink(res.data.link);
      }
    } catch (error) {
      console.error("Error fetching updated lesson module:", error);
    }
  };

  const revertLesson = async (historyId) => {
    try {
      const res = await getLessonHistory(historyId);
      if (res) {
        message.success("Lesson reverted successfully");

        // Refresh data
        // setLessonHistories(getLessonHistories(learningStandard.id));
        // await fetchAndUpdateLessonModule();

        updateLessonModule(
          learningStandard.id,
          res.data.name,
          res.data.expectations,
          res.data.standards,
          res.data.link,
        );

        setName(res.data.name)
        setDescription(res.data.expectations)
        setStandards(res.data.standards)
        setLink(res.data.link)
        setLinkError(false)
      }

      setRevertVisible(false);
    } catch (error) {
      message.error("Error Reverting Lesson");
      console.error("Error Reverting Lesson", error);
    }
  }

  const showModal = async () => {
    setVisible(true)
    const res = await getLessonModule(learningStandard.id)
    setName(res.data.name)
    setDescription(res.data.expectations)
    setStandards(res.data.standards)
    setLink(res.data.link)
    setLinkError(false)
  }

  useEffect(() => {
    setDisplayName(dName)
  }, [learningStandard.name])

  const handleCancel = () => {
    setVisible(false)
  }

  const handleSubmit = async () => {
    if (link) {
      const goodLink = checkURL(link)
      if (!goodLink) {
        setLinkError(true)
        message.error("Please Enter a valid URL starting with HTTP/HTTPS", 4)
        return
      }
    }
    const response = await updateLessonModule(
      learningStandard.id,
      name,
      description,
      standards,
      link
    )

    const res = await getLessonModule(learningStandard.id)

    const responseHistory = await createLessonHistory(
      description,
      name,
      res.data.number,
      res.data.unit,
      standards,
      link,
      res.data.id
    )
    if (response.err) {
      message.error("Fail to update lesson")
    } 
    else if (responseHistory.err) {
      message.error("Failed to update version history")
    }
    else {
      message.success("Update lesson success")
      setDisplayName(name)
      setSearchParams({ tab, page, activity: response.data.id })
      setViewing(response.data.id)
      setVisible(false)
    }
  }

  const checkURL = n => {
    const regex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
    if (n.search(regex) === -1) {
      return null
    }
    return n
  }

  return (
    <div>
      <button id="link-btn" onClick={showModal}>
        {displayName}
      </button>
      <Modal
        title="Lesson Editor"
        open={visible}
        width="35vw"
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          id="add-units"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          onFinish={handleSubmit}
          layout="horizontal"
          size="default"
        >
          <Form.Item id="form-label" label="Lesson Name">
            <Input
              onChange={e => setName(e.target.value)}
              value={name}
              required
              placeholder="Enter lesson name"
            />
          </Form.Item>
          <Form.Item id="form-label" label="Description">
            <Input.TextArea
              onChange={e => setDescription(e.target.value)}
              value={description}
              rows={3}
              required
              placeholder="Enter lesson description"
            />
          </Form.Item>
          <Form.Item id="form-label" label="Standards">
            <Input
              onChange={e => setStandards(e.target.value)}
              value={standards}
              required
              placeholder="Enter lesson standards"
            />
          </Form.Item>
          <Form.Item label="Link to Additional Resources (Optional)">
            <Input
              onChange={e => {
                setLink(e.target.value)
                setLinkError(false)
              }}
              style={linkError ? { backgroundColor: "#FFCCCC" } : {}}
              value={link}
              placeholder="Enter a link"
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
            style={{ marginBottom: "0px" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="content-creator-button"
            >
              Next
            </Button>
            <Button
              onClick={handleCancel}
              size="large"
              className="content-creator-button"
            >
              Cancel
            </Button>
            <Button
              onClick={showRevertModal}
              size="large"
              className="content-creator-button"
            >
              Revert Lesson
            </Button>
            <Modal
              title="Revert Lesson"
              open={revertVisible}
              onCancel={() => setRevertVisible(false)}
              footer={null}
            >
              {lessonHistories.map(history => (
                <div key={history.id}>
                  <p>{history.name} - {history.created_at}</p>
                  <Button onClick={() => revertLesson(history.id)}>Revert to this</Button>
                </div>
              ))}
            </Modal>
          </Form.Item>
        </Form>
      </Modal>
      {!visible ? (
        <ActivityEditor
          learningStandard={learningStandard}
          viewing={viewing}
          setViewing={setViewing}
          page={page}
          tab={tab}
        />
      ) : null}
    </div>
  )
}
