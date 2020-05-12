import React, { Component } from 'react';
import Movie from './Movie'
import Quiz from './Quiz'
import { connect } from 'react-redux';

class MyMovies extends Component {
  componentDidMount() {
    let { watched, linkWatched } = this.props.data
    watched.length === 0 && this.props.newQuote()
    let linkWatchedCopy = [...linkWatched]
    linkWatchedCopy = 'midnightblue'
    this.props.setData(linkWatchedCopy, 'linkWatched')
  }
  componentWillUnmount() {
    let { linkWatched } = this.props.data
    let linkWatchedCopy = [...linkWatched]
    linkWatchedCopy = 'white'
    this.props.setData(linkWatchedCopy, 'linkWatched')
  }
  render() {
    let { watched, quote } = this.props.data
    return (
      <div className='movie-list'>
        {watched.length > 0 ? <Quiz data={watched} /> : ''}
        {watched ? watched.map((m, i) => <Movie key={i} data={m} getMovieInfo={this.props.getMovieInfo}/>) : ''}
        {watched.length === 0 ? <div className='quote'>{quote ? <div><span className='marks'>"</span>{quote[0].quote}<span className='marks'>"</span></div> : ''}</div> : ''}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state
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

export default connect(mapStateToProps, mapDispatchToProps)(MyMovies);
