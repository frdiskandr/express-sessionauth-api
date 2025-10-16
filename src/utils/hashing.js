import bcrypt from 'bcrypt'

 const HashPassword = async (value) => {
    const saltRound = 10;
    // generate salt
    const salt = await bcrypt.genSalt(saltRound);

    //hash value
    const hashed = await bcrypt.hash(value, salt)
    return hashed
}

 const VerifPassword = async (password, hashPassword) => {
    const isMatch = await bcrypt.compare(password, hashPassword)
    return isMatch
    // boolean
}

export default {HashPassword, VerifPassword}
