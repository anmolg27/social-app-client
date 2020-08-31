import React, { Component, useEffect } from "react";
import { Input, Button, Collapse, CardBody, Card } from "reactstrap";
import Post from "./post";
// Redux
import { createPost, getPosts } from "../../redux/actions/postActions";
import { connect } from "react-redux";
class Wall extends Component {
  state = { isOpen: false };
  componentDidMount() {
    this.props.getPosts();
  }
  // componentDidUpdate() {
  //   console.log("new post!");
  // }
  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  renderPosts = () => {
    // console.log("new post");
    // console.log(this.props.posts);
    // console.log(this.props.images);
    let postsHtml;
    if (this.props.images.length > 0 && this.props.posts.postsList.length > 0) {
      postsHtml = this.props.posts.postsList.map((post) => {
        const ava = this.props.images.find(
          (cur) => cur.userId === post.ownerId
        );
        return <Post post={post} ava={ava} socket={this.props.socket} />;
      });
      return postsHtml;
    }
    return null;
  };
  render() {
    const handlePost = () => {
      const text = document.querySelector(".input-textarea").value;
      this.props.createPost(text);
      document.querySelector(".input-textarea").value = "";
    };
    return (
      <div className="wall-block container">
        <div className="input-post row">
          <Input
            style={{ height: 100 }}
            type="textarea"
            className="input-textarea col-md-7 col-9"
            placeholder="Write anything you like :)"
          />
          <div className="col-2 p-0 ml-2 align-self-center">
            <Button className="post-button" onClick={handlePost}>
              Post
            </Button>
          </div>
        </div>
        <ul className="list-unstyled mt-2 row">{this.renderPosts()}</ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  posts: state.posts,
  UI: state.UI,
  images: state.images,
});
export default connect(mapStateToProps, { createPost, getPosts })(Wall);
