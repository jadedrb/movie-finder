import React, { Component } from 'react';
import Movie from './Movie'
import { connect } from 'react-redux';

class MovieList extends Component {
  componentDidMount() {
    let { linkMovie } = this.props.other
    let linkMovieCopy = [...linkMovie]
    linkMovieCopy = 'midnightblue'
    this.props.setData(linkMovieCopy, 'linkMovie')
  }
  componentWillUnmount() {
    let { linkMovie } = this.props.other
    let linkMovieCopy = [...linkMovie]
    linkMovieCopy = 'white'
    this.props.setData(linkMovieCopy, 'linkMovie')
  }
  render() {
    let data = this.props.data
    return (
        <div className='movie-list'>
          {data.hasOwnProperty('Search') ? data.Search.filter(m => m.Poster !== 'N/A').map((m, i) => <Movie key={i} data={m} getMovieInfo={this.props.getMovieInfo}/>) : <div className='title-page'>Find new movies to watch. Randomly or otherwise.</div>}
        </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
    other: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setData: (data, prop) => {
      dispatch({
        type: 'SET_DATA',
        payload: [data, prop]
      })
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MovieList);
