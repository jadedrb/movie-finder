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
  dateCache: {}
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA':
      let [data, property] = action.payload
      let check = property === 'data' && state.data.hasOwnProperty('Search')
      let cache;

      if (check) {
        let addToCache = [...state.data.Search]
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
      break;
    case 'GET_MODAL_INFO':
      state = {
        ...state,
        movieModal: action.payload
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
