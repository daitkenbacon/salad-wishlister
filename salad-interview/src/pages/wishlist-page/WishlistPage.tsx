import { useEffect, useState } from "react";
import axios from "axios";
import apiKey from "../../salad-config.json";

import "./WishlistPage.scss";

import Header from "../../components/header/Header";

import SkeletonCards from "../../components/skeleton-cards-list/SkeletonCardsList";
import FilteredCardsList from "../../components/filtered-cards-list/FilteredCardsList";
import WishlistCardsList from "../../components/wishlist-cards-list/WishlistCardsList";

export interface GameData {
  id: number;
  name: string;
  released: string;
  background_image: string;
}

const WishlistPage: React.FC<{}> = () => {
  const [loading, setLoading] = useState<Boolean>(true);
  const [gameCards, setGameCards] = useState<GameData[]>([]);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState<Number[]>([]);
  const [isShowAll, setIsShowAll] = useState<Boolean>(true);

  const today = new Date();
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 1);

  var leadingZero = '';
  var nextLeadingZero = '';

  if(today.getDate() < 10){
      leadingZero = '0';
    }
    if (Number(nextDate.getDate()) < 10){
      nextLeadingZero = '0';
    }

  useEffect(() => {
    const loadData = () => {
      axios({
        //Fetches games releasing between current day and one year + one day from now
        method: "GET",
        url: `https://api.rawg.io/api/games?key=${
          apiKey["key"]
        }&dates=${today.getFullYear()}-${
          today.getUTCMonth() + 1
        }-${leadingZero}${today.getUTCDate()},${nextDate.getFullYear() + 1}-${
          nextDate.getUTCMonth() + 1
        }-${nextLeadingZero}${nextDate.getUTCDate()}`,
      })
        .then((res) => {
          setError("");
          setGameCards(res.data.results);
        })
        .catch((err) => {
          setError(err.message);
          console.log(error);
        })
        .finally(() => {
          //After data fetches, sort games by release date
          setGameCards((oldState) =>
            oldState.sort((a, b) => {
              const aDate = parseInt(a.released.split("-").join(""), 10);
              const bDate = parseInt(b.released.split("-").join(""), 10);
              return aDate - bDate;
            })
          );
          setLoading(false);
        });
    };
    loadData();
  });

  const removeWishlistItem = (id: number) => {
    let filteredArray = wishlist.filter((item) => item !== id);
    setWishlist(filteredArray);
  };

  const addWishlistItem = (id: number) => {
    setWishlist([...wishlist, id]);
  };

  const handleWishlistClick = (id: number) => {
    //If game already wishlisted, remove; if not, add

    !wishlist.includes(id) && addWishlistItem(id);
    wishlist.includes(id) && removeWishlistItem(id);
  };

  const handleWishlistKeydown = (event: React.KeyboardEvent, id: number) => {
    if(event.key === 'Enter' || event.key === ' ') {
      handleWishlistClick(id);
    }
  }

  const handleShowAllToggle = () => {
    setIsShowAll(!isShowAll);
  };

  return (
    <div className="page-container">
      <Header
        handleShowAllToggle={handleShowAllToggle}
        wishlist_length={wishlist.length}
      />

      {error && <p>{error}</p>}
      <div className="wishlist-cards-container">
        {
          // Render full list of games only if page loaded and "show all" is checked
          !loading && isShowAll && (
            <WishlistCardsList
              handleWishlistKeydown={handleWishlistKeydown}
              handleWishlistClick={handleWishlistClick}
              gameCards={gameCards}
              wishlist={wishlist}
            />
          )
        }
        {
          // Render filtered list only if page loaded and "show all" is unchecked
          !loading && !isShowAll && (
            <FilteredCardsList
              handleWishlistKeydown={handleWishlistKeydown}
              handleWishlistClick={handleWishlistClick}
              gameCards={gameCards}
              wishlist={wishlist}
            />
          )
        }
        {
          // If no wishlisted items and "show all" unchecked, show message
          !isShowAll && wishlist.length === 0 && <h1>No wishlisted items!</h1>
        }
        {
          // If page is loading, render skeleton cards
          loading && <SkeletonCards />
        }
      </div>
    </div>
  );
};

export default WishlistPage;
