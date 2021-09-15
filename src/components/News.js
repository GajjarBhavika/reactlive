import React, { useEffect,useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News =(props)=> {

    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

   const UpdateNews= async ()=> {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parsedata = await data.json();
        props.setProgress(70);
        setArticles(parsedata.articles);
        setTotalResults(parsedata.totalResults);  
        setLoading(false);
        props.setProgress(100);
    }

    useEffect(() => {
       UpdateNews();
       document.title = `${capitalizeFirstLetter(props.category)} - News`;
       // eslint-disable-next-line
    }, [])

    // clickevnetOf NextPrevious
    //  const previousClick = async () => {
    //     setPage(page-1)
    //     UpdateNews();
    //  }
    //  const nextClick = async () => {
    //     setPage(page+1)
    //     UpdateNews();
    //  }

     const  fetchMoreData = async() => {
        
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1)
        let data = await fetch(url);
        let parsedata = await data.json();
        setArticles(articles.concat(parsedata.articles))
        setTotalResults(parsedata.totalResults)
        
      };

        return (
            <>
                <h2 className="text-center" style={{margin:'35px 0px',marginTop:'90px'}}>News - Top {capitalizeFirstLetter(props.category)} Headlines</h2>
                 {loading && <Spinner /> } 
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults }
                    loader={<Spinner/>}
                >
                <div className="container">
                <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : " "} discription={element.description ? element.description : " "}
                                    imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                    </div>
                </InfiniteScroll>
                {/* nextpreviousButton */}
                {/* <div className="container d-flex justify-content-between">
                    <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={previousClick}> &larr; Previous</button>
                    <button disabled={page + 1 > Math.ceil(totalResults / props.pageSize)} className="btn btn-dark" onClick={nextClick}> &rarr; Next</button>
                </div> */}
            </>
        )
    
}

News.defaultProps = {
    country: 'in',
    pageSize: 8
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
}

export default News
