import React, { Component } from 'react'
import config from '../../config'
import Words from '../DashboardRoute/Words'
import { Link } from 'react-router-dom'
import token from '../../services/token-service'
import Button from '../../components/Button/Button'
class DashboardRoute extends Component {
  state = {
    data: [],
    language:[],
    words:[]
  }
  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language`, {
      headers: {
        'authorization': `bearer ${token.getAuthToken()}`,
      },
    }).then((res) => !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json())
      .then(res => this.setState({ data: res ,language:res.language,words:res.words}))
      .catch(error => this.setState({ error: error.message }))
  }

  render() {
    let language = this.state.language
    let words = this.state.words

    console.log("lan:",language,"words",words)
    return (
      <section>
       
        <h2> Title: Dashboard</h2>
        <h2>Language: {language.name}</h2>
        <h2>Total correct answers: {language.total_score}</h2>
        <div className = "btnHolder"><Link to = '/learn'><Button>Start practicing</Button></Link></div>
        <h3>Words to practice</h3>
       
        {words.map(data =>
          <Words
            id={data.id}
            key={data.id}
            language_id={data.language_id}
            original={data.original}
            translation={data.translation}
            next={data.next}
            correct_count={data.correct_count}
            incorrect_count={data.incorrect_count}
            mem_val={data.memory_value}
          />
          )}
      </section>
    );
  }
}

export default DashboardRoute
