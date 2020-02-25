import React, { Component, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import APIHandler from "../../api/APIHandler";
// custom tools
// import CustomInputFile from "./../icon/IconAvatarAdmin";
import LabPreview from "../LabPreview";
// styles
import "./../../styles/form.css";
import "./../../styles/icon-avatar.css";


//API


export default withRouter(function FormAlbum({
  mode = "create",
  _id,
  history,
  match
}) {
  const [
    { title, releaseDate, artist, artists, cover, description, label, rates },
    setState
  ] = useState({
    title: "",
    relaseDate: "",
    artists: [],
    artist: "",
    cover: "",
    description: "",
    label: "",
  });

  useEffect(() => {
    const initFormData = async () => {
      const apiRes = await APIHandler.get(`/albums/${_id}`);
      delete apiRes.data._id;
      setState({ ...apiRes.data });
    };

    if (mode === "edit") initFormData();

  }, [mode, _id]);

  useEffect(() => {
      APIHandler.get("/artists")
      .then(dbRes => {
        setState({ ...dbRes.data, artists: dbRes.data.artists});
      })
  }, []);

  const handleChange = e => {
    e.persist();
    setState(prevValues => ({
      ...prevValues,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const newAlbum = {
   "title": title,
    "releaseDate": releaseDate,
    "artist": artist,
    "cover": cover,
    "label" : label,
    "description": description
  }

    try {
      if (mode === "create") await APIHandler.post("/albums", newAlbum );
      else await APIHandler.patch(`/albums/${match.params.id}`, newAlbum );
      // here, we access history as a destructured props (see the parameters of this component)
      // history is accessible because we wrapped the component in the withROuter fiunction
      history.push("/admin/albums");
    } catch (apiErr) {
      console.error(apiErr);
      console.log("coucou")
    }
  };



  return (
    <form className="form" onSubmit={handleSubmit} onChange={handleChange}>
      <label className="label" htmlFor="title">
        title
      </label>
      <input
        className="input"
        id="title"
        type="text"
        defaultValue={title}
      />

      <label className="label" htmlFor="releaseDate">
      releaseDate
      </label>
      <input
        className="input"
        id="releaseDate"
        type="text"
        defaultValue={releaseDate}
      />

      <label className="label" htmlFor="artist">
        artist
      </label>
      <select
        className="input"
        id="artist"
        defaultValue={artist}>
        {artists && artists.map((artist, i) => (<option key={i} value={artist._id}>{artist.name}</option> ))}
      </select>

      <label className="label" htmlFor="cover">
      cover
      </label>
      <input
        className="input"
        id="cover"
        type="text"
        defaultValue={cover}
      />

      <label className="label" htmlFor="description">
      description
      </label>
      <input
        className="input"
        id="description"
        type="text"
        defaultValue={description}
      />

      <label className="label" htmlFor="label">
        Label
      </label>
      <input
        className="input"
        id="label"
        type="text"
        defaultValue={label}
      />

      <button className="btn">ok</button>
    </form>
  );
});
