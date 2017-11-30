import React, {Component} from "react"
import { compose, withProps, lifecycle } from "recompose"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  // DirectionsRenderer,
  // SearchBox,
} from "react-google-maps"
import { inject, observer } from 'mobx-react';
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const _ = require("lodash");
let prop;
let routes;
let lat = 45.0145;
let lng = -74.8015;
function showPosition(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;
}
navigator.geolocation.getCurrentPosition(showPosition)
const google = window.google;


const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        center: {
          lat: lat, lng: lng
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap,
)((props) =>
  <GoogleMap
    ref={props.onMapMounted}
    onBoundsChanged={props.onBoundsChanged}
    defaultZoom={prop.zoom}
    defaultCenter={{ lat: lat, lng: lng }}
    // center={props.center}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Search an adress or city"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.isMarkerShown && <Marker position={{ lat: lat, lng: lng }} onClick={props.onMarkerClick} />}
    {routes}
  </GoogleMap>
  )

class Map extends React.PureComponent {
  state = {
    isMarkerShown: true,
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
  }

  render() {
    prop = this.props
    routes = prop.UserStore.routes.map((e, i) => {
      return true && <Marker position={{ lat: e.beginLat, lng: e.beginLng }} />
    })
    return (
      <MyMapComponent
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    )
  }
}

export default inject('UserStore')(Map);