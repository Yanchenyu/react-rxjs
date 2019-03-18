import React, { Component, Fragment } from 'react'
import {fromEvent, Subject} from 'rxjs'
import { scan, timeout, map } from 'rxjs/operators'
import { CountView } from './CountView';
import { timer } from 'rxjs/internal/observable/timer';
import { of } from 'rxjs/internal/observable/of';
import { throttleTime } from 'rxjs/internal/operators/throttleTime';
import { buffer } from 'rxjs/internal/operators/buffer';
import { filter } from 'rxjs/internal/operators/filter';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { merge } from 'rxjs/internal/observable/merge';
import { fromPromise } from 'rxjs/internal/observable/fromPromise';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { debounce } from 'rxjs/internal/operators/debounce';
import { interval } from 'rxjs/internal/observable/interval';
import { tap } from 'rxjs/internal/operators/tap';

// class App extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             count: 0,
//             sum: 0
//         }
//         this.subject = new Subject();
        
//         this.observer1 = {
//             next: (num) => {
//                 this.setState({
//                     count: num
//                 })
//             },
//             error: null,
//             complete: () => console.log('complete')
//         }

//         // this.observer2 = (sum) => {
//         //     this.setState({
//         //         sum
//         //     })
//         // };

//         // this.subscribtion1 = this.subject.subscribe(this.observer1);

//         // this.subscribtion2 = this.subject.pipe(
            
//         //     scan((result, inc) => {
//         //         return result + this.state.count
//         //     }, this.state.count)
//         // ).subscribe(this.observer2);

//         // this.subscribtion2.add(this.subscribtion1);
        
//     }

//     handleAdd = () => {
//         const stream$ = of(this.state.count);
//         stream$.pipe(
//             map(val => val + 1)
//         ).subscribe(this.observer1);
//     }

//     handleMinus = () => {
//         this.subject.next(-1);
//     }

//     render() {
//         return (
//             <CountView 
//                 count={this.state.count}
//                 sum={this.state.sum}
//                 handleAdd={this.handleAdd}
//                 handleMinus={this.handleMinus}
//             />
//         )
//     }
// }


const connect = (observable$, initialState, actions) => ((Index) => {
    return class extends Component {

        state = {...initialState}

        componentDidMount() {
            this.subscription = observable$.subscribe((newState) => (
                this.setState({...newState})
            ))
        }

        componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        render() {
            return <Index {...this.state} {...actions(this.state, observable$)} />
        }
    }
})

const count$  = new Subject();

const clean$ = new Subject().pipe(
    mergeMap(
        () => fromPromise(fetch('/movies.json'))
        .pipe(
            tap(val => console.log(val)),
            map(val => val.ok)
        )
    )
).subscribe(val => {
    if (val) {
        updateView$.next({
            count: 'success'
        })
    } else {
        updateView$.next({
            count: 'fail'
        })
    }
});


const initialState = {
    count: 0,
    val: ''
};

const actions = (state = initialState, count$) => {
    return {
        handleAdd: () => count$.next({
            count: state.count + 1
        }),
        handleMinus: () => count$.next({
            count: state.count - 1
        }),
        handleChange: (val) => count$.next({
            val
        }),
        handleClean: () => count$.next({
            count: 0
        })
    }
}

export default connect(count$, initialState, actions)(CountView)
