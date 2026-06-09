import {
 useEffect,
 useState
}
from "react";

import API
from "../services/api";

function HeadToHead({

 homeTeam,
 awayTeam

}) {

 const [matches,
 setMatches]
 =
 useState([]);

 useEffect(() => {

  loadH2H();

 }, []);

 const loadH2H =
 async () => {

  try {

   const res =
   await API.get(

    `/h2h/${homeTeam}/${awayTeam}`

   );

   setMatches(
    res.data.response
   );

  } catch(error) {

   console.log(error);

  }

 };

 return (

  <div
  style={{
   marginTop:"30px"
  }}
  >

   <h2>
    Head To Head
   </h2>

   {

   matches.map(match => (

    <div
    key={
     match.fixture.id
    }
    style={{
     border:
     "1px solid #ddd",

     padding:"12px",

     marginBottom:
     "10px",

     borderRadius:
     "8px"
    }}
    >

     <strong>

      {
      match.teams.home.name
      }

      {" vs "}

      {
      match.teams.away.name
      }

     </strong>

     <p>

      {
      match.goals.home
      }

      -

      {
      match.goals.away
      }

     </p>

    </div>

   ))

   }

  </div>

 );

}

export default HeadToHead;
