import React from "react";

// Functional component for displaying favourites
const Favourites = ({ favourites, removeFromFavourites }) => {
  return (
    <div>
      <h2 className="headings">Favourites</h2>
      <ul>
        {/* Mapping through favourites array */}
        {favourites.map((fav, index) => (
          <li key={index} className="text">
            {/* Different attributes */}
            <img src={fav.artworkUrl100} alt="Artwork" />
            <div>{fav.trackName}</div>
            <div>{fav.artistName}</div>
            <div>{fav.releaseDate}</div>
            <button
              className="button"
              onClick={() => removeFromFavourites(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favourites;
