import React, { Component } from 'react';

class PlayerRow extends Component {
  constructor(props){
    super(props);
  }
  render(){

   let player_info = this.props.player_info;
   let shirtNumber = player_info.shirtNumber || "#";
   let position = player_info.position || player_info.role.replace("_"," ");

   if(player_info.dateOfBirth) var ageInMs = Date.parse(new Date()) - Date.parse(new Date(player_info.dateOfBirth.split("T")[0]));
   else { var ageInMs = null;}

   let age = ageInMs ? Math.floor(ageInMs/(365*24*3600*1000)) : '-';
   
   return (
      <tr>
        <td>{shirtNumber}</td>
        <td>{player_info.name}</td>
        <td>{position}</td>
        <td>{age}</td>
        <td>{player_info.nationality}</td>
      </tr>
    )
  }
}

export default PlayerRow;