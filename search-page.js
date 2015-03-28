'use strict';

var React = require('react-native');
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

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'Asheville, NC',
      isLoading: false
    };
  }

  onSearchTextChanged(event) {
    this.setState({
      searchString: event.nativeEvent.text
    });
  }

  _executeQuery(query) {
    this.setState({
      isLoading: true
    });
  }

  onSearchPressed() {
    var query = 'testing';
    this._executeQuery(query);
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
        <TouchableHighlight style={styles.button} underlayColor='#a72e21'>
          <Text style={styles.buttonText}>Location</Text>
        </TouchableHighlight>
        <Image source={{uri: 'http://i.imgur.com/98CK4AH.gif'}}
               style={styles.houseImage}/>
        {spinner}
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
