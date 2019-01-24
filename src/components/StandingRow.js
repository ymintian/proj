import React, { Component } from 'react';
import  {Link} from "react-router-dom";
import SmallTeamLogo from './SmallTeamLogo.js';

class StandingRow extends Component {
  constructor(props){
    super(props);
  }
  render(){
    let color = this.props.goalDifference < 0 ? "red" : "green";
    return (
      <tr>
        <td>{this.props.pos}</td>
        <td><Link to={`team/${this.props.teamId}`}><SmallTeamLogo src={this.props.logo} />{this.props.name}</Link></td>
        <td>{this.props.games}</td>
        <td>{this.props.won}</td>
        <td>{this.props.draw}</td>
        <td>{this.props.lost}</td>
        <td>{`${this.props.goalsFor} - ${this.props.goalsAgainst}`}</td>
        <td style={{color: `${color}`}}>{this.props.goalDifference}</td>
        <td>{this.props.points}</td>
      </tr>
    )
  }
}

export default StandingRow;