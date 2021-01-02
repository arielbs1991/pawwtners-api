require('dotenv').config();

const generateState = () => {
    // const private_user_key = process.env.PRIVATE_USER_KEY
    // const client_id = Date.now()
    //will this (date.now) work? Or does it need to be something replicable?

    
    //a'ight, I don't think I want to use the code below here, i like the direction of the above code more. TODO: Come back to this and decide.
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const state = () => {
        for (let i = 0; i < 40; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return state;
}

module.exports = state;

//make sure where generateState is called we check to see if the client id already exists? Or if a state property for that user already exists, and only if it doesn't formulate a new state