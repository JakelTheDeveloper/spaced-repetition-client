import React, { Component } from 'react'
import config from '../../config'
import token from '../../services/token-service'
import Button from '../../components/Button/Button'
import './LearningRoute.css'

class LearningRoute extends Component {
  constructor(props) {
    super(props)
    this.state = {
      word: [],
      words: [],
      answer: '',
      response: null,
      next: false,
      error: null
    }

    this.handleChange = this.handleChange.bind(this)
  }


  handleChange(event) {
    const value = event.target.value
    this.setState({ ...this.state, [event.target.name]: value })
  }

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language/head`, {
      headers: {
        'authorization': `bearer ${token.getAuthToken()}`,
      },
    }).then((res) => !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json())
      .then(res => this.setState({ word: res }))
      .catch(error => this.setState({ error: error.message }))
  }

  handleSubmit = e => {
    e.preventDefault()
    fetch(`${config.API_ENDPOINT}/language/guess`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `bearer ${token.getAuthToken()}`,
      },
      body: JSON.stringify({ guess: this.state.answer }),
    }).then((res) =>
      !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
    ).then(data => {
      this.setState({ response: data, next: true })
    })
      .catch(err => this.setState({ error: err.message }))
  }

  renderFeedback() {
    let myRes = this.state.response
    let myWord = this.state.word
    return (
      < main className="DisplayFeedback" >
        {(myRes.isCorrect
          ?
          <p>The correct translation
          for {myWord.nextWord} was {myRes.answer} and you chose {this.state.answer}!</p>
          : <p>The correct translation
          for {myWord.nextWord} was {myRes.answer} and you chose {this.state.answer}!</p>
        )
        }
      </main>)
  }

  handleNextWord = () => {
    fetch(`${config.API_ENDPOINT}/language/head`, {
      headers: {
        'authorization': `bearer ${token.getAuthToken()}`,
      },
    }).then((res) => !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json())
      .then(res => this.setState({ word: res, answer: '', next: false}))
      .catch(error => this.setState({ error: error.message }))
  }
  renderResponse() {
    let myRes = this.state.response
    return (
      <main className="DisplayScore">
        <p className ="totalScore">Your total score is: {myRes.totalScore}</p>
        {(myRes.isCorrect
          ?
          <section><h2>You were correct! :D</h2>
            <Button type='button' onClick={this.handleNextWord}>
              Try another word!
       </Button> </section>
          : <section><h2>Good try, but not quite right :(</h2>
            <Button type='button' onClick={this.handleNextWord}>
              Try another word!
       </Button> </section>
        )}

      </main>
    )
  }
  render() {
    let { word } = this.state

    return (
      <section>
        <h1>Translate the word:</h1>
        <span className="spanClass">{word.nextWord}</span>
        {(!this.state.next?<p className="totalScore">Your total score is: {word.totalScore}</p>:<p className="totalScore">Your total score is: {this.state.response.totalScore}</p>)}
        
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="learn-guess-input" className="answer_label">What's the translation for this word?</label> <br />
          <input type="text" value={this.state.answer} id="learn-guess-input" name="answer" onChange={this.handleChange} required />

          <br />
          {(!this.state.next ? <Button type='submit'>
            Submit your answer
        </Button> : <div></div>)}
        </form>
        {(this.state.next ? this.renderResponse() : <div></div>)}
        {(this.state.next ? this.renderFeedback() : <div></div>)}
        <main>
          <p>You have answered this word correctly {word.wordCorrectCount} times.</p><br />
          <p>You have answered this word incorrectly {word.wordIncorrectCount} times.</p>
        </main>
      </section>
    );
  }
}

export default LearningRoute
