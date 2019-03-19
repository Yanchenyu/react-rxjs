import React, { Component } from 'react';
import { CountView } from './CountView';

export default class extends Component {

    state = {
        count: 0,
        val: ''
    }

    handleAdd = () => {
        this.setState({
            count: this.state.count + 1
        })
    }

    handleMinus = () => {
        this.setState({
            count: this.state.count - 1
        })
    }

    handleClean = () => {
        this.setState({
            count: 0
        })
    }

    handleChange = (val) => {
        this.setState({
            val
        })
    }

    render() {
        const {count, val} = this.state;
        return <CountView
            count={count} 
            val={val} 
            handleAdd={this.handleAdd} 
            handleMinus={this.handleMinus}
            handleChange={this.handleChange} 
            handleClean={this.handleClean}
        />
    }
}
