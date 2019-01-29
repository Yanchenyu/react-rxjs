import React, { Component, Fragment } from 'react'
import {fromEvent, Subject} from 'rxjs'
import { scan, timeout } from 'rxjs/operators'
import { CountView } from './CountView';
import { timer } from 'rxjs/internal/observable/timer';

export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            sum: 0
        }
        this.subject = new Subject();
        
        this.observer1 = {
            next: (num) => {
                this.setState({
                    count: this.state.count + num
                })
            },
            error: null,
            complete: () => console.log('complete')
        }

        this.observer2 = (sum) => {
            this.setState({
                sum
            })
        };

        this.subscribtion1 = this.subject.subscribe(this.observer1);

        this.subject.timer(1000);

        this.subscribtion2 = this.subject.pipe(
            
            scan((result, inc) => {
                return result + this.state.count
            }, this.state.count)
        ).subscribe(this.observer2);

        this.subscribtion2.add(this.subscribtion1);
        
    }

    handleAdd = () => {
        this.subject.next(1);
    }

    handleMinus = () => {
        this.subject.next(-1);
    }

    render() {
        return (
            <CountView 
                count={this.state.count}
                sum={this.state.sum}
                handleAdd={this.handleAdd}
                handleMinus={this.handleMinus}
            />
        )
    }
}
