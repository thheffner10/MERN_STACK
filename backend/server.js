const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();
const url = process.env.MONGODB_URI;

const client = new MongoClient(url);

async function connectDB()
{
    await client.connect();
}

const express = require('express');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const crypto = require('crypto');


app.use(express.json());

app.use(cors({
    origin: "https://tncis4004.xyz",
    credentials: true
}));

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:true,
        httpOnly:true,
        sameSite:"lax"
    }
}));

app.use(passport.initialize());
app.use(passport.session());

const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy(
{
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL
},
async(accessToken, refreshToken, profile, done)=>{

    const db = client.db('HabitTracker');


    let user = await db.collection('Users')
        .findOne({
            googleId:profile.id
        });


    if(!user)
    {
        const newUser =
        {
            googleId:profile.id,
            username:profile.emails[0].value,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            authProvider:"google"
        };


        const result =
            await db.collection('Users')
            .insertOne(newUser);


        user = await db.collection('Users')
            .findOne({
                _id:result.insertedId
            });
    }


    done(null,user);

}));

passport.serializeUser((user,done)=>{
    done(null,user._id.toString());
});


passport.deserializeUser(async(id,done)=>{

    const db = client.db('HabitTracker');

    if(!ObjectId.isValid(id))
    {
        return done(null, false);
    }

    const user = await db.collection('Users')
        .findOne({
            _id:new ObjectId(id)
        });

    done(null,user);

});

app.get('/auth/google',
passport.authenticate('google',
{
    scope:['profile','email']
}));

app.get('/auth/google/callback',
passport.authenticate('google',
{
    failureRedirect:"https://tncis4004.xyz/login"
}),
(req,res)=>{

    res.redirect(
        "https://tncis4004.xyz/dashboard"
    );

});

app.get('/api/me', (req, res) => {

    if (!req.user)
    {
        return res.json({
            success:false,
            message:"Not logged in"
        });
    }

    res.json({
        success:true,
        user:{
            id:req.user._id.toString(),
            username:req.user.username,
            firstName:req.user.firstName,
            lastName:req.user.lastName
        }
    });

});

app.post('/api/register', async(req,res)=>{

    const {firstName, lastName, username, password} = req.body;

    if(!firstName || !lastName || !username || !password)
    {
        return res.json({
            success:false,
            message:"Missing fields"
        });
    }

    const db = client.db('HabitTracker');

    const existingUser = await db.collection('Users')
        .findOne({username: username});

    if(existingUser)
    {
        return res.json({
            success:false,
            message:"Username already exists"
        });
    }


    const hashedPassword = await bcrypt.hash(password,10);


    await db.collection('Users').insertOne({
        firstName:firstName,
        lastName:lastName,
        username:username,
        password:hashedPassword,
        authProvider:"local"
    });


    res.json({
        success:true,
        message:"User created"
    });

});

app.post('/api/login', async(req,res)=>{

    const {username,password}=req.body;

    const db = client.db('HabitTracker');

    const user = await db.collection('Users')
        .findOne({username:username});


    if(!user)
    {
        return res.json({
            success:false,
            message:"User not found"
        });
    }


    const validPassword =
        await bcrypt.compare(password,user.password);


    if(!validPassword)
    {
        return res.json({
            success:false,
            message:"Incorrect password"
        });
    }


    res.json({
        success:true,
        user:{
            id:user._id.toString(),
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName
        }
    });

});

app.post('/api/requestpasswordreset', async(req,res)=>{

    const {username} = req.body;

    const db = client.db('HabitTracker');


    const user = await db.collection('Users')
        .findOne({
            username:username
        });


    if(!user)
    {
        return res.json({
            success:false,
            message:"User not found"
        });
    }


    const resetToken = crypto.randomBytes(32).toString('hex');


    const expiration = new Date();

    expiration.setMinutes(
        expiration.getMinutes() + 15
    );


    await db.collection('Users')
        .updateOne(
            {
                _id:user._id
            },
            {
                $set:{
                    resetToken:resetToken,
                    resetExpires:expiration
                }
            }
        );


    res.json({
        success:true,
        message:"Reset token created",
        token:resetToken
    });

});

app.patch('/api/resetpassword', async(req,res)=>{

    const {token,newPassword} = req.body;


    const db = client.db('HabitTracker');


    const user = await db.collection('Users')
        .findOne({
            resetToken:token
        });


    if(!user)
    {
        return res.json({
            success:false,
            message:"Invalid token"
        });
    }


    if(new Date() > new Date(user.resetExpires))
    {
        return res.json({
            success:false,
            message:"Token expired"
        });
    }


    const hashedPassword =
        await bcrypt.hash(newPassword,10);


    await db.collection('Users')
        .updateOne(
            {
                _id:user._id
            },
            {
                $set:{
                    password:hashedPassword
                },
                $unset:{
                    resetToken:"",
                    resetExpires:""
                }
            }
        );


    res.json({
        success:true,
        message:"Password updated"
    });

});

