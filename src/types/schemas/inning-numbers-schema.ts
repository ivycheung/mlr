import {z} from 'zod'

export const inningNumbersSchema = z.array(z.object({
    x: z.number(),
    y: z.number(),
    label: z.string()
}))

export type FormSchemaInningNumbers = z.infer<typeof inningNumbersSchema>