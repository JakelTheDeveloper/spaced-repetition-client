import React, { Component } from 'react'
import './Words.css'
class Words extends Component {

    render(props) {
        return (
            <li className = 'words'>
                <h4>{this.props.original}</h4>
                {/* Translation: {this.props.translation}<br /> */}
                correct answer count: {this.props.correct_count}<br />
                incorrect answer count: {this.props.incorrect_count}
            </li>
        )
    }
}
export default Words