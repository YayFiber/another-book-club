import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as Routes from '../../constants/routes';
import CreateBookClub from '../CreateBookClub/CreateBookClub';
import { removeBookClub, setCurrentClub } from '../../redux/actions/actions';
import PropTypes from 'prop-types';
import { db } from '../../firebase';
import './BookClubPage.css';

class BookClubPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredClubs: []
    };
  }

  enterClub = club => {
    this.props.setCurrentClub(club);
    this.props.history.push(Routes.CURRENT_CLUB);
  }

  removeClub = async (clubName) => {
    const filteredClubs = this.state.filteredClubs.filter(club => club.clubName !== clubName);
    this.props.removeBookClub(clubName);
    
    const response = await db.onceGetUserBookClubs(this.props.userId);
    const clubs = await response.val();
    const newClubs = Object.assign({...clubs}, {[clubName]: null});
    await db.removeUserBookClub(newClubs, this.props.userId);

    this.setState({filteredClubs});
  }

  filterClubs = (userClubs) => {
    db.onceGetClubs()
      .then(data => data.val())
      .then((clubs) => {
        const ids = Object.keys(clubs);
        const filteredIds = ids.filter(id => {
          return userClubs.includes(id);
        });
        return filteredIds.map(id => clubs[id]);
      })
      .then(filteredClubs => this.setState({ filteredClubs }))
      .catch(err => []);
  }

  componentDidMount() {
    const userClubs = Object.keys(this.props.userClubs || {}).map(key => this.props.userClubs[key].id);
    this.filterClubs(userClubs);
  }

  componentWillReceiveProps(nextProps) {
    const shouldUpdate = Object.keys(this.props.userClubs || {}).length !== Object.keys(nextProps.userClubs || {}).length;
    if (shouldUpdate) {
      const userClubs = Object.keys(nextProps.userClubs || {}).map(key => nextProps.userClubs[key].id);
      this.filterClubs(userClubs);
    }
  }

  renderClubs = () => {
    
    return this.state.filteredClubs.map(club => {
      const allBooks = club.books || [];
      return (
        <div className='bookClub' key={club.id}>
          <h3 >{club.clubName}</h3>
          <p>{club.description}</p>
          <ul>
            {
              allBooks.map(book => <li key={book.title}>{book.title}</li>)
            }  
          </ul>
          <div>
            <button onClick={() => this.enterClub(club)}>View Club</button>
            <br />
            <button onClick={() => this.removeClub(club.clubName)}>Leave club </button>
          </div>
        </div>
      );
    });
  }

  clubArea = () => {
    if (this.state.filteredClubs.length > 0) {
      return (
        <div>
          <h2 className='userClubList'>Your book clubs</h2>
          <div className='bookClub titles'>
            <h4>Club Name</h4>
            <h4>Description</h4>
            <h4 className='booksTitle'>Books</h4>
          </div>
        </div>
      );
    } else {
      return <div></div>
    }
  }

  render() {
    return (
      <div>
        <CreateBookClub />
        {this.clubArea()}
        {this.renderClubs()}
      </div>
    );
  }
}

BookClubPage.propTypes = {
  userClubs: PropTypes.array,
  userId: PropTypes.string,
  removeBookClub: PropTypes.func,
  setCurrentClub: PropTypes.func,
  history: PropTypes.object
};

export const mapStateToProps = (state) => ({ 
  userClubs: state.user.bookClubs,
  userId: state.user.id
});

export const mapDispatchToProps = dispatch => ({
  removeBookClub: (clubName) => dispatch(removeBookClub(clubName)),
  setCurrentClub: (club) => dispatch(setCurrentClub(club))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookClubPage));