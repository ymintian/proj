import React, { Component } from 'react';
import  {Link} from "react-router-dom";

class TeamScoreboard extends Component {
  constructor(props){
    super(props);
  }
  hello(){
    console.log("HELLO from Teamscoreboard")
  }
  
  render(){
    console.log(this.props)
    
    let headers = new Headers();
    headers.append('X-Auth-Token', '7b2ac51349fd45cab94bd34a5e8db4a5')
    //headers.append('Access-Control-Allow-Origin', '*')
    
    let initRequest = {
      method: "GET",
      headers: headers,
      //mode: 'no-cors'
    }
    //http://api.football-data.org/v2/fixtures/149430
    //https://api.football-data.org/v2/competitions/PL/standings
    fetch('https://api.football-data.org/v2/matches/233094',initRequest)
    .then((res) => {
      console.log("FETCH");
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data)
      this.hello();
    })
    let games_arr = this.props.location.state.matches.matches;
    let id = this.props.location.state.id;
    //console.log('scoreboard',games_arr);
    let games = games_arr.map((game)=>{

      let date = game.utcDate.split("T")[0];
      if(game.status == 'SCHEDULED') return <tr key={game.id}><td>{date}</td><td>{game.homeTeam.name}</td><td>-:-</td><td>{game.awayTeam.name}</td><td>-</td></tr> 
      
      let team = id == game.homeTeam.id ? 'homeTeam' : 'awayTeam';
      let opponent = team == 'homeTeam' ? 'awayTeam' : 'homeTeam';
      
      let res = game.score.fullTime[team] >= game.score.fullTime[opponent] ? 
      (game.score.fullTime[team] == game.score.fullTime[opponent] ? "D" : "W") : "L";
      let color = '';

      switch(res){
        case 'D':
          color = "blue";
          break;
        case 'L':
          color = 'red';
          break;
        case 'W':
          color = 'green';
          break;
      }
      let styles = {color:`${color}`,fontWeight: "700"};
      //console.log('styles',styles);
      return <tr key={game.id}><td>{date}</td><td>{game.homeTeam.name}</td><td>{game.score.fullTime.homeTeam}:{game.score.fullTime.awayTeam}</td><td>{game.awayTeam.name}</td><td style={styles}>{res}</td></tr>;
    });
    return (
      <div>
        <h2 className="home_link"><Link to='/'>Home</Link></h2>
        <h2 className="scores_head">Scores</h2>
        <table className="scores_table">
          <tbody>
            {games}
          </tbody>
        </table>
      </div>
    )
  }
}

export default TeamScoreboard;