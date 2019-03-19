import React, { Component } from 'react';
import { CountView } from './CountView';
import { of } from 'rxjs/internal/observable/of';
import { map, mergeMap } from 'rxjs/operators'
import { filter } from 'rxjs/internal/operators/filter';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';
import { Subject } from 'rxjs';

export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            val: ''
        };
        this.subscriptions = {};
    }

    createStateStream = (type, initialState, operators) => {
        if (!this.subscriptions[type]) {
            this.subscriptions[type] = {
                observable$: of(this.state[initialState]).pipe(...operators),
                observer: {
                    next: (val) => {
                        this.setState({
                            [initialState]: val
                        })
                    }
                }
            };
            const { observable$, observer } = this.subscriptions[type];
            observable$.subscribe(observer);
        } else {
            const { observer } = this.subscriptions[type];
            observer.next(initialState);
        }
        
    }

    componentWillUnmount() {
        Object.values(this.subscriptions).forEach((item) => {
            item[observable$].unsubscribe();
        });
    }

    handleAdd = () => this.createStateStream( 'addCount', 'count', [map(val => val + 1)])

    handleMinus = () => this.createStateStream('count', [map(val => val - 1)])

    handleClean = () => {
        this.createStateStream('count', 
            [mergeMap(
                () => fromPromise(fetch('/movies.json'))
                .pipe(
                    filter(val => !val.ok),
                    map(val => 0)
                )
            )]
        )
    }

    handleChange = (val) => this.createStateStream('val', [map(() => val)])

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

/**
 * 问题1：重复的订阅和退订；
 * 问题2：重复的传入state和operator；
 * 问题3：操作同一个state，没有统一方法
 */

 /**
 * 解决1：相同的动作，一旦订阅，就不会再次订阅，并且只在生命周期末取消订阅；
 * 解决2：将operator统一处理，然后和动作进行映射处理
 */
