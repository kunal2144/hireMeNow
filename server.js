import { createClient } from "@supabase/supabase-js"
import hbs from "express-handlebars"
import Express from "express"
import dotenv from "dotenv"
import handlebars from "handlebars"
import generalRouter from "./routers/generalRouter.js"
import __dirname from "./__dirname.js"
import path from "path"
import bodyParser from "body-parser"
import session from "express-session"
import cookieParser from "cookie-parser"
import seekerRouter from "./routers/seekerRouter.js"

handlebars.registerHelper("eq", function (value1, value2) {
    return value1 === value2
})

handlebars.registerHelper("replaceAll", function (value1, value2, value3) {
    return value1.replaceAll(value2, value3)
})

dotenv.config()

const app = Express()
const supabase = createClient(
    "https://tsplplrxxpvdycvonvrv.supabase.co",
    process.env.SUPABASE_ANON
)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(
    session({
        key: "user_sid",
        secret: "TC;izB48Eu)LU3,",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000,
        },
    })
)

//routes
app.use(generalRouter)
app.use(seekerRouter)

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
})

app.set("view engine", "hbs")
app.engine(
    "hbs",
    hbs.engine({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: __dirname + "/views/layouts/",
        partialsDir: __dirname + "/views/partials/",
    })
)

app.get("/job-seeker-details", async (req, res) => {
    const { data: user, error } = await supabase
        .from("job_seeker_profile")
        .select("*")
        .eq("id", req.session.user.id) //profile id != account id

    const { data, error2 } = await supabase
        .from("job_seeker_account")
        .select("email")
        .eq("id", req.session.user.id)

    if (error || error2) {
        res.status(500).json({ Error: "Failed to retrieve user details" })
    } else {
        console.log(JSON.stringify(user))
        let userWithEmail = {
            ...user[0],
            email: data[0].email,
        }
        res.json(userWithEmail)
    }
})

app.get("/get_job_listings", async (req, res) => {
    let query = buildQuery(req)

    const { data: job_listing, error } = await query
    if (error) return res.send(error)

    if (job_listing.length == 0)
        return res
            .status(404)
            .json({ Error: "Could not find any job listings" })

    job_listing.forEach((job) => {
        formatJobData(job)
    })

    return res.send(job_listing)
})

app.get("/job_listing/:id", async (req, res) => {
    const { data: jobListing, error } = await supabase
        .from("job_listing")
        .select("*")
        .eq("id", req.params.id)
    if (error) {
        res.status(500).render("error", {
            message: "Failed to retrieve job listing",
        })
    } else if (jobListing.length === 0) {
        res.status(404).render("notfound", { title: "404 Error | Jobs" })
    } else {
        let job = formatJobData(jobListing[0])

        job.description +=
            ". Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe libero voluptatibus assumenda maiores aliquid placeat reiciendis, unde quod ullam vel commodi deleniti repellat? Nulla, placeat ut minus itaque omnis accusamus?" +
            " Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe libero voluptatibus assumenda maiores aliquid placeat reiciendis, unde quod ullam vel commodi deleniti repellat? Nulla, placeat ut minus itaque omnis accusamus?"

        res.render("job_listing", {
            title: job.title.concat(" | Jobs"),
            jobListing: job,
        })
    }
})

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "404/404.html"))
})

function buildQuery(req) {
    let query = supabase.from("job_listing").select("*").order("id")
    if (req.query.search) {
        query = query.ilike("title", `%${req.query.search}%`)
    }
    if (req.query.category) {
        query = query.contains("category", [req.query.category])
    }
    if (req.query.location) {
        query = query.ilike("location", `%${req.query.location}%`)
    }
    if (req.query.start_date) {
        query = query.gte("start_date", req.query.start_date)
    }

    return query
}

function formatJobData(job) {
    let sd = new Date(job.start_date)
    job.start_date =
        sd.getDate() + "/" + (sd.getMonth() + 1) + "/" + sd.getFullYear()

    let ctc = job.ctc
    job.ctc = ctc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    let ab = new Date(job.apply_by)
    job.apply_by =
        ab.getDate() + "/" + (ab.getMonth() + 1) + "/" + ab.getFullYear()

    return job
}

app.listen(3000, () => {
    console.log("Server running on port 3000")
})
