import React, {Component} from 'react';
import { Image } from 'semantic-ui-react'
import SidebarProfile from '../Components/Sidebar'
import { checkAuthorization } from '../API/GET/GetMethods';
import SearchBar from '../Components/SearchBar';
import '../profileStyle.css';

class Search extends Component {
    constructor() {
        super();

        this.pageTitle = "Ivey - Search"
        document.title = this.pageTitle;
    }

    componentDidMount() {
        this.checkAuthorization();
    }

    async checkAuthorization() {
        const userIsAuthorized = await checkAuthorization();
        if(!userIsAuthorized) {
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
