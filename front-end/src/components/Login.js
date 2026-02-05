import React, {useEffect, useState} from "react";
import SpotifyW from '../components/images/spotifyW.png';
import SpotifyB from '../components/images/spotifyB.png';

export default function Login(props){

    const [ logo, setLogo ] =useState(SpotifyB);

    useEffect(() => {
        if(localStorage.getItem("mode") === "dark"){
            document.getElementById("App").style.backgroundColor = "#1A1919";
            setLogo(SpotifyW);
          }
          if(localStorage.getItem("mode") === "light"){
            document.getElementById("App").style.backgroundColor = "white";
            setLogo(SpotifyB);
          }
          if(localStorage.getItem("mode") === null){
            document.getElementById("App").style.backgroundColor = "white";
          }
    }, [])
    
    //User must click on the login button and follow the link to login with Spotify
    return(
    <div className="Page">
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}>
            <img src={props.logo || logo} alt="Spotify" style={{width:"250px", marginTop:"-5%",  marginBottom:"2%"}} id="Spotify-logo" />
            <div id="Login-zone" style={{backgroundColor:"#43435fc9", width:"45%", alignItems:"center", display:"flex", flexDirection:"column", borderRadius:"25px", marginBottom:"4%"}}>
                <p style={{fontSize:"1.75rem", fontFamily:"Courier New; monospace", fontWeight:"600", letterSpacing:"5px", color:"#42C6FF", marginTop:"15%", marginBottom:"10%"}}><i><b style={{color:"#F47DA8", fontSize:"2.5rem"}}>♪</b>Time to Get <b style={{color:"#467DE8", fontSize:"1.85rem"}}>Jazzy</b><b style={{color:"#F47DA8", fontSize:"2.5rem"}}>♫</b></i></p>
                <div style={{display:"flex", flexDirection:"row", alignItems:"center", width:"70%", justifyContent:"space-between", marginBottom:"5%"}}>
                    <a href="https://spotifyjazzed-v2.onrender.com//login"><button type="button" className="Login">Login</button></a>
                </div>
            </div>
        </div>
    </div> 
    )
}
