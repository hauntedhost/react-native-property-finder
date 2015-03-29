'use strict';
var React = require('react-native');
var SearchResults = require('./search-results');

var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component
} = React;

function UrlForQueryAndPage(key, value, pageNumber) {
  var data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber,
    [key]: value
  };

  var queryString = Object.keys(data)
    .map(key => key + '=' + encodeURIComponent(data[key]))
    .join('&');

  return 'http://api.nestoria.co.uk/api?' + queryString;
}

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: ''
    };
  }

  onSearchTextChanged(event) {
    this.setState({
      searchString: event.nativeEvent.text
    });
  }

  _handleResponse(response) {
    this.setState({
      isLoading: false,
      message: ''
    });

    // if (/^1\d+$/.test(response.application_response_code)) {
    if (response.application_response_code[0] === '1') {
      this.props.navigator.push({
        title: 'Results',
        component: SearchResults,
        passProps: {
          listings: response.listings
        }
      });
    } else {
      this.setState({
        message: 'Location not recognized, please try again.'
      });
    }
  }
  _executeQuery(query) {
    console.log('query: ', query);

    this.setState({
      isLoading: true
    });

    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error =>
        this.setState({
          isLoading: false,
          message: 'Oops. Something went wrong: ' + error
        })
      );
  }

  onSearchPressed() {
    var query = UrlForQueryAndPage('place_name', this.state.searchString, 1);
    this._executeQuery(query);
  }

  onLocationPressed() {
    navigator.geolocation.getCurrentPosition(
      location => {
        var search = location.coords.latitude + ',' +
                     location.coords.longitude;
        this.setState({
          searchString: search
        });
        var query = UrlForQueryAndPage('centre_point', search, 1);
        this._executeQuery(query);
      },
      error => {
        this.setState({
          message: 'There was a problem obtaining your location: ' + error
        });
      });
  }

  render() {
    var spinner = this.state.isLoading ?
      (<ActivityIndicatorIOS hidden='true' size='large' />) :
      (<View />);

    return (
      <View style={styles.container}>
        <Text style={styles.headline}>
          Find Your Home
        </Text>
        <Text style={styles.description}>
          Search by city, state, or zip code near your location.
        </Text>
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)}
            placeholder='Search by city, state or zip' />
          <TouchableHighlight
              style={styles.button}
              underlayColor='#a72e21'
              onPress={this.onSearchPressed.bind(this)}>
            <Text style={styles.buttonText}>Go</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight
          onPress={this.onLocationPressed.bind(this)}
          style={styles.button}
          underlayColor='#a72e21'>
          <Text style={styles.buttonText}>Location</Text>
        </TouchableHighlight>
        <Image source={{uri: 'http://i.imgur.com/98CK4AH.gif'}}
               style={styles.houseImage}/>
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  headline: {
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'center',
    color: '#424242'
  },
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#bb5146',
    borderColor: '#bb5146',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 10,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#a4a4a4',
    borderRadius: 6,
    color: '#656565'
  },
  houseImage: {
    width: 200,
    height: 200
  }
});

module.exports = SearchPage;
