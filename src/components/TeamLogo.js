import React, { Component } from 'react';

class TeamLogo extends Component {
  constructor(props){
    super(props);
  }
  render(){
    
   return (
      <div className="team_logo">
        <img src={this.props.logo_src} />
      </div>
    )
  }
}

export default TeamLogo;