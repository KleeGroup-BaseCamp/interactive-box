import React from 'react';
import ReactDOM from 'react-dom';

const MyFirstComponent = React.createClass({
    render() {
        return (
            <div>
                <h1>Hello !</h1>
                <p>This is a first React component :)</p>
            </div>
        );
    }
});

ReactDOM.render(<MyFirstComponent/>, document.getElementById('interactive-box'));
