import React from 'react';
import Editor from "./Editor";
import '../../public/css/main.scss'
import Sidebar from "./sidebar";
import Nav from "./Nav";

export default () => (
    <div className="mainContainer" style={{height: '100%'}}>
        <Nav/>
        <Sidebar/>
        <Editor/>
    </div>

)
