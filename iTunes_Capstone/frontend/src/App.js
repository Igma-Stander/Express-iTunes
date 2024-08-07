import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Favourites from "./Components/Favourites";
import { Container, Row, Col } from "react-bootstrap";

function App() {
  //Different states
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    // Function to fetch JWT token and store it in localStorage
    const fetchToken = async () => {
      try {
        const response = await axios.get("/api/generate-token");
        const { token } = response.data;
        // Store token securely
        localStorage.setItem("token", token);
      } catch (error) {
        console.error("Token generation error:", error);
      }
    };
    // Call fetchToken function on component mount
    fetchToken();
  }, []);

  // Function to handle search based on searchTerm and mediaType
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      let endpoint = `/api/search?term=${searchTerm}&media=${mediaType}`;

      //tried modifying for "all" option
      // if (mediaType !== "all") {
      //   endpoint += `&media=${mediaType}`;
      // }

      // Fetch data from iTunes API based on endpoint and token
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: token,
        },
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // Function to add item to favourites list
  const addToFavourites = (item) => {
    setFavourites([...favourites, item]);
  };

  // Function to remove item from favourites list
  const removeFromFavourites = (index) => {
    const updatedFavourites = [...favourites];
    // Remove item from favourites array
    updatedFavourites.splice(index, 1);
    // Update array
    setFavourites(updatedFavourites);
  };

  return (
    <div className="App">
      <h1 className="title">iTunes Quick Search</h1>
      <div>
        {/* Search input, media type dropdown, and search button */}
        <input
          className="input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search"
        />
        <select
          className="input1"
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
        >
          <option value="movie">Movie</option>
          <option value="podcast">Podcast</option>
          <option value="music">Music</option>
          <option value="audiobook">Audiobook</option>
          <option value="shortFilm">Short film</option>
          <option value="tvShow">TV show</option>
          <option value="software">Software</option>
          <option value="ebook">Ebook</option>
          <option value="all">All</option>
        </select>
        <button className="search" onClick={handleSearch}>
          Search
        </button>
      </div>
      <hr />
      <div>
        {/* Display search results in a grid */}
        <h2 className="headings">Search Results</h2>
        <Container>
          <Row>
            {searchResults.map((result, index) => (
              <Col key={index} md={3} className="text">
                <img src={result.artworkUrl100} alt="Cover" />
                <div>{result.trackName}</div>
                <div>{result.artistName}</div>
                <div>{result.releaseDate}</div>
                <button
                  className="button"
                  onClick={() => addToFavourites(result)}
                >
                  Add to Favourites
                </button>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      <div>
        {/* Display favourites using the Favourites component */}
        <Favourites
          favourites={favourites}
          removeFromFavourites={removeFromFavourites}
        />
      </div>
      <br />
    </div>
  );
}

export default App;
