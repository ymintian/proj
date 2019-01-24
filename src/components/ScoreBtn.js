import React, { Component } from 'react';
import  {Link} from "react-router-dom";

class ScoreBtn extends Component {
  constructor(props){
    super(props);
  }
  render(){
    let id = this.props.info.id;
    let matches = this.props.matches;
    return <div id="see_scores"><Link to={{pathname:`/team/${id}/matches`, state:{matches: matches,id: id}}}>See scores</Link></div>
  }
}

export default ScoreBtn;