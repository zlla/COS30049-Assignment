import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

import CoinListDetails from "./CoinListDetails";

const AllCoins = () => {
  const [allCoins, setAllCoins] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("");
  const [filterCriteria, setFilterCriteria] = useState("");

  const coinsPerPage = 12;

  const fetchAllCoins = async () => {
    try {
      const response = await axios.get("https://api.coincap.io/v2/assets", {});
      const data = response.data.data;
      setAllCoins(data);
    } catch (error) {
      console.error("Error fetching all coins:", error);
    }
  };

  useEffect(() => {
    fetchAllCoins();
  }, []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSort = (field) => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortField(field);
  };

  const handleFilterChange = (e) => {
    setFilterCriteria(e.target.value);
    setCurrentPage(0);
  };

  const filteredCoins = allCoins.filter((coin) =>
    coin.name.toLowerCase().includes(filterCriteria.toLowerCase())
  );

  const parseValue = (value, field) => {
    if (
      field === "priceUsd" ||
      field === "changePercent24Hr" ||
      field === "volumeUsd24Hr" ||
      field === "marketCapUsd"
    ) {
      return parseFloat(value);
    }
    return value;
  };

  const displayCoins = () => {
    const sortedCoins = [...filteredCoins].sort((a, b) => {
      const valueA = parseValue(a[sortField], sortField);
      const valueB = parseValue(b[sortField], sortField);

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueB > valueA ? 1 : -1;
      }
    });

    const startIndex = currentPage * coinsPerPage;
    const endIndex = startIndex + coinsPerPage;
    return sortedCoins.slice(startIndex, endIndex);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12 px-0">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">All Coins</h2>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by name"
                  value={filterCriteria}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSort("name")}
                        style={{ cursor: "pointer" }}
                      >
                        Name
                        {sortField === "name" && (
                          <FontAwesomeIcon
                            icon={sortOrder === "asc" ? faSortUp : faSortDown}
                            className="ml-1"
                          />
                        )}
                        {sortField !== "name" && (
                          <FontAwesomeIcon icon={faSort} className="ml-1" />
                        )}
                      </th>
                      <th
                        onClick={() => handleSort("priceUsd")}
                        style={{ cursor: "pointer" }}
                      >
                        Price (USD)
                        {sortField === "priceUsd" && (
                          <FontAwesomeIcon
                            icon={sortOrder === "asc" ? faSortUp : faSortDown}
                            className="ml-1"
                          />
                        )}
                        {sortField !== "priceUsd" && (
                          <FontAwesomeIcon icon={faSort} className="ml-1" />
                        )}
                      </th>

                      <th
                        onClick={() => handleSort("changePercent24Hr")}
                        style={{ cursor: "pointer" }}
                      >
                        Change (24Hr %)
                        {sortField === "changePercent24Hr" && (
                          <FontAwesomeIcon
                            icon={sortOrder === "asc" ? faSortUp : faSortDown}
                            className="ml-1"
                          />
                        )}
                        {sortField !== "changePercent24Hr" && (
                          <FontAwesomeIcon icon={faSort} className="ml-1" />
                        )}
                      </th>

                      <th
                        onClick={() => handleSort("volumeUsd24Hr")}
                        style={{ cursor: "pointer" }}
                      >
                        Volume (USD 24Hr)
                        {sortField === "volumeUsd24Hr" && (
                          <FontAwesomeIcon
                            icon={sortOrder === "asc" ? faSortUp : faSortDown}
                            className="ml-1"
                          />
                        )}
                        {sortField !== "volumeUsd24Hr" && (
                          <FontAwesomeIcon icon={faSort} className="ml-1" />
                        )}
                      </th>

                      <th
                        onClick={() => handleSort("marketCapUsd")}
                        style={{ cursor: "pointer" }}
                      >
                        Market Cap (USD)
                        {sortField === "marketCapUsd" && (
                          <FontAwesomeIcon
                            icon={sortOrder === "asc" ? faSortUp : faSortDown}
                            className="ml-1"
                          />
                        )}
                        {sortField !== "marketCapUsd" && (
                          <FontAwesomeIcon icon={faSort} className="ml-1" />
                        )}
                      </th>
                    </tr>
                  </thead>
                  <CoinListDetails coins={displayCoins()} />
                </table>
              </div>

              <div className="d-flex justify-content-center">
                <ReactPaginate
                  pageCount={Math.ceil(allCoins.length / coinsPerPage)}
                  pageRangeDisplayed={5}
                  marginPagesDisplayed={2}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  initialPage={currentPage}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  nextClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextLinkClassName={"page-link"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCoins;
