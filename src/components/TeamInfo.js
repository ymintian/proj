import React, { Component } from 'react';
import TeamLogo from './TeamLogo.js';
import TeamMainInfo from './TeamMainInfo.js';
import TeamSquad from './TeamSquad.js';


class TeamInfo extends Component {
  constructor(props){
    super(props);
  }
  render(){
    let info = this.props.teamInfo;
    let logo_src = info.crestUrl ? info.crestUrl : 'https://www.freeiconspng.com/uploads/no-image-icon-21.png';
    //console.log(logo_src);
    if (typeof info == 'string') return <div>team not found</div>
    else  return (
      <div className="team_info">
        <TeamLogo logo_src={logo_src}/>
        <TeamMainInfo info={info} matches={this.props.matches}/>
        <TeamSquad squad={info.squad}/>
      </div>
    )
  }
}

export default TeamInfo;