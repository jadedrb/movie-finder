import React, { Component } from 'react';
import Movie from './Movie'
import { connect } from 'react-redux';
import { setDataAc } from '../Actions'

class MovieList extends Component {
  constructor() {
    super()
    this.handleDateCacheMovie = this.handleDateCacheMovie.bind(this)
  }
  componentDidMount() {
    let { linkMovie, type } = this.props.other
    let linkMovieCopy = [...linkMovie]
    linkMovieCopy = 'midnightblue'
    this.props.setData(linkMovieCopy, 'linkMovie')
    let selectDrop = document.getElementById('types')
    selectDrop.value = type
  }
  componentWillUnmount() {
    let { linkMovie } = this.props.other
    let linkMovieCopy = [...linkMovie]
    linkMovieCopy = 'white'
    this.props.setData(linkMovieCopy, 'linkMovie')
  }

  handleDateCacheMovie = id => {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=3d7eed43`)
      .then(response => response.json())
      .then(data => {
        this.props.clearDates()
        this.props.setData({Search: [data]}, 'data')
        console.log(data)
        console.log('^data')
        console.log(this.props)
        console.log('^reducer props')
      })
  }

  render() {
    let data = this.props.data

    let moviesListed;
    if (this.props.showDates.length) {
      moviesListed = this.props.showDates.map((m, i) => <div className='date-cache' key={i} onClick={() => this.handleDateCacheMovie(m.id)}>{m.hasOwnProperty('rating') ? m.rating : m.year} - {m.title}</div>)
    } else if (data.hasOwnProperty('Search')) {
      moviesListed = data.Search.filter(m => m.Poster !== 'N/A').map((m, i) => <Movie key={i} data={m} getMovieInfo={this.props.getMovieInfo}/>)
    } else {
      moviesListed = <div className='title-page'>Find new movies to watch. Randomly or otherwise.</div>
    }

    return (
        <div className='movie-list'>
          {moviesListed}
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
  other: state
})

const mapDispatchToProps = (dispatch) => ({
  setData: (data, prop) => dispatch(setDataAc([data, prop]))
})

export default connect(mapStateToProps, mapDispatchToProps)(MovieList);
