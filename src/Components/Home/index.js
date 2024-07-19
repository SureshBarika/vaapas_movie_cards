import { Component } from "react";

import LoadingSpinnerComponent from "react-spinners-components";
import { v4 as uuidV4 } from "uuid";

import { IoSearch } from "react-icons/io5";

import MovieCard from "../movieCard";

import "./index.css";

const apiStatus = {
  initial: "initial",
  inProgress: "inProgress",
  success: "success",
  failed: "failed",
};

class Home extends Component {
  state = {
    movieName: "",
    moviesList: [],
    dogesImgList: [],
    dataStatus: apiStatus.initial,
  };

  fetchData = async () => {
    this.setState({ dataStatus: apiStatus.inProgress });
    const { movieName } = this.state;

    const url = `https://openlibrary.org/search.json?title=${movieName}`;

    const response = await fetch(url);
    const data = await response.json();
    if (response.ok === true && data.docs.length > 0) {
      const filteredData = data.docs.map((item) => {
        return {
          title: item.title,
          authorName: item.author_name,
          publishedDate: item.first_publish_year,
        };
      });

      const dogesUrl = "https://dog.ceo/api/breeds/image/random";
      let listOfImgs = [];

      for (let i = 0; i < filteredData.length; i++) {
        const response = await fetch(dogesUrl);
        const data = await response.json();
        const obj = {
          id: uuidV4(),
          ...filteredData[i],
          dogImg: data.message,
        };
        listOfImgs.push(obj);
      }

      this.setState({
        dogesImgList: listOfImgs,
        dataStatus: apiStatus.success,
      });
    } else {
      this.setState({ dataStatus: apiStatus.failed });
    }
  };

  getTheMovies = (event) => {
    event.preventDefault();
    this.fetchData();
  };

  updateMovieName = (event) => {
    this.setState({ movieName: event.target.value });
  };

  renderLoader = () => (
    <div className="centered-content">
      <LoadingSpinnerComponent
        type={"Eater"}
        colors={["#06628d", "orange"]}
        size={"100px"}
      />
      <p>Wait a second</p>
    </div>
  );

  renderMovieCards = () => {
    const { dogesImgList } = this.state;
    return (
      <ul className="movie-cards-cont">
        {dogesImgList.map((item) => (
          <MovieCard item={item} key={item.id} />
        ))}
      </ul>
    );
  };

  renderFailedSection = () => {
    const { movieName } = this.state;

    return (
      <div className="centered-content">
        <p className="failed-pera">
          <span className="failed-movie">*{movieName} </span>movie is not Found
        </p>
      </div>
    );
  };

  renderCardsUI = () => {
    const { dataStatus } = this.state;
    switch (dataStatus) {
      case apiStatus.inProgress:
        return this.renderLoader();
      case apiStatus.success:
        return this.renderMovieCards();
      case apiStatus.failed:
        return this.renderFailedSection();
      default:
        return <p>Search for movies that you want </p>;
    }
  };

  render() {
    const { movieName } = this.state;
    return (
      <div className="movie-cards-home-cont">
        <nav className="home-nav-bar">
          <img
            src="https://www.vaapas.in/assets/logo_horizontal_whiteText.png"
            alt="vaapas logo"
            className="logo-img"
          />
        </nav>
        <section>
          <form onSubmit={this.getTheMovies}>
            <input
              type="search"
              placeholder="Enter Movie name"
              className="search-bar"
              value={movieName}
              onChange={this.updateMovieName}
              required
            />
            <button type="submit" className="search-btn">
              <IoSearch />{" "}
            </button>
          </form>
        </section>
        <section>
          <h1 className="cards-section-hed">Movie Cards</h1>
          {this.renderCardsUI()}
        </section>
      </div>
    );
  }
}

export default Home;
