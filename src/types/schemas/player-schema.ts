import {z} from 'zod'

export const playerSchema = z.array(z.object({
    status : z.number(),
    Team : z.string(),
    batType : z.string(),
    batter_ping_location : z.string(),
    discordID: z.number(),
    discordName : z.string(),
    hand : z.string(),
    keep_pitch : z.number(),
    milr_team : z.string(),
    pitchBonus : z.string(),
    pitchType : z.string(),
    playerID : z.number(),
    playerName : z.string(),
    posValue : z.number(),
    priPos : z.string(),
    redditName : z.string(),
    secPos : z.string(),
    tertPos : z.string()
}))

export type FormSchemaPlayers = z.infer<typeof playerSchema>