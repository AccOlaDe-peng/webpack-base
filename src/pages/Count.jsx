import React, {Component} from 'react';

export default class Count extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
        this.arr = [];
    }

   


    closures() {
      let test = new Array(1000).fill('isboyjc')

      return function () {
        return test
      }
    }

    handleClick() {
        this.arr.push(this.closures())
        this.arr.push(this.closures())
        console.log(this.arr.length);
        this.setState({
            count: ++this.state.count
        });
    }

    render() {
        return (
            <div>
                当前count值：{this.state.count}<br/>
                <button style={{border:'1px dashed blue'}} onClick={() => this.handleClick()}>增加1</button>
            </div>
        )
    }
}