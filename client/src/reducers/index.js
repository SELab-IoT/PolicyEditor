import {combineReducers} from 'redux';
import node from "./node";
import sidebar from "./sidebar";
import editor from "./editor";
import rightSidebar from "./rightSidebar";
import request from './request';

export default combineReducers({node, sidebar, editor, rightSidebar, request});
