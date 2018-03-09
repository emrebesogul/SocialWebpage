import React, {Component} from 'react';

class Home extends Component {
    constructor() {
        super();
        this.pageTitle = "Social Webpage Home"
        document.title = this.pageTitle;
    }

    render() {
        return (
            <div>
                <h1>Hellloooooooo</h1>
            </div>
        )
    }
}

export default Home;
