import "./index.css";

const MovieCard = (props) => {
  const { item } = props;
  const { dogImg, publishedDate, authorName, title } = item;
  return (
    <li className="movie-card">
      <img className="movie-img" src={dogImg} alt="movie logo" />
      <div className="movie-content">
        <h2 className="movie-name">{title}</h2>
        <p className="author-name">Author: {authorName}</p>
        <p>
          Published In <span className="year">{publishedDate}</span>
        </p>
      </div>
    </li>
  );
};

export default MovieCard;
