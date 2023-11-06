import React from "react"
import Search from "../../components/Search/Search"
import GalleryView from "../../components/GalleryView/GalleryView"
import "./CCGallery.less"
import { useSearchParams } from 'react-router-dom';
import { useState } from "react";

export default function Gallery(props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const [tab, setTab] = useState(
        searchParams.has('tab') ? searchParams.get('tab') : 'home'
    );
    const [page, setPage] = useState(
        searchParams.has('page') ? parseInt(searchParams.get('page')) : 1
    );
    const [viewing, setViewing] = useState(parseInt(searchParams.get('activity')));

    return (
        <div>
            <div id='page-header'>
                <h1>Gallery</h1>
            </div>
            <div id="gallery-content-container" style={{ marginTop: '6.6vh' }}>
                <Search />
                <GalleryView
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />
            </div>
        </div>
    )
}
