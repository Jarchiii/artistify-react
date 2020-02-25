import React from "react";
import { Link } from "react-router-dom";
// custom tools
import IconFav from "../icon/IconFavorite";
// styles
import "./../../styles/icon-color.css";

export default function CardArtist({ data }) {





  return <div>
     <div  style={{backgroundColor:`${data.style.color}` }}>_</div>
    {data.description}
    {data.name}
    <IconFav/>
  </div>;
}
