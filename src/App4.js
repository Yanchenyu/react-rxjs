import React, { Component } from 'react';
import { of } from 'rxjs/internal/observable/of';
import { map, mergeMap } from 'rxjs/operators'
import { filter } from 'rxjs/internal/operators/filter';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/internal/operators/throttleTime';
import { tap } from 'rxjs/internal/operators/tap';
import { scan } from 'rxjs/internal/operators/scan';

const add = 'ADD';
const minus = 'MINUS';
const clean = 'CLEAN';
const onchange = 'ONCHANGE';

const CountView = ({ count, count2, val, handleAdd, handleMinus, handleChange, handleClean }) => (
    <div>
        <p>count: {count}</p>
        <p>count2: {count2}</p>
        <p>val: {val}</p>
        <button onClick={handleAdd}>+</button>
        <button onClick={handleMinus}>-</button>
        <input value={val} placeholder="请输入" onChange={(e) => handleChange(e.target.value)} />
        <button onClick={handleClean}>清0</button>
    </div>
)

export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            count2: 0,
            val: ''
        };
    }

    componentDidMount() {
        this.subscription1 = new Subject();
        this.subscription2 = new Subject();
        this.subscription3 = new Subject();

        this.subscription1.pipe(
            throttleTime(200),
        ).subscribe(val => {
            this.setState({ val })
        });

        this.subscription2.pipe(
            scan((result, insec) => {
                return result + insec
            })
        ).subscribe(val => {
            this.setState({ count: val })
        })

        this.subscription2.pipe(
            scan((result, insec) => {
                return result + insec
            }),
            map(val => val * val)
        ).subscribe(val => {
            this.setState({ count2: val })
        });

        this.subscription3.pipe(
            mergeMap(
                () => fromPromise(fetch('/forbidClean.json'))
                    .pipe(
                        filter(val => !val.ok),
                        map(val => 0)
                    )
            )
        ).subscribe((val) => {
            this.setState({
                count: val,
                count2: val
            })
        });

    }

    componentWillUnmount() {
        this.subscription1.unsubscribe();
        this.subscription2.unsubscribe();
        this.subscription3.unsubscribe();
    }

    handleAdd = () => this.subscription2.next(1)

    handleMinus = () => this.subscription2.next(-1)

    handleClean = () => this.subscription3.next()

    handleChange = (val) => this.subscription1.next(val)

    render() {
        const { count, count2, val } = this.state;
        return <CountView
            count={count}
            count2={count2}
            val={val}
            handleAdd={this.handleAdd}
            handleMinus={this.handleMinus}
            handleChange={this.handleChange}
            handleClean={this.handleClean}
        />
    }
}

/**
 * action => state => stream => state => setState => view
 */
