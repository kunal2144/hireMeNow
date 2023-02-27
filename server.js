import { createClient } from '@supabase/supabase-js'
import Express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = Express()
const supabase = createClient('https://tsplplrxxpvdycvonvrv.supabase.co', process.env.SUPABASE_ANON);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.get('/get_job_listings', async (req, res) => {
    let { data: job_listing, error } = await supabase
        .from('job_listing')
        .select('*')
        .order('id')

    if(!error) return res.send(job_listing)
    else return res.json(error)
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
});

