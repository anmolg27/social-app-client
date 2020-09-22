import React, { Component } from "react";
import { Spinner } from "reactstrap";
import Post from "./post";
// Redux
import {
  createPost,
  getUserPosts,
  getOldUserPosts,
  initializePosts,
} from "../../redux/actions/postActions";
import { connect } from "react-redux";
class Wall extends Component {
  state = {
    isOpen: false,
    bottomLoading: false,
    scrollTop: undefined,
  };
  componentDidMount() {
    this.props.getUserPosts(this.props.paramUserId);
  }
  componentWillUpdate() {
    window.addEventListener("scroll", () => {
      const win = document.querySelector("html");
      const containerHeight = win.scrollHeight;

      const scrollOffset = Math.ceil(win.scrollTop) + win.clientHeight + 100;
      if (
        containerHeight <= scrollOffset &&
        this.state.scrollTop !== Math.ceil(win.scrollTop)
      ) {
        this.setState({ scrollTop: Math.ceil(win.scrollTop) });
        if (
          this.props.posts.postsList.length % 10 === 0 &&
          this.props.posts.lastPostId &&
          !this.props.posts.oldPostsLoading
        ) {
          // console.log("scrolled to bottom " + this.props.posts.lastPostId);
          this.props.getOldUserPosts(
            this.props.paramUserId,
            this.props.posts.lastPostId
          );
        }
      }
    });
  }
  componentWillUnmount() {
    this.props.initializePosts();
  }
  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  renderPosts = () => {
    if (this.props.posts.postsLoading === true) {
      return (
        <div className="loading-posts">
          <p>Loading...</p>

          <Spinner
            style={{ height: "70px", width: "70px", fontSize: "30px" }}
            color="success"
          />
        </div>
      );
    }
    let postsHtml;
    if (this.props.posts.postsList.length > 0) {
      postsHtml = this.props.posts.postsList.map((post) => {
        let ava = null;
        if (this.props.images.length > 0) {
          ava = this.props.images.find((cur) => cur.userId === post.ownerId);
        }

        return <Post post={post} ava={ava} socket={this.props.socket} />;
      });
      return postsHtml;
    }
    return null;
  };
  renderFooter = () => {
    if (this.props.posts.oldPostsLoading) {
      return (
        <div className="loading-posts">
          <p>Loading...</p>

          <Spinner
            style={{ height: "70px", width: "70px", fontSize: "30px" }}
            color="success"
          />
        </div>
      );
    } else if (
      this.props.posts.postsLoading === false &&
      !this.props.posts.lastPostId
    ) {
      return (
        <li className="no-post col-12 my-2">
          <h4>That's it! Nothing more left to show :p</h4>
        </li>
      );
    }
    if (
      this.props.posts.postsLoading === false &&
      this.props.posts.postsList.length === 0
    ) {
      return (
        <li className="no-post col-12 my-2">
          <h4>Get started by creating you first post!</h4>
        </li>
      );
    }
  };
  render() {
    return (
      <div className="wall-block">
        <ul className="list-unstyled mt-2 row mr-1 mr-md-0">
          {this.renderPosts()}
          {this.renderFooter()}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  posts: state.posts,
  UI: state.UI,
  images: state.images,
});
export default connect(mapStateToProps, {
  createPost,
  getUserPosts,
  getOldUserPosts,
  initializePosts,
})(Wall);
