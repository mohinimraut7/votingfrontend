import { combineReducers } from "redux";
import userReducer from "./userReducer";
import sidebarReducer from "./sidebarReducer";
import roleReducer from "./roleReducer";
import voterReducer from "./voterReducer";
import loginReducer from "./loginReducer";


const rootReducer=combineReducers({
    users:userReducer,
    sidebar:sidebarReducer,
    roles:roleReducer,
    voters:voterReducer,
    auth:loginReducer,
});

export default rootReducer;
