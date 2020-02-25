// useState and useEffect are hooks:
import React, { Component, useState, useEffect } from "react";
// You can get access to the history object’s properties and the closest <Route>'s match via the withRouter higher-order component. withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
import { withRouter } from "react-router-dom";
import APIHandler from "../../api/APIHandler";
// custom tools
// styles
import "./../../styles/form.css";

// do we want export fn here?:
export default withRouter(function FormArtists({
  mode = "create",
  _id,
  history,
  match
}) {
  const [{ name,  style, description, isBand }, setState] = useState({
    name: "",
    style: "",
    isBand: "",
    description: ""
  });

  const [styles,setStyles] = useState([])

  useEffect(() => {
    const initFormData = async () => {
      const apiRes = await APIHandler.get(`/artists/${_id}`);
      delete apiRes.data._id;
      console.log(apiRes.data);
      setState({ ...apiRes.data });
    };

    // need to get prior info into the form so can edit:
    if (mode === "edit") initFormData();
  }, [mode, _id]);


  useEffect(() => {
    APIHandler.get("/styles").then(dbRes => {
      setStyles(dbRes.data.styles)
    });
  }, []);


  const handleChange = e => {
    e.persist();
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setState(prevValues => ({
      ...prevValues,
      [e.target.name]:value
    }));
  };
  const handleSubmit = async e => {
    e.preventDefault();

    const newArstist = {
      name: name,
      style: style,
      isBand: isBand,
      description: description
    };

    try {
      if (mode === "create") await APIHandler.post("/artists", newArstist);
      else {
        await APIHandler.patch(`/artists/${match.params.id}`, newArstist);
        console.log("paaaatchhh");
      }
      // here, wet access history as a destructured props (see the parameters of this component)
      // history is accessible because we wrapped the component in the withROuter fiunction
      history.push("/admin/artists");
    } catch (apiErr) {
      console.error(apiErr);
      console.log("coucou");
    }
  };
  console.log(name, styles, style, description, isBand)

  return (
    <form className="form" onSubmit={handleSubmit} onChange={handleChange}>
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
        defaultValue="Choose a style"
      >
        <option disabled>Choose a style</option>
        {styles &&
          styles.map((style, i) => (
            <option key={i} value={style._id}>
              {style.name}
            </option>
          ))}
      </select>
      <label htmlFor="isBand">Band ?</label>
      <input id="isBand" name="isBand" type="checkbox"/>
      <button className="btn">ok</button>
    </form>
  );
});
