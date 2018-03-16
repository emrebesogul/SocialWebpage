import React, {Component} from 'react';

import '../style.css';


class Reqister extends Component {
    constructor() {
        super();
        this.pageTitle = "Reqister to Social Webpage"
        document.title = this.pageTitle;
    }

    render() {
        return (
            <div>
                Reqister here...

            </div>
        )
    }
}

export default Reqister;
