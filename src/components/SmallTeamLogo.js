import React, { Component } from 'react';

class SmallTeamLogo extends Component {
  constructor(props){
    super(props);
  }
  render(){
    let src = this.props.src || 'https://www.freeiconspng.com/uploads/no-image-icon-21.png';
    //console.log(src);
    return (
      <img src={src} className="small_team_logo" />
    )
  }
}

export default SmallTeamLogo;