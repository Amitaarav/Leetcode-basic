import {createClient} from "redis"

const client = createClient({
    
})


// it infinitely listens to the redis list "submission" and process the submission one by one

// first connect the redis client

async function startWorker(){
    await client.connect()
    console.log("Redis client connected")

    while(1){
        const response = await client.brPop("submission",0) // keep waiting for new submission, stay blocked until new submission comes
        const submission = JSON.parse(response.element)

        await new Promise((resolve)=>setTimeout(resolve,5000)) // simulate the processing time of the submission

        console.log("Processing submission ",submission)
    }
}
startWorker();