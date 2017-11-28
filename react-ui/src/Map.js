import React from "react"
import { compose, withProps } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "react-google-maps"
import { setTimeout } from "timers";
import { inject, observer } from 'mobx-react';
var lat = 45.0145;
var lng = -74.8015;
function showPosition(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;
}
navigator.geolocation.getCurrentPosition(showPosition)

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: lat, lng: lng }}
  >
    {props.isMarkerShown && <Marker position={{ lat: lat, lng: lng }} />}
  </GoogleMap>
  )

class Map extends React.PureComponent {
  constructor() {
    super();
    this.bob = this.bob.bind(this);
    this.state = {
      bool: false
    }
  }

  state = {
    isMarkerShown: false,
  }
  componentDidMount() {
    this.delayedShowMarker()
  }

  bob() {
    this.setState({
      bool: true,
    });
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  render() {
    if (lat === 0) {
      setTimeout(() => {
        this.bob
      }, 5000)
    }
    return (
      <MyMapComponent
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    )
  }
}

export default inject('UserStore')(Map);