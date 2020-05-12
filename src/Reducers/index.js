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
  highscore: [0,0],
  linkMovie: 'white',
  linkMaybe: 'white',
  linkDefinitely: 'white',
  linkWatched: 'white'
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA':
      let [data, property] = action.payload
      state = {
        ...state,
        [property] : data
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
