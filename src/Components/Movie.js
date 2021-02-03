import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getModalInfoAc, toggleModalAc, toggleModalLoadingAc } from '../Actions'

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
    this.props.toggleModal()
    this.props.toggleModalLoading()
    fetch(fullUrl)
      .then(response => response.json())
      .then(data => {
        this.props.getMovie(data)
        this.props.toggleModalLoading()
        console.log(this.props)
        console.log('^^')
      })
      .catch(err => {
        console.log(err)
        this.props.toggleModal()
        this.props.toggleModalLoading()
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

const mapStateToProps = (state) => ({
  modal: state.modal,
  movieModal: state.movieModal
})

const mapDispatchToProps = (dispatch) => ({
  getMovie: (data) => dispatch(getModalInfoAc(data)),
  toggleModal: () => dispatch(toggleModalAc()),
  toggleModalLoading: () => dispatch(toggleModalLoadingAc())
})

export default connect(mapStateToProps, mapDispatchToProps)(Movie);
