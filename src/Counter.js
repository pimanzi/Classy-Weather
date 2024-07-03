import React from 'react';

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 5 };
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handledecrement = this.handledecrement.bind(this);
  }

  handleIncrement() {
    this.setState((currentState) => {
      return { count: currentState.count + 1 };
    });
  }

  handledecrement() {
    this.setState((currentState) => {
      return { count: currentState.count - 1 };
    });
  }
  render() {
    const date = new Date('07/12/2024');
    date.setDate(date.getDate() + this.state.count);
    return (
      <div>
        <button onClick={this.handledecrement}>-</button>
        <span>
          {date.toDateString()}[{this.state.count}]
        </span>
        <button onClick={this.handleIncrement}>+</button>
      </div>
    );
  }
}

export default Counter;
