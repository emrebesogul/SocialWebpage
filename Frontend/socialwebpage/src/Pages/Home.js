import React, {Component} from 'react';

import GetData from '../API/GetData';

class Home extends Component {
    constructor() {
        super();
        this.pageTitle = "Social Webpage Home"
        document.title = this.pageTitle;
    }

    render() {
        return (
            <div>
                <h1>Hello</h1>

                <GetData />
            </div>
        )
    }
}

export default Home;
