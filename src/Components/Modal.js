import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

const modal = document.getElementById('modal-root')

class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = { more: false, hover: false }
    this.moreInfo = this.moreInfo.bind(this)
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.windowHeightChange = this.windowHeightChange.bind(this)
  }

  el = document.createElement('modal-root')

  handleMouseOver() { this.setState({hover: true}) }

  handleMouseLeave() { this.setState({hover: false}) }

  moreInfo() { 
    this.setState({ more: !this.state.more }) 
    setTimeout(() => this.windowHeightChange(), 10)
  }

  windowHeightChange() { 
    let modalSize = document.querySelector('.modal-info-container').offsetHeight

    if (window.innerHeight - 40 <= modalSize) document.querySelector('.modal-info-container').style.height = `${window.innerHeight - 40}px`
    else if (window.innerHeight + 40 >= modalSize && modalSize < 456) document.querySelector('.modal-info-container').style.height = `${window.innerHeight + 40}px`
  }

  componentDidMount() {
    modal.appendChild(this.el)
    window.addEventListener('resize', this.windowHeightChange)
    setTimeout(() => this.windowHeightChange(), 10)
  }

  componentWillUnmount() {
    modal.removeChild(this.el)
    window.removeEventListener('resize', this.windowHeightChange)
  }

  render() {
    let movie = this.props.data.movieModal
    let { maybe, definitely, watched } = this.props.data

    let buttons = (
      <div className='modal-info-buttons' style={{backgroundColor: this.state.more ? 'midnightblue' : 'black'}}>
        <div className='bu' onClick={this.props.toggleModal}>Close</div>
        <div className='bu' onClick={this.moreInfo}>{this.state.more ? 'Less Info' : 'More Info'}</div>
      </div>
    )

    let more = (
      <div>
      <div className='more-info'>
        {movie.Writer !== 'N/A' ? <span>writer<br /></span>  : ''}
        {movie.Writer !== 'N/A' ? <div>{movie.Writer}<br /><br /></div> : ''}
        {movie.Actors !== 'N/A' ? <span>actors<br /></span>  : ''}
        {movie.Actors !== 'N/A' ? <div>{movie.Actors}<br /><br /></div> : ''}
        {movie.Awards !== 'N/A' ? <span>awards<br /></span>  : ''}
        {movie.Awards !== 'N/A' ? <div>{movie.Awards}<br /><br /></div> : ''}
        {movie.BoxOffice !== 'N/A' ? <span>box office<br /></span>  : ''}
        {movie.BoxOffice !== 'N/A' ? <div>{movie.BoxOffice}<br /><br /></div> : ''}
        {movie.imdbRating !== 'N/A' ? <span>rating<br /></span>  : ''}
        {movie.imdbRating !== 'N/A' ? <div>{movie.imdbRating}<br /><br /></div> : ''}
        {movie.Language !== 'N/A' ? <span>language<br /></span>  : ''}
        {movie.Language !== 'N/A' ? <div>{movie.Language}<br /><br /></div> : ''}
        {movie.Country !== 'N/A' ? <span>country<br /></span>  : ''}
        {movie.Country !== 'N/A' ? <div>{movie.Country}<br /><br /></div> : ''}
        {movie.Runtime !== 'N/A' ? <span>runtime<br /></span>  : ''}
        {movie.Runtime !== 'N/A' ? <div>{movie.Runtime}<br /><br /></div> : ''}
      </div>
      {buttons}
      </div>
    )

    return ReactDOM.createPortal(
      <div className='modal'>
        <div className='modal-info-container'>
          <div className='modal-info-split'>
            <div className='image-container' onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>
              <img src={movie.Poster} alt='WOW'/>
              <div className='bookmark' style={{visibility: this.state.hover ? 'visible' : 'hidden'}}>
                <span className='would-you'>Would you watch this?</span>
                <span style={{color: maybe.some(m => m.imdbID === movie.imdbID) ? 'blue' : 'white'}} name='maybe' className='span' onClick={() => this.props.categorize('maybe', movie)}>MAYBE</span>
                <span style={{color: definitely.some(m => m.imdbID === movie.imdbID) ? 'blue' : 'white'}} name='definitely' className='span' onClick={() => this.props.categorize('definitely', movie)}>DEFINITELY</span>
                <span style={{color: watched.some(m => m.imdbID === movie.imdbID) ? 'blue' : 'white'}} name='watched' className='span' onClick={() => this.props.categorize('watched', movie)}>WATCHED</span>
              </div>
            </div>
            <div className='modal-info'>
              {movie.Title !== 'N/A' ? <span>title<br /></span>  : ''}
              {movie.Title !== 'N/A' ? <div>{movie.Title}<br /><br /></div> : ''}
              {movie.Year !== 'N/A' ? <span>year<br /></span>  : ''}
              {movie.Year !== 'N/A' ? <div>{movie.Year}<br /><br /></div> : ''}
              {movie.Director !== 'N/A' ? <span>director<br /></span>  : ''}
              {movie.Director !== 'N/A' ? <div>{movie.Director}<br /><br /></div> : ''}
              {movie.Genre !== 'N/A' ? <span>genre<br /></span>  : ''}
              {movie.Genre !== 'N/A' ? <div>{movie.Genre}<br /><br /></div> : ''}
              {movie.Plot !== 'N/A' ? <span>plot<br /></span>  : ''}
              {movie.Plot !== 'N/A' ? <div style={this.state.more ? {fontSize: '12pt'} : undefined}>{movie.Plot && !this.state.more ? movie.Plot.split('').slice(0, 200).join('') + ' ...': movie.Plot}<br /><br /></div> : ''}
            </div>
          </div>
          {!this.state.more ? buttons : more}
        </div>
        <div className='extra-opacity'></div>
      </div>,
      this.el)
  }
}

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setData: (data) => {
      dispatch({
        type: 'SET_DATA',
        payload: data
      })
    },
    toggleModal: () => {
      dispatch({type: 'TOGGLE_MODAL'})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
