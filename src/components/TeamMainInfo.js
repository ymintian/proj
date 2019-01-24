import React, { Component } from 'react';
import ScoreBtn from './ScoreBtn.js';

class TeamMainInfo extends Component {
  constructor(props){
    super(props);
  }
  render(){
    let info = this.props.info;
    let country = Object.assign({},info.area);
    
    //console.log('info', info);
    let colors = parseColor(info.clubColors).map((color,i)=>{
      return <span key={i} style={{display:"inline-block",height: "20px",width: "20px", background:`${color}`}}></span>
    });
    
   return (
      <div>
        <h3>{info.name}</h3>
        <p>{country.name}</p>
        <p>{colors}</p>
        <p>{info.founded}</p>
        <p>{info.venue}</p>
        <p><a href={info.website} target="_blank">{info.website}</a></p>
        <p>{info.email}</p>
        <p>{info.phone}</p>
        <p>{info.address}</p>
        <ScoreBtn matches={this.props.matches} info={info} />
      </div>
    )
  }
}

function parseColor(str){
    
    let arr = str.split('/').map((c)=> {
      let arr = c.trim().toLowerCase().split(" ");
      let l = arr.length;
      
      return l > 1 ? arr[1] : arr[0];
    });
    return arr;
};

export default TeamMainInfo;