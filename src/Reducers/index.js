const initialState = {
  modal: false,
  movieModal: [],
  maybe: [],
  definitely: [],
  watched: [],
  currentPage: '',
  totalPages: '',
  type: 'not-random',
  title: '',
  year: '',
  data: [],
  dataBackup: [],
  wordBank: '',
  isLoaded: false,
  quote: '',
  backupQuote: [
    "Frankly, my dear, I don't give a damn.", 
    "Here's looking at you, kid.", 
    "May the Force be with you.", 
    "Why so serious?", 
    "There's no place like home", 
    "I'm walking here! I'm walking here!", 
    "I'll be back.", 
    "Today, I consider myself the luckiest man on the face of the earth."],
  highscore: [0,0],
  linkMovie: 'white',
  linkMaybe: 'white',
  linkDefinitely: 'white',
  linkWatched: 'white',
  dateCache: {},
  ratingCache: {}
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA':
      let [data, property] = action.payload
      let check = property === 'data' && state.data.hasOwnProperty('Search')
      let cache;
      console.log(action.payload)

      if (check) {
        console.log('reduc')
        let addToCache = [...state.data.Search].filter(m => m.Poster !== 'N/A')
        console.log(addToCache)
        cache = {...state.dateCache}
        for (let movie of addToCache) {
          let movieInfo = {title: movie.Title, id: movie.imdbID, year: movie.Year}
          if (cache.hasOwnProperty(movie.Year)) {
            if (cache[movie.Year].hasOwnProperty(movie.Title)) cache[movie.Year][movie.Title] = movieInfo
            else cache[movie.Year] = {...cache[movie.Year], [movie.Title]: movieInfo}
          } else {
            cache[movie.Year] = { [movie.Title]: movieInfo }
          }
        }
      }
 
      state = {
        ...state,
        [property] : data,
        dateCache: check ? cache : state.dateCache
      }
      console.log(property)
      break;
    case 'GET_MODAL_INFO':
      let movie = action.payload
      let rating, rCache;
      let check2 = movie.hasOwnProperty('imdbRating')

      if (check2) {
        rating = {title: movie.Title, rating: movie.imdbRating, id: movie.imdbID}
        let fRating = Math.floor(movie.imdbRating)
        console.log(fRating)
        rCache = {...state.ratingCache}
        if (rCache.hasOwnProperty(fRating)) {
          if (rCache[fRating].hasOwnProperty(movie.Title)) rCache[fRating][movie.Title] = rating
          else rCache[fRating] = {...rCache[fRating], [movie.Title]: rating}
        } else {
          rCache[fRating] = { [movie.Title]: rating }
        }
      }

      console.log(rating)
      console.log(rCache)

      state = {
        ...state,
        movieModal: action.payload,
        ratingCache: check2 ? rCache : state.ratingCache
      }
      break;
    case 'TOGGLE_MODAL':
      state = {
        ...state,
        modal: !state.modal
      }
      break;
    case 'SET_CHOICES':
      let [ maybe, definitely, watched ] = action.payload
      state = {
        ...state,
        maybe: maybe,
        definitely: definitely,
        watched: watched
      }
      break;
    case 'ADD_INPUT':
      state = {
        ...state,
        currentPage: state.currentPage + action.payload
      }
      break;
    default:
      break;
  }
  return state
}
