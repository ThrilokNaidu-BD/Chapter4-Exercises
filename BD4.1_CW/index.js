let express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");
const { error } = require("console");
let app = express();
let PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: "./BD4.1_CW/database.sqlite",
    driver: sqlite3.Database,
  });
})();

// Fetch all movies Endpoint
async function fetchAllMovies() {
  let query = "SELECT * FROM movies";
  let response = await db.all(query, []);
  return { movies: response };
}

app.get("/movies", async (req, res) => {
  try {
    let results = await fetchAllMovies();
    if (results.movies.length === 0) {
      return res.status(404).json({ error: error.message });
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch movies by Genre
async function fetchMoviesByGenre(genre) {
  let query = "SELECT * FROM movies WHERE genre = ?";
  let response = await db.all(query, [genre]);
  return { movies: response };
}

app.get("/movies/genre/:genre", async (req, res) => {
  try {
    let genre = req.params.genre;
    let results = await fetchMoviesByGenre(genre);
    if (results.movies.length === 0) {
      return res.status(404).json({ message: "No movie of this genre found." });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Fetch Movies by Id
async function fetchMoviesById(id) {
  let query = "SELECT * FROM movies WHERE id = ?";
  let response = await db.all(query, [id]);
  return { movies: response };
}

app.get("/movies/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let results = await fetchMoviesById(id);
    if (results.movie === undefined) {
      return res.status(404).json({ message: "No movie found." });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Fetch Movies by Release Year
async function fetchMoviesByReleaseYear(releaseYear) {
  let query = "SELECT * FROM movies WHERE release_year = ?";
  let response = await db.all(query, [releaseYear]);
  return { movies: response };
}

app.get("/movies/release-year/:year", async (req, res) => {
  try {
    let releaseYear = req.params.year;
    let results = await fetchMoviesByReleaseYear(releaseYear);
    if (results.movies.length === 0) {
      return res.status(404).json({ message: "No movies found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log("Server running on port 3001"));