app.post('/api/profile', async(req,res)=>{

    const {userId} = req.body;

    if(!ObjectId.isValid(userId))
    {
        return res.json({
            success:false,
            message:"Invalid user ID"
        });
    }

    const db = client.db('HabitTracker');


    const user = await db.collection('Users')
        .findOne({
            _id:new ObjectId(userId)
        });


    if(!user)
    {
        return res.json({
            success:false,
            message:"User not found"
        });
    }


    res.json({
        success:true,
        user:{
            id:user._id.toString(),
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName
        }
    });

});

app.post('/api/createhabit', async(req,res)=>{

    const {userId, name, frequency} = req.body;

    if(!ObjectId.isValid(userId))
    {
        return res.json({
            success:false,
            message:"Invalid user ID"
        });
    }

    if(!userId || !name || !frequency)
    {
        return res.json({
            success:false,
            message:"Missing fields"
        });
    }


    const db = client.db('HabitTracker');


    // Check if user exists
    const user = await db.collection('Users')
        .findOne({
            _id:new ObjectId(userId)
        });


    if(!user)
    {
        return res.json({
            success:false,
            message:"User not found"
        });
    }


    const newHabit = {
        userId:userId,
        name:name,
        frequency:frequency,
        streak:0,
        completedToday:false,
        lastCompleted:null
    };


    await db.collection('Habits').insertOne(newHabit);


    res.json({
        success:true,
        message:"Habit created"
    });

});

app.post('/api/gethabits', async(req,res)=>{

    const {userId} = req.body;

    const db = client.db('HabitTracker');

    let habits = await db.collection('Habits')
    .find({userId:userId})
    .toArray();


    const today = new Date().toISOString().split("T")[0];


    for(const habit of habits)
    {
        const lastDate = habit.lastCompleted
            ? new Date(habit.lastCompleted).toISOString().split("T")[0]
            : null;


        if(lastDate !== today && habit.completedToday === true)
        {
            await db.collection('Habits')
                .updateOne(
                    {_id:habit._id},
                    {
                        $set:{
                            completedToday:false
                        }
                    }
                );

            habit.completedToday = false;
        }
    }

    res.json({
        success:true,
        habits:habits
    });

});

app.patch('/api/updatehabit', async(req,res)=>{

    const {userId, habitId, name, frequency} = req.body;

    if(!ObjectId.isValid(habitId))
    {
        return res.json({
            success:false,
            message:"Invalid habit ID"
        });
    }

    const db = client.db('HabitTracker');


    const result = await db.collection('Habits')
    .updateOne(
        {
            _id: new ObjectId(habitId),
            userId:userId
        },
        {
            $set:{
                name:name,
                frequency:frequency
            }
        }
    );


    if(result.matchedCount === 0)
    {
        return res.json({
            success:false,
            message:"Habit not found"
        });
    }

    if(result.modifiedCount === 0)
    {
        return res.json({
            success:false,
            message:"No changes made"
        });
    }

    res.json({
        success:true,
        message:"Habit updated"
    });

});

app.delete('/api/deletehabit', async(req,res)=>{

    const {userId, habitId} = req.body;

    if(!ObjectId.isValid(habitId))
    {
        return res.json({
            success:false,
            message:"Invalid habit ID"
        });
    }

    const db = client.db('HabitTracker');


    const result = await db.collection('Habits')
    .deleteOne({
        _id:new ObjectId(habitId),
        userId:userId
    });


    if(result.deletedCount > 0)
    {
        res.json({
            success:true,
            message:"Habit deleted"
        });
    }
    else
    {
        res.json({
            success:false,
            message:"Habit not found"
        });
    }

});

app.patch('/api/completehabit', async(req,res)=>{

    const {userId, habitId} = req.body;

    if(!ObjectId.isValid(habitId))
    {
        return res.json({
            success:false,
            message:"Invalid habit ID"
        });
    }

    const db = client.db('HabitTracker');

    const habit = await db.collection('Habits')
        .findOne({
            _id:new ObjectId(habitId),
            userId:userId
        });


    if(!habit)
    {
        return res.json({
            success:false,
            message:"Habit not found"
        });
    }


    const today = new Date().toISOString().split("T")[0];


    const lastDate = habit.lastCompleted
        ? new Date(habit.lastCompleted).toISOString().split("T")[0]
        : null;


    // Already completed today
    if(lastDate === today)
    {
        return res.json({
            success:false,
            message:"Already completed today"
        });
    }

    let newStreak;


    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayString = yesterday.toISOString().split("T")[0];


    if(lastDate === yesterdayString)
    {
        // Continued streak
        newStreak = habit.streak + 1;
    }
    else
    {
        // Missed a day, restart streak
        newStreak = 1;
    }


    await db.collection('Habits')
        .updateOne(
            {
                _id:new ObjectId(habitId),
                userId:userId
            },
            {
                $set:{
                    streak:newStreak,
                    completedToday:true,
                    lastCompleted:new Date()
                }
            }
        );


    res.json({
        success:true,
        message:"Habit completed",
        streak:newStreak
    });

});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = { app, client, connectDB };