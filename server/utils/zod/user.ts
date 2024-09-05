import zod from 'zod'

export const loginSchema = zod.object({
    email : zod.string(),
    password : zod.string()
})

export const signupSchema = zod.object({
    username : zod.string(),
    email : zod.string(),
    password : zod.string(),
    image : zod.string().optional()
})