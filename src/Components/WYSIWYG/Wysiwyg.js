import React from 'react';
import ReactQuill from 'react-quill';
import { connect } from 'react-redux';
import { addCommentToClub } from '../../redux/actions/actions';
import { db } from '../../firebase/';
import 'react-quill/dist/quill.snow.css';
import './Wysiwyg.css';
import PropTypes from 'prop-types';

export class Wysiwyg extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  handleChange = (value) => {
    this.setState({ text: value });
  }

  handleComment = () => { 
    if (!this.props.currentClub.comments) {
      this.props.currentClub.comments = [];
    }

    const date = new Date().toLocaleString();
    const comment = {
      user: this.props.user,
      comment: this.state.text,
      date
    };

    db.addCommentToClub([...this.props.currentClub.comments, comment], this.props.currentClub.id);

    this.props.addComment(comment);

    this.setState({ text: '' });
  }

  render() {
    return (
      <div className='wysiwyg'>
        <ReactQuill value={this.state.text}
          onChange={this.handleChange} />
        <button 
          onClick={this.handleComment}
        > Add Comment </button>
      </div>
    );
  }
}

Wysiwyg.propTypes = {
  currentClub: PropTypes.object,
  user: PropTypes.object,
  addComment: PropTypes.func
};

export const mapStateToProps = ({ currentClub, user }) => ({ currentClub, user });

export const mapDispatchToProps = dispatch => ({
  addComment: (comment) => dispatch(addCommentToClub(comment))
});

export default connect(mapStateToProps, mapDispatchToProps)(Wysiwyg);