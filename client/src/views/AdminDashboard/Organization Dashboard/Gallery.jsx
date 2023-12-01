import React from "react";
import { useState } from "react";
import { Modal } from "antd";
import img1 from "../../../assets/galleryimgs/image1.png";
import img2 from "../../../assets/galleryimgs/image2.png";
import img3 from "../../../assets/galleryimgs/image3.png";
import img4 from "../../../assets/galleryimgs/image4.png";
import img5 from "../../../assets/galleryimgs/image5.png";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { TrashSVG } from "../../../assets/SVG";
import { useNavigate } from "react-router-dom";

const images = [img1, img2, img3, img4, img5];

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [visible, setVisible] = useState(false)
    const [imageList, setImageList] = useState(images);
    const handleImageClick = (image) => {
      setVisible(true);
      setSelectedImage(image);
    };
    
    const handleCloseModal = () => {
      setVisible(false);
      setSelectedImage(null);
    };

    const removeImage = (remove) => {
        setImageList(imageList.filter( image => image !== remove));
    }
  
    const handleDelete = () => {
      // Implement delete functionality here (remove image from the list, close modal, etc.)
      console.log("Deleted image:", selectedImage);
      removeImage(selectedImage);
      setVisible(false);
      setSelectedImage(null); // Close modal after deleting
    };
    const navigate = useNavigate();

    const navigateOrganizationDash = () => {
      navigate('/organization-dashboard');
    };

    return (
        <div>
          <button id='home-back-btn' onClick={navigateOrganizationDash}>
                <i className='fa fa-arrow-left' aria-hidden='true' />
            </button>
        {imageList.map((image, index) => (
          <div key={index} >
            <a href="#" key={index} onClick={() => handleImageClick(image)}>
            <img
              src={image}
              alt={`image${index}`}
              style={{ width: "60%", height: "auto", margin: "5px"}} // Adjust image size and spacing
            />
            </a>
          </div>
        ))}
  
        <Modal
            open={visible}
            width="80%"
            onCancel={handleCloseModal}
            footer={null}
        >
            <img src={selectedImage} alt="enlarged" style={{ maxWidth: "100%", maxHeight: "90vh" }} />
            <Popconfirm
                title={`Are you sure you want to delete this image?`}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => handleDelete()}
            >
                <button id='delete-school-btn'>
                    <TrashSVG/>
                    <span>Delete Image</span>
                </button>
            </Popconfirm>
        </Modal>
      </div>
      );
    
}
