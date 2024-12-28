// frontend/pages/index.js
import React from "react";

const Home = ({ data }) => {
  return (
    <div>
      <h1>Welcome to TouristSync</h1>
      <p>{data.message}</p>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api");
  const data = await res.json();

  return {
    props: { data },
  };
}

export default Home;
