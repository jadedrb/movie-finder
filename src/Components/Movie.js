import React, { Component } from 'react';
import { connect } from 'react-redux';

class Movie extends Component {

  constructor(props) {
    super(props)
    this.state = { message: 0 }
    this.getMovieStuff = this.getMovieStuff.bind(this)
  }

  getMovieStuff(id) {
    let apiKey = '3d7eed43'
    let fullPlot = '&plot=full'
    let fullUrl = 'https://www.omdbapi.com/?i=' + id + fullPlot + '&apikey=' + apiKey
    this.props.toggleModal('pending')
    fetch(fullUrl)
      .then(response => response.json())
      .then(data => {
        this.props.getMovie(data)
        console.log(this.props)
        console.log('^^')
      })
  }

  render() {
    let movie = this.props.data
    return (
      <div className='movie'>
        <img src={movie.Poster} alt='' onClick={() => this.getMovieStuff(movie.imdbID)}/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    modal: state.modal,
    movieModal: state.movieModal
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMovie: (data) => {
      dispatch({
        type: 'GET_MODAL_INFO',
        payload: data
      })
    },
    toggleModal: () => {
      dispatch({type: 'TOGGLE_MODAL'})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Movie);
