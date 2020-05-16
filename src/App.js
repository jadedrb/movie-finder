import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import MovieList from './Components/MovieList';
import Maybe from './Components/Maybe.js';
import Definitely from './Components/Definitely.js';
import MyMovies from './Components/MyMovies';
import Modal from './Components/Modal';
import { connect } from 'react-redux';

class App extends Component {

  constructor() {
    super()
    this.state = {color: 'white', showDates: [], yearOrRating: 'year'}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.randomPageFetch = this.randomPageFetch.bind(this)
    this.categorize = this.categorize.bind(this)
    this.quoteToFillTheSpace = this.quoteToFillTheSpace.bind(this)
    this.toggleHamburger = this.toggleHamburger.bind(this)
    this.clearDates = this.clearDates.bind(this)
  }

  handleChange(e) {
    let value = e.target.value
    let change = e.target.name
    if (change === 'type') {
      this.props.setData(value, 'type')
    } else if (change === 'title') {
      this.props.setData(value, 'title')
    } else if (change === 'year' && this.state.yearOrRating === 'year') {
      this.props.setData(value, 'year')

      let dateCache = this.props.other.dateCache
      if ((value.length >= 4) && (dateCache.hasOwnProperty(value) || value[value.length - 1] === 's')) {
        this.props.setData([], 'data')
        let moviesByDate = []
        if (!isNaN(value.slice(0,4)) && value[value.length - 2] === '0' && value[value.length - 1] === 's') {
          let years = Object.keys(dateCache).filter(y => y.slice(0,3) === value.slice(0,3))
          for (let year of years) {
            let movies = Object.keys(dateCache[year])
            for (let movie of movies) {
              moviesByDate.push(dateCache[year][movie])
            }
          }
          this.setState({showDates: moviesByDate})
          console.log(moviesByDate)
        } else if (!isNaN(value.slice(0,4)) && value[value.length - 1] !== 's') {
          let movies = Object.keys(dateCache[value])
          for (let movie of movies) {
            moviesByDate.push(dateCache[value][movie])
          }
          console.log(moviesByDate)
          this.setState({showDates: moviesByDate})
        }
      } else {
        console.log('ok')
        this.setState({showDates: []})
      }

    } else if (change === 'year' && this.state.yearOrRating === 'rating') {
      let ratingCache = this.props.other.ratingCache
      let moviesByRating = []
      console.log(ratingCache)

      if ((!isNaN(value.slice(0,1))) && ((value.length === 1) || (value[value.length - 1] === '+') || (value[value.length - 1] === '-'))) {
        console.log('yepperrooo')
        this.props.setData([], 'data')
        if (value[value.length - 1] === '+' || value[value.length - 1] === '-') {
          let ratings = value[value.length - 1] === '+' ? Object.keys(ratingCache).filter(r => r >= value.slice(0,1)) : Object.keys(ratingCache).filter(r => r <= value.slice(0,1))
          for (let rating of ratings) {
            let movies = Object.keys(ratingCache[rating])
            for (let movie of movies) {
              moviesByRating.push(ratingCache[rating][movie])
            }
          }
        } else if (ratingCache.hasOwnProperty(value)) {
          let movies = Object.keys(ratingCache[value])
          for (let movie of movies) {
            moviesByRating.push(ratingCache[value.slice(0,1)][movie])
          }
        }
        console.log(moviesByRating)
        moviesByRating.sort((a,b) => Number(b.rating) - Number(a.rating))
        this.setState({showDates: moviesByRating})
      }

    } else if (change === 'year-or-rating') {
      console.log(change, value)
      this.setState({yearOrRating: value})
    }
  }

  clearDates() { this.setState({showDates: []}) }

