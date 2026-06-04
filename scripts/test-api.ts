import 'dotenv/config'
import { mapTeam } from '../lib/mappers.js'
import type { ApiFootballTeam } from '../types/api-football.js'

const API_KEY = process.env.API_FOOTBALL_KEY

async function testMappers() {
    const response = await fetch(
        'https://v3.football.api-sports.io/teams?search=Arsenal',
        {
            headers: {
                'x-apisports-key' : API_KEY as string,
            },
        }
    )

    const data = await response.json()
    const rawTeams: ApiFootballTeam[] = data.response

    const cleanTeams = rawTeams.map(mapTeam)
    console.log('Clean teams:', JSON.stringify(cleanTeams, null, 2))
    
}

testMappers()