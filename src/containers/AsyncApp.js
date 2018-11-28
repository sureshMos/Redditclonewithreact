import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Import actions
import {
    selectSubreddit,
    fetchPostsIfNeeded,
    invalidateSubreddit
} from "../actions";

// import components
import Picker from "../components/Picker";
import Posts from "../components/Posts";

class AsyncApp extends Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
    }

    componentDidMount(){
        const { dispatch, selectedSubreddit } = this.props;
        dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }

    componentDidUpdate(prevProps){
        if(this.props.selectedSubreddit !== prevProps.selectedSubreddit){
            const { dispatch,selectedSubreddit } = this.props;
            dispatch(fetchPostsIfNeeded(selectedSubreddit))
        }
    }

    handleChange(nextSubreddit){
        this.props.dispatch(selectSubreddit(nextSubreddit));
        this.props.dispatch(fetchPostsIfNeeded(nextSubreddit))
    }

    handleRefreshClick(e){
        e.preventDefault();

        const { dispatch, selectedSubreddit } = this.props;
        dispatch(invalidateSubreddit(selectedSubreddit));
        dispatch(fetchPostsIfNeeded(selectedSubreddit));
    }

    render(){
        const { selectedSubreddit,posts,isFetching,lastpdated} = this.props;
        return(
            <div>
                <Picker 
                    value = {selectedSubreddit}
                    onChange = {this.handleChange}
                    options = {['reactjs','frontend']}
                />
                <p>
                    {lastpdated &&
                        <span>
                            Last updated at {new Date(lastpdated).toLocaleTimeString()}.{' '}
                        </span>
                    }
                    {!isFetching &&
                        <a href="#" onClick={this.handleRefreshClick}>
                            Refresh
                        </a>
                    }
                </p>
                {isFetching && posts.length===0 && <h2>Loading...</h2>}
                {!isFetching && posts.length===0 && <h2>Empty...</h2>}
                {posts.length>0 &&
                    <div style = {{opacity : isFetching ? 0.5 : 1}}>
                        <Posts posts = {posts}/>
                    </div>
                }

            </div>
        )
    }
} 

AsyncApp.propTypes = {
    selectedSubreddit : PropTypes.string.isRequired,
    posts : PropTypes.array.isRequired,
    isFetching : PropTypes.bool.isRequired,
    lastpdated : PropTypes.number.isRequired,
    dispatch : PropTypes.func.isRequired
}

function mapStateToProps(state){
    const { selectedSubreddit, postsBySubreddit } = state
    const {
        isFetching,
        lastpdated,
        items : posts
    } = postsBySubreddit[selectedSubreddit] || {
        isFetching : true,
        items : []
    }

    return {
        selectedSubreddit,
        posts,
        isFetching,
        lastpdated
    }
}

export default connect(mapStateToProps)(AsyncApp);