import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import { getAllUsers } from '../API/GET/GetMethods';
import { Redirect } from 'react-router-dom';

class SearchBar extends Component {
    constructor() {
        super();

        this.state = {
            user: "",
            redirectToProfile: false
        }
        this.getAllUser();
    }

    componentWillMount() {
        this.resetComponent()
    }

    async getAllUser() {
        const response = await getAllUsers();
        if (response) {
            this.setState({user: response});
        }
    }

    reloadPage() {
    }

  resetComponent = () => {
      this.setState({ isLoading: false, results: [], value: '' })
  }

  handleResultSelect = (e, { result }) => {
      this.setState({ value: result.title })
      this.setState({ redirectToProfile: true })
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(this.state.user, isMatch),
      })
    }, 300)
  }

  render() {
    const { isLoading, value, results } = this.state

    const { redirectToProfile } = this.state;
     if (redirectToProfile) {
       this.reloadPage()
       return <Redirect to={'/profile/'+ this.state.value}/>;
     }

    return (
          <Search
            className="search-bar"
            fluid
            open
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
            results={results}
            value={value}
            {...this.props}
          />
    )
  }
}

export default SearchBar;
