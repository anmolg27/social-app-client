import React, { Component } from "react";
import { Button, Spinner } from "reactstrap";
import Post from "./post";
// Redux
import {
  createPost,
  getPosts,
  getOldPosts,
  initializePosts,
} from "../../redux/actions/postActions";
import { getAvatar } from "../../redux/actions/userActions";
import { connect } from "react-redux";
class Wall extends Component {
  state = {
    isOpen: false,
    bottomLoading: false,
    scrollTop: undefined,
  };
  componentDidMount() {
    this.props.getPosts(null);
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
          this.props.getOldPosts(this.props.posts.lastPostId);
        }
      }
    });
  }
  async componentWillUnmount() {
    this.props.initializePosts();
    // console.log("unmounting from home");
    // await console.log(this.props.posts);
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
        const ava = this.props.images.find(
          (cur) => cur.userId === post.ownerId
        );
        // console.log(ava);
        if (!ava) {
          this.props.getAvatar(post.ownerId);
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
    const handlePost = () => {
      const text = document.querySelector(".input-textarea").value;
      if (text) {
        this.props.createPost(text);
      }
      document.querySelector(".input-textarea").value = "";
    };
    return (
      <div className="wall-block">
        <div className="input-post row">
          <textarea
            style={{ height: 100 }}
            type="textarea"
            className="input-textarea col-md-9 col-9"
            placeholder="Write anything you like :)"
          />
          <div className="col-2 p-0 ml-2 align-self-center">
            <Button className="post-button" onClick={handlePost}>
              {this.props.posts.createPostLoading === true ? (
                <div className="spinner-border text-success" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </div>

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
  getPosts,
  getOldPosts,
  initializePosts,
  getAvatar,
})(Wall);
