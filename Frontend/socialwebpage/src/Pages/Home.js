import React, {Component} from 'react';
import { Button } from 'semantic-ui-react'

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
                <GetData />
            </div>
        )
    }
}

export default Home;
