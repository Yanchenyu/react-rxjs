import React, { Component } from 'react';
import { map, mergeMap } from 'rxjs/operators'
import { filter } from 'rxjs/internal/operators/filter';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/internal/operators/throttleTime';
import { scan } from 'rxjs/internal/operators/scan';
import { CountView } from './CountView';

export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            val: ''
        };
        this.subscriptions = {};
    }

    subscriptionCreator = (subscription) => {
        if (!this.subscriptions[subscription]) {
            this.subscriptions[subscription] = new Subject();
        }
        return this.subscriptions[subscription]
    }

    observerCreator = (initialState) => ({
        next: (val) => {
            this.setState({
                [initialState]: val
            })
        }
    })

    componentDidMount() {

        this.subscriptionCreator('subscription1').pipe(
            throttleTime(500),
        ).subscribe(this.observerCreator('val'));

        this.subscriptionCreator('subscription2').pipe(
            scan((result, insec) => {
                return result + insec
            })
        ).subscribe(this.observerCreator('count'))

        this.subscriptionCreator('subscription3').pipe(
            mergeMap(
                () => fromPromise(fetch('/movies.json'))
                    .pipe(
                        filter(val => !val.ok),
                        map(val => 0)
                    )
            )
        ).subscribe(this.observerCreator('count'));

    }

    unsubscribe = () => {
        Object.values(this.subscriptions).forEach((item) => item.unsubscribe());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleAdd = () => this.subscriptions['subscription2'].next(1)

    handleMinus = () => this.subscriptions['subscription2'].next(-1)

    handleClean = () => this.subscriptions['subscription3'].next()

    handleChange = (val) => this.subscriptions['subscription1'].next(val)

    render() {
        const { count, val } = this.state;
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
