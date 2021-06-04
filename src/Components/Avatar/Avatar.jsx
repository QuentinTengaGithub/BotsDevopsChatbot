import React from "react";
import "./styles.scss";

import Me from "../../Assets/Images/profil.png";
import Ghost from "../../Assets/Images/ghost.png";
import Robo from "../../Assets/Images/robo.png";
import Holly from "../../Assets/Images/sun.png";

const Avatar = (props) => {
  const getImage = (name) => {
    switch (name) {
      case "me":
        return <img src={Me} alt="avatar" />;
      case "bot1":
        return <img src={Ghost} alt="avatar" />;
      case "bot2":
        return <img src={Robo} alt="avatar" />;
      default:
        return <img src={Me} alt="avatar" />;
      case "bot3":
        return <img src={Holly} alt="avatar" />;
    }
  };
  const { src } = props;
  return <div className="avatar-container">{getImage(src)}</div>;
};

export default Avatar;
