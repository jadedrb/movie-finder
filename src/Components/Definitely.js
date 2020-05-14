import React, { Component } from 'react';
import Movie from './Movie'
import { connect } from 'react-redux';

class Definitely extends Component {
  componentDidMount() {
    let { definitely, linkDefinitely } = this.props.data
    definitely.length === 0 && this.props.newQuote()
    let linkDefinitelyCopy = [...linkDefinitely]
    linkDefinitelyCopy = 'midnightblue'
    this.props.setData(linkDefinitelyCopy, 'linkDefinitely')
  }
  componentWillUnmount() {
    let { linkDefinitely } = this.props.data
    let linkDefinitelyCopy = [...linkDefinitely]
    linkDefinitelyCopy = 'white'
    this.props.setData(linkDefinitelyCopy, 'linkDefinitely')
  }
  render() {
    let { definitely, quote, backupQuote } = this.props.data
    let random = Math.floor(Math.random() * backupQuote.length)
    
    return (
      <div className='movie-list'>
        {definitely ? definitely.map((m, i) => <Movie key={i} data={m} getMovieInfo={this.props.getMovieInfo}/>) : ''}
        {definitely.length === 0 ? <div className='quote'><div><span className='marks'>"</span>{quote? quote[0].quote : backupQuote[random]}<span className='marks'>"</span></div></div> : ''}
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

export default connect(mapStateToProps, mapDispatchToProps)(Definitely);
