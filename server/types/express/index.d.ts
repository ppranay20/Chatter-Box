import express from 'express'

interface UserType {
    id : string
}

declare global { 
    namespace Express {
        interface Request {
            user? : UserType | null
        }
    }
}