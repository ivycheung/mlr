import {z} from 'zod'

export const pitchInInningSchema = z.array(z.object({
    inning: z.number(),
    pitches: z.array(z.number()),
}))

export type FormSchemaPitchInInning = z.infer<typeof pitchInInningSchema>