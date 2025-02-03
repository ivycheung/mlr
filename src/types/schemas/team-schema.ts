import { z } from 'zod'

export const teamSchema = z.array(z.object({
  teamID: z.string(),
  teamName: z.string()
}))

export type FormSchemaTeams= z.infer<typeof teamSchema>