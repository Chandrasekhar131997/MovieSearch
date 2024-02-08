
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './Movie.css';

function MovieSearch() {
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState([]);
  const [perPage] = useState(5);
  const [pageCount, setPageCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = React.useState(true);

  const getData = useCallback(async () => {
    setTimeout(async () => {
      setLoading(true);
      
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=8c783222b0b92e22efb125e379bd0c5b`);
        const data = res.data.results;
        const filteredMovies = data.filter(movie =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const slice = filteredMovies.slice(offset, offset + perPage);
        const postData = slice.map(movie =>
          <section className='d-flex justify-content-around flex-wrap' key={movie.id}>
            <div className='card mt-2 d-flex' style={{ width: '300px', backgroundColor: ' #ffccb3' }} >
              <div className='card-body'>
                <img alt={movie.title} style={{ width: '200px' }} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
                <h1 className='fw-bold fs-5 mt-2 ' style={{ color: 'rgba(236, 89, 9, 0.932)' }}>{movie.title}</h1>
              </div>
              <p className='fw-100 m-3'>"{movie.overview}"</p>
            </div>
          </section>
        );

        setData(postData);
        setPageCount(Math.ceil(filteredMovies.length / perPage));
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {


        setLoading(false);
      }
    }, 1000);
  }, [offset, searchQuery, perPage]);

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1);
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>


      <div className='container d-flex justify-content-center'>
        <input
          className='form-control mt-3 w-25'
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>



      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        data
      )}




      <ReactPaginate
        previousLabel={"prev"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"} />
    </div>
  );
}

export default MovieSearch;
