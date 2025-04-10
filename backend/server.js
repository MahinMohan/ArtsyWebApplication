const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
require("./database/database.js")
const User = require("./database/account.js")
const brcypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require('crypto');
JWT_SECRET = "A256ygh#1223luos";
const {authenticateusertoken} = require("./middleware.js")
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
const cors = require('cors');

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];


app.use(cors({
    origin: allowedOrigins,
    credentials:true
}))


async function get_token()
{
    try {
        const client_id = "0a77160e9a2a4a299043"; 
        const client_secret = "b4e8e053b9ffe81da44ba61a31003d4c";
        const url = `https://api.artsy.net/api/tokens/xapp_token?client_id=${client_id}&client_secret=${client_secret}`;

        const response = await fetch(url, {
            method: "POST",
        });

        const data = await response.json();
        return data["token"];  
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Error making the API request" });
    }
}


app.get('/api/me', authenticateusertoken, (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated' });
    }
  
    const { fullname, email, gravatar, favourites } = req.user;
    console.log(fullname,email)
  
    res.status(200).json({
      message: 'Authenticated',
      user: {
        fullname,
        email,
        gravatar,
        favourites
      }
    });
  });


app.get("/api/searchdata", async (req, res) => {
    x_app_token = await get_token();
    const artist = req.query.q;
    const url = 'https://api.artsy.net/api/search';
    
    const params = new URLSearchParams({
    "q" : artist,
    "size": "10",
    "type": "artist"
     });
  
    const headers = {
        "X-XAPP-Token" : x_app_token
            };
  
    try {
        const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: headers,
        });

        const data = await response.json();

        res.send(data._embedded.results)
        
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }


        } catch (error) 
            {
            console.error('Fetch error:', error);
            }
    });

    
app.get("/api/artistdata", async (req, res) => {
        x_app_token = await get_token();
        const id = req.query.id;
        const url = 'https://api.artsy.net/api/artists/'+id;
      
        const headers = {
            "X-XAPP-Token" : x_app_token
                };

        const params = {};
      
        try {
            const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: headers,
            });

            
    
            const data = await response.json();
            console.log(data)
    
            res.send(data)
            
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
    
    
            } catch (error) 
                {
                console.error('Fetch error:', error);
                }
        });


app.get("/api/artworksdata", async (req, res) => {
            x_app_token = await get_token();
            const id = req.query.id;
            const url = 'https://api.artsy.net/api/artworks';
            
          
            const headers = {
                "X-XAPP-Token" : x_app_token
                    };
    
             const params = new URLSearchParams({
                        "artist_id" : id,
                        "size": "10",
                         });
          
            try {
                const response = await fetch(`${url}?${params}`, {
                method: 'GET',
                headers: headers,
                });
    
                
        
                const data = await response.json();
        
                res.send(data);

                
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }
        
        
                } catch (error) 
                    {
                    console.error('Fetch error:', error);
                    }
            });


app.get("/api/genesdata", async (req, res) => {
                x_app_token = await get_token();
                const artworkid = req.query.id;
                const url = 'https://api.artsy.net/api/genes';
  
                const headers = {
                    "X-XAPP-Token" : x_app_token
                        };
        
                 const params = new URLSearchParams({
                            "artwork_id" : artworkid,
                             });
              
                try {
                    const response = await fetch(`${url}?${params}`, {
                    method: 'GET',
                    headers: headers,
                    });
        
                    
            
                    const data = await response.json();
            
                    res.send(data)
                    
                    
                    if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                    }
            
            
                    } catch (error) 
                        {
                        console.error('Fetch error:', error);
                        }
                });


app.get("/api/similarartists", async (req, res) => {
            x_app_token = await get_token();
            const artistid = req.query.id;
                    const url = 'https://api.artsy.net/api/artists';
      
                    const headers = {
                        "X-XAPP-Token" : x_app_token
                            };
            
                     const params = new URLSearchParams({
                                "similar_to_artist_id" : artistid,
                                 });
                  
                    try {
                        const response = await fetch(`${url}?${params}`, {
                        method: 'GET',
                        headers: headers,
                        });
            
                        
                
                        const data = await response.json();
                
                        res.send(data)
                        
                        
                        if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                        }
                
                
                        } catch (error) 
                            {
                            console.error('Fetch error:', error);
                            }
                    });


