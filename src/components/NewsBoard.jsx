import { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import "../css/newsboard.css";

const NewsBoard = ({ category }) => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const recordPerPage = 9;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = articles.slice(firstIndex, lastIndex);

  const npage = Math.ceil(articles.length / recordPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  // Fetch articles based on the selected category
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${import.meta.env.VITE_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [category]);

  // Pagination functions
  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h2 className="text-center mt-2">
        Latest <span className="badge bg-danger">News</span>
      </h2>
      <hr />
      {isLoading && <div className="loader"></div>}
      <div className="block-for">
        {records.map((news, index) => (
          <NewsItem
            key={index}
            title={news.title}
            description={news.description}
            src={news.urlToImage}
            url={news.url}
          />
        ))}
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={prePage}>
              Prev
            </button>
          </li>
          {numbers.map((n) => (
            <li
              className={`page-item ${currentPage === n ? "active" : ""}`}
              key={n}
            >
              <button className="page-link" onClick={() => changePage(n)}>
                {n}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === npage ? "disabled" : ""}`}>
            <button className="page-link" onClick={nextPage}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NewsBoard;
