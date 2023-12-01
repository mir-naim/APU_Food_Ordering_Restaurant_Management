import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Search = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const [keyword, setKeyword] = useState("");

  const searchHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/search/${keyword}`); // Use navigate to change the route
    } else {
      navigate("/"); // Use navigate to navigate to the home page
    }
  };

  return (
    <form onSubmit={searchHandler}>
      <div className="input-group">
        <input
          type="text"
          id="search_field"
          className="form-control"
          placeholder="Enter Food Name ..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="input-group-append">
          <button id="search_btn" className="btn" type="submit">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
