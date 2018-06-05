import React, { Component } from 'react';
import * as APIcalls from '../../Helpers/APIcalls';
import { BooksDisplay } from '../BooksDisplay/BooksDisplay';
import { connect } from 'react-redux';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue : '',
      searchResults : []
    };
  }

  handleInputSearch = async (e) => {
    e.preventDefault();
    const searchResults = await APIcalls.searchViaAuthorTitleISBN(this.state.searchValue);
    this.setState({ searchResults });
  }

  render() {
    return (
      <div>
        <h3>Browse for some free e-books, or search for something more specific</h3>
        <form onSubmit={this.handleInputSearch}>
          <input 
            placeholder='Search for some books' 
            value={this.state.searchValue} 
            onChange={(e) => { this.setState({searchValue : e.target.value}); }}
          />
          <button type='submit'>Search</button>
        </form>
        <BooksDisplay 
          books={this.state.searchResults} 
          currentClub={this.props.currentClub}
          addBookToClub={this.props.addBookToClub}
        />
      </div>
    );
  }
}

export default HomePage;