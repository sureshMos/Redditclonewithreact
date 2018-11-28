import React , { Component } from "react";
import { Provider } from "react-redux";

import configureStore from "../configureStore";
import AsyncApp from "../containers/AsyncApp";

// Configure Redux store
const store = configureStore();

// Base of the app
export default class Root extends Component{
    render(){
        return(
            <Provider store = {store}>
                <AsyncApp/>
            </Provider>
        )
    }
}