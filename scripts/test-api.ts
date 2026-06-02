import 'dotenv/config'
const API_KEY = process.env.API_FOOTBALL_KEY

async function testAPI() {
    const response = await fetch(
        'https://v3.football.api-sports.io/teams?search=Arsenal',
        {
            headers: {
                'x-apisports-key' : API_KEY as string,
            },
        }
    )

    const data = await response.json()
    console.log(JSON.stringify(data, null, 2))
    
}

testAPI()
