import React from "react"
import { compose, withProps, lifecycle } from "recompose"
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "react-google-maps"
import { inject } from 'mobx-react';
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const _ = require("lodash");

let prop;
let routes;
let shownRoutes;
let routeToAdd;
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
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `600px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const DirectionsService = new google.maps.DirectionsService();
      const refs = {}
      //1
      DirectionsService.route({
        origin: new google.maps.LatLng(45.652738893683654, -111.19385004043579),
        destination: new google.maps.LatLng(45.65267889753717, -111.19136095046997),
        travelMode: google.maps.TravelMode.WALKING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      })
      //3
      DirectionsService.route({
        // draggable: true,
        origin: new google.maps.LatLng(45.65805017280785,  -111.19391441345215),
        destination: new google.maps.LatLng(45.66104961368346,  -111.1937427520752),
        waypoints: [{
          location: new google.maps.LatLng(45.66512859541803,  -111.19322776794434), 
          stopover: false
        },{
          location: new google.maps.LatLng(45.67880301247679,  -111.19614601135254), 
          stopover: false
        },{
          location: new google.maps.LatLng( 45.681681411392695,  -111.19357109069824), 
          stopover: false
        },{
          location: new google.maps.LatLng(45.67282461453129,  -111.18322849273682), 
          stopover: false
        }],
        travelMode: google.maps.TravelMode.WALKING,
      }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions3: result,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      })
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
          refs.map.fitBounds(bounds);
        },
      })
    },
  }),
  withGoogleMap,
)((props) =>
  <GoogleMap
    ref={props.onMapMounted}
    onBoundsChanged={props.onBoundsChanged}
    defaultZoom={15}
    defaultCenter={{ lat: lat, lng: lng }}
    onClick={(e) => { props.UserStore.addRouteInfo(e, props.UserStore) }}
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
        placeholder="Search a location"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `30px`,
          marginTop: `10px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {true && <DirectionsRenderer directions={props.directions3}/>}
    {routeToAdd}
    {routes}
    {shownRoutes}
  </GoogleMap>
  )

class Map extends React.PureComponent {
  state = {
    isMarkerShown: true,
    done: false
  }

  handleRouteClick(e, route){
    console.log(route);
    this.setState({isMarkerShown: false});
    shownRoutes.push(route);
  }

  componentDidMount() {
    this.setState({
      done: true
    })
  }

  render() {
    prop = this.props
    console.log(prop);
    routes = prop.UserStore.routes.map((e, i) => {
      return true && <DirectionsRenderer directions={prop.directions}/>
    })
    if(prop.UserStore.adding){
      if(prop.UserStore.routeToAdd.info.start){
        routeToAdd = true && <Marker position={{lat: prop.UserStore.routeToAdd.info.start.lat, lng: prop.UserStore.routeToAdd.info.start.lng}}/>
      }
    }
    if (this.state.done) {
      return (
        <MyMapComponent
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          UserStore={this.props.UserStore}
        />
      )
    } else {
      return null
    }
  }
}

export default inject('UserStore')(Map);