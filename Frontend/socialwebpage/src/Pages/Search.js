import React, {Component} from 'react';
import { Image } from 'semantic-ui-react'
import SidebarProfile from '../Components/Sidebar'
import {checkSession} from '../API/GET/GetMethods';
import SearchBar from '../Components/SearchBar';
import '../profileStyle.css';

class Search extends Component {
    constructor() {
        super();
        this.apiCheckSession = "/checkSession"

        this.pageTitle = "Search - Ivey"
        document.title = this.pageTitle;
    }

    componentDidMount() {
        this.checkThisSession();
    }

    async checkThisSession() {
        const response = await checkSession(this.apiCheckSession);
        if(response.message !== "User is authorized") {
            this.setState({redirectToLogin: true})
        }
    }

    render() {
        return (
        <div>
            <div className="feed">
            <SidebarProfile />

            <div id="search" >
              <Image id="search-logo" className="main-logo" src="/assets/images/logo_high_res.png" />
              <SearchBar />
            </div>
          </div>
      </div>
        )
    }
}

export default Search;
