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
  origin: [
    'https://tncis4004.xyz', 
    'http://localhost:5173'
  ],
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

app.get('/api/auth/me', (req, res) => {

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

app.post('/api/auth/register', async(req,res)=>{

    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName || !email || !password)
    {
        return res.json({
            success:false,
            message:"Missing fields"
        });
    }

    const db = client.db('HabitTracker');

    const existingUser = await db.collection('Users')
        .findOne({username: email});

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
        username:email,
        password:hashedPassword,
        authProvider:"local"
    });


    res.json({
        success:true,
        message:"User created"
    });

});

app.post('/api/auth/resend-verification', async (req, res) => {
    const { username } = req.body;

    res.json({
        success: true,
        message: `A new verification link has been sent to ${username || 'your email'}.`
    });
});

app.post('/api/auth/verify-email', async (req, res) => {
    const { token } = req.body;

    res.json({
        success: true,
        message: "Email successfully verified! You can now log in."
    });
});

app.post('/api/auth/login', async(req,res)=>{

    const {email,password}=req.body;

    const db = client.db('HabitTracker');

    const user = await db.collection('Users')
        .findOne({username:email});


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

    const mockToken = crypto.randomBytes(40).toString('hex');

    res.json({
        success: true,
        token: mockToken,
        user: {
            id: user._id.toString(),
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        }
    });

});

app.post('/api/auth/forgot-password', async(req,res)=>{

    const {email} = req.body;

    const db = client.db('HabitTracker');


    const user = await db.collection('Users')
        .findOne({
            username:email
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

app.post('/api/auth/reset-password', async(req,res)=>{

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

app.post('/api/habits', async(req,res)=>{

    const {
    userId,
    name,
    description,
    frequency
} = req.body;

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
        description: description,
        frequency:frequency,
        streak:0,
        completedToday:false,
        lastCompleted:null
    };


    const result = await db.collection('Habits').insertOne(newHabit);

    res.json({
        success:true,
        habit:{
            id: result.insertedId.toString(),
            _id: result.insertedId.toString(),
            ...newHabit
        }
    });

});

app.get('/api/habits', async(req,res)=>{

    const db = client.db('HabitTracker');

    const userId = req.query.userId || req.user?._id?.toString();

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
    habits: habits.map(habit => ({
        ...habit,
        id: habit._id.toString(),
        _id: habit._id.toString()
    }))
});

});

app.post('/api/tasks', async(req,res)=>{

    const {
        userId,
        title,
        description,
        priority,
        dueDate
    } = req.body;


    if(!ObjectId.isValid(userId))
    {
        return res.json({
            success:false,
            message:"Invalid user ID"
        });
    }


    if(!title)
    {
        return res.json({
            success:false,
            message:"Missing title"
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


    const newTask = {

        userId:userId,

        title:title,

        description:description || "",

        priority:priority || "Medium",

        dueDate: dueDate || null,

        completed:false,

        createdAt:new Date()

    };


    const result =
        await db.collection('Tasks')
        .insertOne(newTask);



    res.json({

        success:true,

        task:{
            id:result.insertedId.toString(),
            _id:result.insertedId.toString(),
            ...newTask
        }

    });

});

app.get('/api/tasks', async(req,res)=>{

    console.log("QUERY USER:", req.query.userId);
    console.log("SESSION USER:", req.user);

    const db = client.db('HabitTracker');


    const userId =
        req.query.userId ||
        req.user?._id?.toString();



    const tasks =
        await db.collection('Tasks')
        .find({
            userId:userId
        })
        .toArray();



    res.json({

        success:true,

        tasks:tasks.map(task=>({

            ...task,

            id:task._id.toString(),

            _id:task._id.toString()

        }))

    });


});

app.put('/api/tasks/:id', async(req,res)=>{


    const taskId=req.params.id;


    const {
        userId,
        title,
        description,
        priority,
        dueDate
    } = req.body;



    const db=client.db('HabitTracker');



    const result =
        await db.collection('Tasks')
        .updateOne(

        {
            _id:new ObjectId(taskId),
            userId:userId
        },

        {

            $set:{
                title,
                description,
                priority,
                dueDate
            }

        });


    if(result.matchedCount===0)
    {
        return res.json({
            success:false,
            message:"Task not found"
        });
    }



    const updated =
        await db.collection('Tasks')
        .findOne({
            _id:new ObjectId(taskId)
        });



    res.json({

        success:true,

        task:{
            ...updated,
            id:updated._id.toString(),
            _id:updated._id.toString()
        }

    });


});

app.delete('/api/tasks/:id', async(req,res)=>{


    const taskId=req.params.id;

    const { userId } = req.body;

    const db=client.db('HabitTracker');


    const result =
        await db.collection('Tasks')
        .deleteOne({
            _id:new ObjectId(taskId),
            userId:userId
        });



    res.json({

        success:
            result.deletedCount > 0

    });


});

app.patch('/api/tasks/:id/toggle', async(req,res)=>{


    const taskId=req.params.id;


    const db=client.db('HabitTracker');



    const {userId} = req.body;

    const task =
        await db.collection('Tasks')
        .findOne({
            _id:new ObjectId(taskId),
            userId:userId
        });



    if(!task)
    {
        return res.json({
            success:false,
            message:"Task not found"
        });
    }



    await db.collection('Tasks')
    .updateOne({
        _id:new ObjectId(taskId),
        userId:userId
    },

        {
            $set:{
                completed:!task.completed
            }
        }

    );



    const updated =
        await db.collection('Tasks')
        .findOne({

            _id:new ObjectId(taskId)

        });



    res.json({

        success:true,

        task:{
            ...updated,
            id:updated._id.toString(),
            _id:updated._id.toString()
        }

    });


});

app.put('/api/habits/:id', async(req,res)=>{
    const habitId = req.params.id;

    const {
        userId,
        name,
        description,
        frequency
    } = req.body;

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
                name,
                description,
                frequency
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

app.post('/api/habits/:id/toggle', async(req,res)=>{
    const habitId = req.params.id;
    const { userId, date } = req.body;

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


    let completions = habit.completions || [];


    if(completions.includes(date))
    {
        // Undo completion
        completions =
            completions.filter(
                item => item !== date
            );
    }
    else
    {
        // Complete today
        completions.push(date);
    }


    await db.collection('Habits')
        .updateOne(
            {
                _id:new ObjectId(habitId)
            },
            {
                $set:{
                    completions
                }
            }
        );


    const updatedHabit =
        await db.collection('Habits')
        .findOne({
            _id:new ObjectId(habitId)
        });


    res.json({
        success:true,
        habit:{
            ...updatedHabit,
            id:updatedHabit._id.toString(),
            _id:updatedHabit._id.toString()
        }
    });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = { app, client, connectDB };