  randomPageFetch(apiKey, specificPage, movieType, revert = true) {
    let fullUrl = 'https://www.omdbapi.com/?s=' + this.props.other.title + '&page=' + specificPage + movieType + '&apikey=' + apiKey
    console.log(specificPage)
    fetch(fullUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        let checkForPosters;
        if (data.hasOwnProperty('Search')) { checkForPosters = data.Search.some(m => m.Poster !== 'N/A') }
        if (checkForPosters) {
          this.props.setData(data, 'data')
          this.props.setData(specificPage, 'currentPage')
        } else {
          if (revert) {
            console.log('reverting to backup')
            this.props.setData(this.props.other.dataBackup, 'data')
            this.props.setData(1, 'currentPage')
          }
        }
        console.log('we made it')
      })
  }

  handleSubmit(e = false) {
    e && e.preventDefault()
    let maxFetch = 10;
    let specificPage = ''
    {/* let apiKey = '1012861a' BACKUP KEY */}
    let apiKey = '3d7eed43'
    let movieType = '&type=movie'
    let year = ''
    this.setState({showDates: []})

    if (this.props.other.year.length === 4 && !isNaN(year)) {
      year = '&y=' + this.props.other.year
    }

    let fullUrl = 'https://www.omdbapi.com/?s=' + this.props.other.title + movieType + year + '&apikey=' + apiKey


    const attemptRandomMovieSearch = () => {
      let wordBank = this.props.other.wordBank
      let random = Math.floor(Math.random() * wordBank.length)
      let randomWord = wordBank[random]
      console.log(randomWord)
      this.props.setData(randomWord, 'title')
      console.log(this.props.other.wordBank[random])
      fullUrl = 'https://www.omdbapi.com/?s=' + randomWord + movieType + '&apikey=' + apiKey
          /* Word retrieved, look for movies with that word as their title */
          fetch(fullUrl)
            .then(response => response.json())
            .then(data => {
              let pageCount;
              let checkForPosters;
              /* If successful, an object with property Search will come back */
              if (data.hasOwnProperty('Search')) {
                pageCount = Math.ceil(Number(data.totalResults) / 10)
                checkForPosters = data.Search.some(m => m.Poster !== 'N/A')
              }
              specificPage = Math.floor(Math.random() * pageCount) + 1
              /* Fetch again, this time with a random page endpoint */
              if (pageCount && checkForPosters) {
                this.props.setData(data, 'dataBackup')
                this.props.setData(pageCount, 'totalPages')
                this.randomPageFetch(apiKey, specificPage, movieType)
              } else {
              /* If no object with property Search, there was an error. Remove word from wordBank. Start over. */
                maxFetch--
                let wordBankCopy = [...wordBank]
                wordBankCopy.splice(random, 1)
                this.props.setData(wordBankCopy, 'wordBank')
                if (maxFetch) {
                  attemptRandomMovieSearch()
                } else {
                  alert('No movies found. Better luck next time.')
                }
              }
            })
    }


    /* Random Movie selected. Use the random word API to fetch a word */
    if (this.props.other.type === 'random-movie') {
      attemptRandomMovieSearch();
    } else if (this.props.other.type === 'random-page') {
      console.log(this.props.other.type)
      fetch(fullUrl)
        .then(response => response.json())
        .then(data => {
          let pageCount;
          data.hasOwnProperty('Error') ? console.log('Error!!!') : pageCount = Math.ceil(Number(data.totalResults) / 10)
          specificPage = Math.floor(Math.random() * pageCount) + 1
          if (pageCount !== 1 && pageCount > 1) {
            this.props.setData(data, 'dataBackup')
            this.props.setData(pageCount, 'totalPages')
            this.randomPageFetch(apiKey, specificPage, movieType)
          }
        })
    } else {
      let pageCount;
      if (this.props.other.title !== '') {
        console.log('here')
        fetch(fullUrl)
          .then(response => response.json())
          .then(data => {
            if (data.hasOwnProperty('Search')) {
              pageCount = Math.ceil(Number(data.totalResults) / 10)
            }
            specificPage = Math.floor(Math.random() * pageCount) + 1
            this.props.setData(data, 'data')
            this.props.setData(1, 'currentPage')
            this.props.setData(pageCount, 'totalPages')
          });
      }
    }
  }

  switchPage(input) {
    console.log('switchPage')
    let didPageTurn;
    let apiKey = '3d7eed43'
    let movieType = '&type=movie'

    const pageTurn = () => {
      console.log('pageTurn')
      this.props.addInput(input)
    }

    let currentPage = this.props.other.currentPage
    let totalPages = this.props.other.totalPages
    if (input === 1) {
      if (currentPage < totalPages) { pageTurn() }
      didPageTurn = true
      console.log('forward')
    } else {
      if (currentPage > 1) { pageTurn() }
      didPageTurn = true
      console.log('backward')
    }
    if (didPageTurn) { this.randomPageFetch(apiKey, currentPage + input, movieType, false) }
    console.log(this.props.other.currentPage + ' after randomPageFetch')
  }

  categorize(category, movie) {
    let { maybe, definitely, watched } = this.props.other
    let copyDef = [...definitely]
    let copyMay = [...maybe]
    let copyWat = [...watched]

    const checker = (array) => {
      let saveIndexHere;
      return [array.some((m,i) => {
        if (m.imdbID === movie.imdbID) {
          console.log(i + ' is the index')
          saveIndexHere = i
          return true
        }
        return false
      }), saveIndexHere]
    }
/* Checks if a movie is already in another list. If so, remove (splice) */
    if (category === 'maybe' && maybe.every(m => m.imdbID !== movie.imdbID)) {
      let [checkDef, indexDef] = checker(copyDef)
      let [checkWat, indexWat] = checker(copyWat)
      if (checkDef) { copyDef.splice(indexDef, 1) }
      if (checkWat) { copyWat.splice(indexWat, 1) }
      console.log('1')
      this.props.setChoices([[...copyMay, movie], copyDef, copyWat])
    } else if (category === 'definitely' && definitely.every(m => m.imdbID !== movie.imdbID)) {
      let [checkMay, indexMay] = checker(copyMay)
      let [checkWat, indexWat] = checker(copyWat)
      if (checkMay) { copyMay.splice(indexMay, 1) }
      if (checkWat) { copyWat.splice(indexWat, 1) }
      console.log('2')
      this.props.setChoices([copyMay, [...copyDef, movie], copyWat])
    } else if (category === 'watched' && watched.every(m => m.imdbID !== movie.imdbID)) {
      let [checkDef, indexDef] = checker(copyDef)
      let [checkMay, indexMay] = checker(copyMay)
      if (checkDef) { copyDef.splice(indexDef, 1) }
      if (checkMay) { copyMay.splice(indexMay, 1) }
      console.log('3')
      this.props.setChoices([copyMay, copyDef, [...copyWat, movie]])
    } else {
      console.log('should be deleted')
      let [checkDef, indexDef] = checker(copyDef)
      let [checkMay, indexMay] = checker(copyMay)
      let [checkWat, indexWat] = checker(copyWat)
      console.log(checkDef)
      console.log(checkMay)
      console.log(checkWat)
      console.log('^^')
      if (checkDef) { copyDef.splice(indexDef, 1) }
      if (checkMay) { copyMay.splice(indexMay, 1) }
      if (checkWat) { copyWat.splice(indexWat, 1) }
      console.log('4')
      this.props.setChoices([copyMay, copyDef, copyWat])
    }
  }

  quoteToFillTheSpace() {
    fetch('https://thesimpsonsquoteapi.glitch.me/quotes')
      .then(response => response.json())
      .then(data => {
        this.props.setData(data, 'quote')
        console.log(data)
      })
  }

  toggleHamburger() { 
    if (window.innerWidth <= 500) {
      document.getElementById('menu').classList.toggle('change') 
      document.querySelector('.nav').classList.toggle('change') 
      document.getElementById('menu-bg').classList.toggle('change-bg') 
    }
  }

  componentDidMount() {
    console.log('v1.05')
    fetch('https://random-word-api.herokuapp.com/all')
      .then(response => response.json())
      .then(data => {
        let random = Math.floor(Math.random() * this.props.other.wordBank.length)
        this.props.setData(data, 'wordBank')
        console.log(this.props.other.wordBank[random])
      })
  }

  render() {

    let { linkMovie, linkMaybe, linkDefinitely, linkWatched } = this.props.other

    let inputArea = (
      <div className='inputs'>
        <select name='type' onChange={this.handleChange}>
          <option value='not-random'>Most Relevant</option>
          <option value='random-page'>Random Page Results (with your title)</option>
          <option value='random-movie'>Random Movies (with random title)</option>
        </select>
        <form onSubmit={this.handleSubmit}>
          <label>Title: <input type='text' name='title' value={this.props.other.title} onChange={this.handleChange} /></label>
          <label>
            <select name='year-or-rating' onChange={this.handleChange}>
              <option value='year'>Year:</option>
              <option value='rating'>Rating:</option>
            </select> 
            <input type='text' name='year' onChange={this.handleChange} />
          </label>
          {this.state.yearOrRating === 'year' ? <button>SEARCH</button> : ''}
        </form>
      </div>
    )

    let pageScroll = (
      <div className='scroll-container'>
      <div className='scroll'>
        <div onClick={() => this.switchPage(-1)}>Backward</div>
        <span>{`${this.props.other.currentPage} / ${this.props.other.totalPages}`}</span>
        <div onClick={() => this.switchPage(1)}>Forward</div>
      </div>
      </div>
    )

    return (
        <div className='top-area'>
          <Router>
            <nav>
              <div className='nav'>
                <Link style={{color: linkMovie}} className='link' to="/" onClick={this.toggleHamburger}>Movie Finder</Link>
                <Link style={{color: linkMaybe}} className='link' to="/Maybe" onClick={this.toggleHamburger}>Maybe</Link>
                <Link style={{color: linkDefinitely}} className='link' to="/Definitely" onClick={this.toggleHamburger}>Definitely</Link>
                <Link style={{color: linkWatched}} className='link' to="/Watched" onClick={this.toggleHamburger}>Watched</Link>
              </div>
              <div id='menu-bar'>
                <div id='menu' onClick={this.toggleHamburger}>
                  <div id='bar1' className='bar'></div>
                  <div id='bar2' className='bar'></div>
                  <div id='bar3' className='bar'></div>
                </div>
              </div>
              <div id='menu-bg' className='menu-bg'></div>
            </nav>
            <Route exact path='/' render={() => inputArea}/>
            <Switch>
              <Route exact path='/' render={() => <MovieList newQuote={this.quoteToFillTheSpace} showDates={this.state.showDates} clearDates={this.clearDates}/>} />
              <Route path='/Maybe' render={() => <Maybe newQuote={this.quoteToFillTheSpace}/>} />
              <Route path='/Definitely' render={() => <Definitely newQuote={this.quoteToFillTheSpace}/>} />
              <Route path='/Watched' render={() => <MyMovies newQuote={this.quoteToFillTheSpace}/> } />
            </Switch>
            <Route exact path='/' render={() => this.props.data.hasOwnProperty('Search') && this.props.data.Search.length > 0 ? pageScroll : ''}/>
          </Router>
          {this.props.modal ? <Modal getMovieInfo={this.getMovieInfo} categorize={this.categorize} /> : ''}
        </div>
    )
  }
}

/* Creates property keywords for the parts of state you need */
const mapStateToProps = (state) => {
  return {
    data: state.data,
    modal: state.modal,
    other: state
  }
}

/* Wraps the actions and their dispatch into a method */
const mapDispatchToProps = (dispatch) => {
  return {
    setData: (data, prop) => {
      dispatch({
        type: 'SET_DATA',
        payload: [data, prop]
      })
    },
    setChoices: (data) => {
      dispatch({
        type: 'SET_CHOICES',
        payload: data
      })
    },
    addInput: (input) => {
      dispatch({
        type: 'ADD_INPUT',
        payload: input
      })
    }
  }
}

/* connect tells react-redux to connect this component to the store */
export default connect(mapStateToProps, mapDispatchToProps)(App);
