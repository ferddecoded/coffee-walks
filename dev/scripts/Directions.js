
import React from "react"
import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps"
import config from "./config.js"

let key1 = "AIzaSyCqAPO1t-7KMYt8f0YU2Pi4z2j-SWPvykg";
let key2 = "AIzaSyAX858sfNr7KcSp6NdszHBoxH8ZDix-nf8";
let key3 = "AIzaSyA3iTZwH8cw1ZHEDOOykYqzrPK-7WBzJgA";
let key4 = "AIzaSyAmlAUFOnmBXKDuYmCTVFbEKejUPCZOQBg";
let key5 = "AIzaSyDPIDnwygCBYYAxcjXu4S8aeogRkWAYXDI";
let key6 = "AIzaSyBjO03NjG4133czcPIqYEC_3vPszHKoVB8";
let key7 = "AIzaSyB1ak9DkHT163E0newMhdQNt1g5ZTP6qko";


//WRAPPER COMPONENT FOR OUR DIRECTIONS RENDERER
class Map extends React.PureComponent {
   constructor(props) {
      super(props)
   }

   render() {
      const { startLat, startLng, endLat, endLng } = this.props;

      const MapWithADirectionsRenderer = compose(
         withProps({
           
            googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${config.key2}&v=3.exp&libraries=geometry,drawing,places`,

            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={{ height: `55vh` }} />,
            mapElement: <div style={{ height: `100%` }} />,

         }),
         withScriptjs,
         withGoogleMap,
         lifecycle({
            componentDidMount() {
               const DirectionsService = new google.maps.DirectionsService();

               DirectionsService.route({
                  origin: new google.maps.LatLng(
                     startLat, startLng),
                  destination: new google.maps.LatLng(
                     endLat, endLng),
                  travelMode: google.maps.TravelMode.WALKING,
               }, (result, status) => {
                  if (status === google.maps.DirectionsStatus.OK) {
                     console.log(result);
                     // this is bound not Map's this.setState
                     // rather withing the compose lifecycle
                     this.setState({
                        directions: result,
                     });
                  } else {
                     console.log(result);
                  }
               });
            }
         })

      )(props =>
         <GoogleMap
            defaultZoom={7}
            defaultCenter={new google.maps.LatLng(41.8507300, -87.6512600)}
         >
            {props.directions && <DirectionsRenderer directions={props.directions} />}
            
         </GoogleMap>
      );
      
      return(
         <MapWithADirectionsRenderer />
      );
   }
}

//OUR DIRECTIONS COMPONENT

class Directions extends React.PureComponent {
   constructor(props) {
      super(props)
      this.state = {
         isMarkerShown: false,
         firstChoice: [],
         endChoice: [],
         user: null,
         startTimeChosen: false,
         startTime: ''
      }
      console.log(props.location.state);
      this.saveWalk = this.saveWalk.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.submitStartTime = this.submitStartTime.bind(this);
   }


   handleChange(e) {
      console.log(e.target.value);
      this.setState({
         [e.target.id]: e.target.value
      }); 
   }



   saveWalk(e) {
      //must reference our current database
      //create a reference in firebase using the UID in the user  object

      const dbRefUser = firebase.database().ref(`users/${firebase.auth().currentUser.uid}`);

      //this is to push your information into the database
      dbRefUser
         .push({
            start: this.props.location.state.firstChoice,
            end: this.props.location.state.endChoice,
            startTime: this.state.startTime
         })
         .then((data) => {
            const dbRefPublic = firebase.database().ref(`/public/${data.ref.key}`);
            console.log(dbRefPublic);
            dbRefPublic.update({
               start: this.props.location.state.firstChoice,
               end: this.props.location.state.endChoice,
               startTime: this.state.startTime
            });
         }); 
   }

   submitStartTime(e) {
      e.preventDefault();
      this.setState({
         startTimeChosen: true,
      })
   }

   render(props) {
      const { firstChoice, endChoice } = this.props.location.state;
      const { lat: startLat, lng: startLng} = firstChoice.geometry.location;
      const { lat: endLat, lng: endLng } = endChoice.geometry.location;

      return (
         <div>

            {this.state.startTimeChosen ? (
               <button className="medButton saveWalkButton" type="button" onClick={this.saveWalk}>Save this walk!</button>
            ) : (
               <div>
                  <form className="searchForm" action="" onSubmit={this.submitStartTime}>
                     <label htmlFor=""></label>
                        <input className="walkButtonInput" placeholder="Ex: Monday, Dec 4th, 3pm" onChange={this.handleChange} value={this.state.startTime} type="text" id="startTime" />
                     <input type="submit" className="medButton" value="Confirm Start Time"/>
                  </form>
               </div>
            )}
            <Map
               startLat={startLat}
               startLng={startLng}
               endLat={endLat}
               endLng={endLng}
            />
         </div>
      )
   }
}

export default Directions;