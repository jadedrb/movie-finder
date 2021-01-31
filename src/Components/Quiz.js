import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setDataAc } from '../Actions'

class Quiz extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: [
        ['Year','Which of these movies was released in X?','Title',1],
        ['Title','What year was X released?','Year',2],
        ['Title','Who directed X?','Director',3],
        ['Director','What movie did X direct?','Title',4],
        ['Plot','What movie does this plot line belong to?','Title',5],
        ['Title','What genre is X?','Genre',6],
        ['Genre','Which of these movies is X?','Title',7],
			  ['Actors','X starred in what movie?','Title',8],
        ['Title','Who acted in X?','Actors',9],
        ['Runtime','Which of these movies is the shortest?','Title',10],
        ['Runtime','Which movie is the longest?','Title',11],
        ['BoxOffice','Which movie made the most money?','Title',12],
        ['BoxOffice','What movie made the least money?','Title',13],
				['imdbRating','Which movie received the best rating?','Title',14],
        ['imdbRating','Which movie received the worst rating?','Title',15],
        ['imdbRating','Which movie received a rating of X?','Title',19],
        ['Country','Which movie was not made strictly in the USA?','Title',16],
        ['Country','Which movie was made in X?','Title',17],
        ['Awards','Which movie has X?','Title',18]
      ],
      qNum: 0,
      quiz: false,
      question: [],
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      option5: '',
      answer: [],
      points: 1,
      waitForChange: false,
      plotLine: '',
      optionColor: ['default', 'default', 'default', 'default', 'default'],
      noRepeatedQuestions: ''
    }
    this.handleClick = this.handleClick.bind(this)
    this.quizStart = this.quizStart.bind(this)
    this.handleAnswer = this.handleAnswer.bind(this)
  }

  handleClick() {
    this.setState({quiz: !this.state.quiz})
    console.log('handleClick')
    this.quizStart()
  }

  quizStart() {
    console.log('quizStart')
    let movies = this.props.data
    let answer, wrongAnswerOne, wrongAnswerTwo, wrongAnswerThree, wrongAnswerFour;

    const randomNum = (array) => Math.floor(Math.random() * array.length)

    const lookForQuestion = () => {
      console.log('lookForQuestion')
      let numAnswers = movies.length < 5 ? movies.length : 5
      let question = this.state.questions[randomNum(this.state.questions)]

      if (question[3] === this.state.noRepeatedQuestions[3] && this.state.noRepeatedQuestions !== 5) {
        question = this.state.questions[4]
        console.log('repeated')
      }

      let [ qProp ] = question
      let checkPotentialQuestion = movies.filter(m => m[qProp] !== 'N/A')
      if (qProp === 'Country' && !checkPotentialQuestion.some(m => m[qProp] !== 'USA')) {
        checkPotentialQuestion = []
      }
      if (movies.length < 5 && checkPotentialQuestion.length >= movies.length && movies.length > 0) {
        while (numAnswers) {
          let itemSet = setAnswers(checkPotentialQuestion, qProp, numAnswers)
          checkPotentialQuestion.splice(itemSet, 1)
          numAnswers--
        }
        return question
      } else if (movies.length >= 5 && checkPotentialQuestion.length >= 5) {
        while (numAnswers) {
          let itemSet = setAnswers(checkPotentialQuestion, qProp, numAnswers)
          checkPotentialQuestion.splice(itemSet, 1)
          numAnswers--
        }
        return question
      } else {
        /* Now any lookForQuestions on the call stack will wait for a return of 'question' */
        return lookForQuestion()
      }
    }

    /* setAnswers returns an random index while also setting every wrong and right answer */
    const setAnswers = (checkPotentialQuestion, qProp, whichAnswer) => {
      let randomIndex = randomNum(checkPotentialQuestion)
      switch (whichAnswer) {
        case 5:
        /* Returns array. Example: [89 mins, {movie object}] */
          wrongAnswerFour = [checkPotentialQuestion[randomIndex][qProp],
          checkPotentialQuestion[randomIndex]]
          break;
        case 4:
          wrongAnswerThree = [checkPotentialQuestion[randomIndex][qProp],
          checkPotentialQuestion[randomIndex]]
          break;
        case 3:
          wrongAnswerTwo = [checkPotentialQuestion[randomIndex][qProp],
          checkPotentialQuestion[randomIndex]]
          break;
        case 2:
          wrongAnswerOne = [checkPotentialQuestion[randomIndex][qProp],
          checkPotentialQuestion[randomIndex]]
          break;
        case 1:
          answer = [checkPotentialQuestion[randomIndex][qProp],
          checkPotentialQuestion[randomIndex]]
          break;
        default:
          console.log('error')
      }
      return randomIndex
    }
    /* Returns array. Example: ['Runtime', 'Which is shortest?', 'Title', 10]*/
    let actualQuestion = lookForQuestion()
    let answerArray = [answer, wrongAnswerOne, wrongAnswerTwo, wrongAnswerThree, wrongAnswerFour]

    /* These make it so every answer randomly populates an option */
    let answerIndex = randomNum(answerArray)
    this.setState({ question: actualQuestion, answer: answer, option1: answerArray[answerIndex], noRepeatedQuestions: actualQuestion })
    answerArray.splice(answerIndex, 1)

    answerIndex = randomNum(answerArray)
    this.setState({ option2: answerArray[answerIndex] })
    answerArray.splice(answerIndex, 1)

    answerIndex = randomNum(answerArray)
    this.setState({ option3: answerArray[answerIndex] })
    answerArray.splice(answerIndex, 1)

    answerIndex = randomNum(answerArray)
    this.setState({ option4: answerArray[answerIndex] })
    answerArray.splice(answerIndex, 1)

    answerIndex = randomNum(answerArray)
    this.setState({ option5: answerArray[answerIndex] })
    answerArray.splice(answerIndex, 1)

  }

  handleAnswer(answer, type, correct, colorIndex) {
    let { waitForChange } = this.state
    let [ , aObject ] = this.state.answer
    let [ aProp ] = this.state.question
    console.log(answer)
    if (answer[0] === '$') {
      answer = answer.split('$').join('').split(',').join('')
    }
    answer = answer.split(' min')[0]

    /* The plot line would disappear during timeOut re-render. Potential fix */
    const preservePlotline = () => {
      let plotLine = document.getElementsByClassName('plot-line')
      if (plotLine.length > 0) {
        return plotLine[0].innerText.split('...').join('')
      }
      return ''
    }

    const nextQuestion = () => {
      let optionColors = [...this.state.optionColor]
      optionColors[colorIndex] = 'lime'
      this.setState({
        optionColor: optionColors,
        waitForChange: true,
        plotLine: preservePlotline()
      })
      setTimeout(() => {
        optionColors[colorIndex] = 'default'
        this.setState(prevState => {
          return {
            points: prevState.points + 1,
            optionColor: optionColors,
            waitForChange: false
          }
        })
        this.quizStart()
      }, 1000)
    }
    console.log(aObject[aProp])
    console.log(answer)
    console.log(type)
    console.log('^ aObject[aProp], answer, type')
    /* waitForChange prevents the user from clicking more than one option during setTimeout */
    if (!waitForChange) {
      if(aObject[aProp] === answer && type === 'other') {
        nextQuestion()
      } else if (correct === answer && type === 'number') {
        nextQuestion()
      } else if (answer !== 'USA' && type === 'usa') {
        nextQuestion()
      } else if (aObject[aProp] === answer && type === 'country') {
        nextQuestion()
      } else {
        let optionColors = [...this.state.optionColor]
        optionColors[colorIndex] = 'red'
        this.setState({
          optionColor: optionColors,
          waitForChange: true,
          plotLine: preservePlotline()
        })
        setTimeout(() => {
          /* Check for highscore first */
          let { watched, highscore } = this.props.other
          let { points } = this.state
          let [ answerTotal, movieTotal] = highscore
          if (watched.length === movieTotal && points-1 > answerTotal) {
            this.props.setData([points-1, watched.length], 'highscore')
          } else if (watched.length > movieTotal && points-1 >= 1) {
            this.props.setData([points-1, watched.length], 'highscore')
          }
          optionColors[colorIndex] = 'default'
          this.setState({
            quiz: !this.state.quiz,
            points: 1,
            optionColor: optionColors,
            waitForChange: false
          })
        }, 2500)
      }
    }
  }

  componentDidUpdate() {
    if (this.state.quiz) {
      let movieListSize = document.querySelector('.movie-list')
      let questionBlockSize = document.querySelector('.question-block')
      if (questionBlockSize.offsetHeight !== movieListSize.offsetHeight) questionBlockSize.style.height = `${movieListSize.offsetHeight}px`
      console.log(questionBlockSize.offsetHeight !== movieListSize.offsetHeight)
      console.log(movieListSize.offsetHeight)
      console.log(questionBlockSize.offsetHeight)
      console.log(questionBlockSize.style.height)
    }
  }

  render() {
    let { option1, option2, option3, option4, option5, optionColor, waitForChange } = this.state
    let [ opOneColor, opTwoColor, opThreeColor, opFourColor, opFiveColor ] = optionColor
    let [ qProp, question, aProp ] = this.state.question
    let [ answerValue, answerObj ] = this.state.answer
    let [ answerTotal, movieTotal ] = this.props.other.highscore
    let correctAnswer;
    let type = 'other'

    if (question) {
      correctAnswer = answerObj[aProp]
      
      const sortingNumberAnswers = () => {
        let sortThis = []
        option1 && sortThis.push(option1[1][qProp])
        option2 && sortThis.push(option2[1][qProp])
        option3 && sortThis.push(option3[1][qProp])
        option4 && sortThis.push(option4[1][qProp])
        option5 && sortThis.push(option5[1][qProp])
        if (typeof sortThis[0] === 'string') {
          if (sortThis[0][0] === '$') {
            /* Turns '$100,000' to 100000 */
            return sortThis.map(money => {
              return money.split('$').join('').split(',').join('')
            })
          }
          /* Turns '120 min' to '120' */
          return sortThis.map(s => s.split(' min')[0])
        }
        return sortThis
      }

      if (question.includes('released') ||
          question.includes('direct') ||
          question.includes('genre') ||
          question.includes('movies is X') ||
          question.includes('star') ||
          question.includes('acted') ||
          question.includes('movie has') || 
          question.includes('rating of')) {
  
        let [ qPieceOne, qPieceTwo ] = question.split('X')
        question = `${qPieceOne} ${answerValue} ${qPieceTwo}`
      } else if (question.includes('shortest') ||
                 question.includes('least money') ||
                 question.includes('worst rating')) {
        let sortThis = sortingNumberAnswers()
        correctAnswer = sortThis.filter(m => m !== 'N/A').sort((a,b) => a - b)[0]
        type = 'number'
      } else if (question.includes('longest') ||
                 question.includes('most money') ||
                 question.includes('best rating')) {
        let sortThis = sortingNumberAnswers()
        correctAnswer = sortThis.filter(m => m !== 'N/A').sort((a,b) => b - a)[0]
        type = 'number'
      } else if (question.includes('plot line')) {
        let qPieceOne = question
        let slicePoint = Math.floor(Math.random() * answerValue.length)
        let plotLineSentence;
        if (!waitForChange) {
          plotLineSentence = answerValue.slice(slicePoint).length > 40 ? answerValue.slice(slicePoint, slicePoint + 40) : answerValue.slice(0, 40)
        } else {
          plotLineSentence = this.state.plotLine
        }
        question = (
          <div>
            {qPieceOne} <br />
            <span className='plot-line'>...{plotLineSentence}...</span>
          </div>
        )
      } else if (question.includes('strictly')) {
        type = 'usa'
      } else if (question.includes('made in')) {
        let [ qPieceOne ] = question.split('X')
        question = `${qPieceOne} ${answerValue}?`
        type = 'country'
      }
    }

    let clearColor = {}

    const setColor = (color) => {
      return {
        backgroundColor: color,
        opacity: .4
      }
    }

    if (!this.state.quiz) {
      return (
        this.props.data.length > 2 ? <div onClick={this.handleClick} className='quiz-button'>Quiz!</div> : ''
      )
    } else {
      return (
        <div className='quiz'>
          <h1>Question {this.state.points}: </h1>
          <h3>{question}</h3>
          <ul>
            {option1 ? <li style={opOneColor === 'default' ? clearColor : setColor(opOneColor)} onClick={() => this.handleAnswer(option1[1][qProp], type, correctAnswer, 0)}>{option1[1][aProp]}</li> : ''}
            {option2 ? <li style={opTwoColor === 'default' ? clearColor : setColor(opTwoColor)} onClick={() => this.handleAnswer(option2[1][qProp], type, correctAnswer, 1)}>{option2[1][aProp]}</li> : ''}
            {option3 ? <li style={opThreeColor === 'default' ? clearColor : setColor(opThreeColor)} onClick={() => this.handleAnswer(option3[1][qProp], type, correctAnswer, 2)}>{option3[1][aProp]}</li> : ''}
            {option4 ? <li style={opFourColor === 'default' ? clearColor : setColor(opFourColor)} onClick={() => this.handleAnswer(option4[1][qProp], type, correctAnswer, 3)}>{option4[1][aProp]}</li> : ''}
            {option5 ? <li style={opFiveColor === 'default' ? clearColor : setColor(opFiveColor)} onClick={() => this.handleAnswer(option5[1][qProp], type, correctAnswer, 4)}>{option5[1][aProp]}</li> : ''}
          </ul>
          <div className='high-score'>{answerTotal ? `HIGHSCORE: ${answerTotal} CORRECT WITH ${movieTotal} MOVIES` : ''}</div>
          <div className='question-block'></div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  other: state
})

const mapDispatchToProps = (dispatch) => ({
  setData: (data, prop) => dispatch(setDataAc([data, prop]))
})

export default connect(mapStateToProps, mapDispatchToProps)(Quiz);