app.post("/api/createaccount", async(req,res)=>{
    console.log(req.body);
    const {fullname,email,password} = req.body;
    const userexists = await User.findOne({email});
    if(userexists)
           return res.json({ message: "User with this email already exists" });

    if (!fullname || !email.includes("@") || !password) {
        return res.json({ message: "Invalid input data" });
      }

    else
    {
        const encryptedpwd = await brcypt.hash(password,12);
        const newuser = new User({fullname, email, password:encryptedpwd});
        const token = jwt.sign({ _id : newuser._id}, JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
            secure: false 
          });
        newuser.tokens.push(token);
        const normalizedEmail = email.trim().toLowerCase(); 
        const hash = crypto.createHash('sha256').update(normalizedEmail).digest('hex');
        newuser.gravatar = `https://gravatar.com/avatar/${hash}`
        const gravatar = newuser.gravatar;
        await newuser.save();
        // res.json({gravatar,fullname,token});
        res.json(newuser)
    }
    
});



app.post("/api/login", async(req,res)=>
    {
        
        const {email,password} = req.body;
        console.log({email,password});
        try
        {
            const logincheck = await User.findOne({email})
            if(!logincheck)
            {
                return res.json({ message: "Password or email is incorrect" });
            }
            const match = await brcypt.compare(password,logincheck.password);
            if(!match)
            {
              return res.json({ message: "Password or email is incorrect" });
            }
            const token = jwt.sign({ _id: logincheck._id}, JWT_SECRET, { expiresIn: "1h" });
            logincheck.tokens.push(token);
            res.cookie("token", token, {
                maxAge: 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "lax",
                secure: false
              });
            const gravatar = logincheck.gravatar;
            const fullname = logincheck.fullname;
            await logincheck.save();
            console.log(logincheck)
            // res.json({ gravatar, fullname, token});
            res.json(logincheck)


        } catch(error){
            res.send("login error");
        }
    });

app.delete("/api/logout", authenticateusertoken, async(req,res)=>
{
    console.log("logout check");
    req.user.tokens = req.user.tokens.filter(token => token!=req.token);
    await req.user.save()
    res.clearCookie("token")
    res.send(req.user);
}) 

app.delete("/api/deleteaccount", authenticateusertoken, async(req,res)=>
{
    try
    {
        const deleteduser = await User.findByIdAndDelete(req.user._id);
        if(!deleteduser)
        {
            throw new Error("User not found")
        }
        else
        {
            console.log("Deleted User",deleteduser)
            res.send(deleteduser);
        }
    } catch(error)
    {
        console.log(error.message)
    }
});


app.post("/api/addtofavourites", authenticateusertoken, async(req,res)=>
{
    const {
        artistId,
        title,
        birthyear,
        deathyear,
        nationality,
        image
      } = req.body;
      
      try {
        const alreadyExists = req.user.favourites.some(
          (favourite) => favourite.artistId === artistId
        );
      
        if (alreadyExists) {
          return res.json({ message: "Already added to favourites" });
        }
      
        req.user.favourites.push({
          artistId,
          title,
          birthyear,
          deathyear,
          nationality,
          image,
          addedAt: new Date(),
        });
      
        await req.user.save();
        res.json({ message: "Added to favourites", user: req.user });
      } catch (error) {
        res.status(500).json({
          message: "Server error",
          error: error.message
        });
      }
      
})



app.get("/api/getfavourites", authenticateusertoken, async(req,res)=>
{
    res.send(req.user.favourites);
})


app.delete("/api/deletefavourites", authenticateusertoken, async(req,res)=>{
  const artistId = req.body.id;
  try {
    const exists = req.user.favourites.find(
      (fav) => fav.artistId === artistId
    );

    if (!exists) {
      return res.status(404).json({ message: "Artist not found in favourites" });
    }

    req.user.favourites = req.user.favourites.filter(
      (favourite) => favourite.artistId !== artistId
    );
    await req.user.save();
    res.json({ message: "Artist removed from favourites", user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
    
})

app.use(express.static(path.join(__dirname, "dist"))); // <-- Serve static frontend

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html")); // <-- For React Router
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
