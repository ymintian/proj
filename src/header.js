import React, { Component } from 'react';


class Header extends Component {
    constructor(props){
        super(props);
    }
    
    render (){
        return(
            <header className='main_header'>
                <h2>my sport app</h2>
            </header>
        );
    }
}

export default Header;