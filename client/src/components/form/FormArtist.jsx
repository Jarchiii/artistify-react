import React, { Component, useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import APIHandler from "../../api/APIHandler";
// custom tools
// styles
import "./../../styles/form.css";


export default withRouter(function FormArtists({
  mode = "create",
  _id,
  history,
  match
}) {
  const [
    { name, styles, style, description, isBand},
    setState
  ] = useState({
    name: "",
    style: "",
    styles: [],
    isBand: "",
    description:""
    
  });

  useEffect(() => {
    const initFormData = async () => {
      const apiRes = await APIHandler.get(`/artists/${_id}`);
      delete apiRes.data._id;
      setState({ ...apiRes.data });
    };

    if (mode === "edit") initFormData();

  }, [mode, _id]);

  useEffect(() => {
      APIHandler.get("/styles")
      .then(dbRes => {
        setState({ ...dbRes.data, styles: dbRes.data.styles});
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

    const newArstist = {
    "name": name,
    "style": style,
    "isBand" : isBand,
    "description": description
  }
    console.log(name)
  
   

    try {
      if (mode === "create") await APIHandler.post("/artists", newArstist);
      else await APIHandler.patch(`/artists/${match.params.id}`, newArstist);
      // here, we access history as a destructured props (see the parameters of this component)
      // history is accessible because we wrapped the component in the withROuter fiunction
      history.push("/admin/artists");
    } catch (apiErr) {
      console.error(apiErr);
      console.log("coucou")
    }
  };



  return (<form className="form" onSubmit={handleSubmit} onChange={handleChange}>
  <label className="label" htmlFor="name">
    name
  </label>
  <input
    className="input"
    name="name"
    id="name"
    type="text"
    defaultValue={name}
  />


<label className="label" htmlFor="description">
      description
      </label>
      <input
        className="input"
        id="description"
        name="description"
        type="text"
        defaultValue={description}
      />
      
      <label className="label" htmlFor="style">
        style
      </label>
      <select
        className="input"
        id="style"
        name="style"
        defaultValue={style}>
        {styles && styles.map((style, i) => (<option key={i} value={style._id}>{style.name}</option> ))}
      </select>

 <button className="btn">ok</button>
    </form>
  );
});



