import React from "react";

const Header = () => {
   return (
      <div className="headerBG">
         <header className="header clearfix">
            <h1 className="header__title">Coffee Walks</h1>
            <img className="header__logo" src="/assets/coffee-mug.svg" alt=""/>
         </header>
      </div>
   )
}

export default Header;