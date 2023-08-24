function getGoogleAuth(){
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

    const options = {
        redirect_uri: "http://localhost:3000/users/login",
        client_id: "515774685184-judv39nhmvssuseo283vd13ji7d2d4eh.apps.googleusercontent.com",
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scopes: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ].join()
    }

    console.log({options})
    const qs = new URLSearchParams(options)
    console.log({qs});
}