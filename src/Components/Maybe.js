import React, { Component } from 'react';
import Movie from './Movie'
import { connect } from 'react-redux';

class Maybe extends Component {
  componentDidMount() {
    let { maybe, linkMaybe } = this.props.data
    maybe.length === 0 && this.props.newQuote()
    let linkMaybeCopy = [...linkMaybe]
    linkMaybeCopy = 'midnightblue'
    this.props.setData(linkMaybeCopy, 'linkMaybe')
  }
  componentWillUnmount() {
    let { linkMaybe } = this.props.data
    let linkMaybeCopy = [...linkMaybe]
    linkMaybeCopy = 'white'
    this.props.setData(linkMaybeCopy, 'linkMaybe')
  }
  render() {
    let { maybe, quote, backupQuote } = this.props.data
    let random = Math.floor(Math.random() * backupQuote.length)
    
    return (
      <div className='movie-list'>
        {maybe ? maybe.map((m, i) => <Movie key={i} data={m} getMovieInfo={this.props.getMovieInfo}/>) : ''}
        {maybe.length === 0 ? <div className='quote'><div><span className='marks'>"</span>{quote? quote[0].quote : backupQuote[random]}<span className='marks'>"</span></div></div> : ''}
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

export default connect(mapStateToProps, mapDispatchToProps)(Maybe);
