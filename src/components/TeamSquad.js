import React, { Component } from 'react';
import PlayerRow from './PlayerRow.js';

class TeamSquad extends Component {
  constructor(props){
    super(props);
  }
  render(){
   let players = this.props.squad.map((player)=>{
    return <PlayerRow key={player.id} player_info={player}/>;
   });

   return (
      <div>
        <h2 className="squad_head">Squad</h2>
        <table className="squad_table">
          <thead>
            <tr>
              <td>№</td>
              <td>name</td>
              <td>position</td>
              <td>age</td>
              <td>nationality</td>
            </tr>
          </thead>
          <tbody>
            {players}
          </tbody>
        </table>
      </div>
    )
  }
}

export default TeamSquad;