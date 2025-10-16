import yup from 'yup';

export const userSchema = yup.object({
    username: yup.string().nullable().default("user"),
    email: yup.string().email().required(),
    password: yup.string().required()
})

export const LoginSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
})