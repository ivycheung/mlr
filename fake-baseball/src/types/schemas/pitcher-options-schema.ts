import {z} from 'zod'

export const pitcherOptionSchema = z.array(z.object({
    label: z.string(),
    value: z.number()
}))

export type FormSchemaPitcherOptions = z.infer<typeof pitcherOptionSchema>