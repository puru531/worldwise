import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useCities } from "../contexts/CitiesContext";
import { useEffect } from "react";
import flagemojiToPNG from "./FlagToPng";
import Spinner from "./Spinner";
import ButtonBack from "./BackButton";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    // weekday: "long",
  }).format(new Date(date));

function City() {
  //reading state data from route.
  const { id } = useParams(); //provided by react router

  const { getCity, currentCity, isLoading } = useCities();

  // //reading data from query param in route.
  // const [searchParams, setSearchParams] = useSearchParams(); //returns an array like useState : we can and set also.
  // const lat = searchParams.get("lat"); //searchParams consistes of an object which we need to read using get function.
  // const lng = searchParams.get("lng");

  useEffect(() => {
    getCity(id);
  }, [id, getCity]); //adding getCity func in dependency array will cause infinite re-renders,
  // because it is present in context api, which will be call on fist render itself
  //because getCity is present in dependency array, which will again cause upadte in contextAPi and again will render the component, and again getCity will be called ... and so on
  //So, we need to memoixze the getCity function in context file

  const { cityName, emoji, date, notes } = currentCity;

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{flagemojiToPNG(emoji)}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <ButtonBack />
      </div>
    </div>
  );
}

export default City;
