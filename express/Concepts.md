### Structure of the backend


1. Routes
    /dbwallets
    /wallets
    /user
    /transaction
2. Schema is for the DB schemas of the MongoDB cluster
3. MIddleware is all the middleware functionality we use across our routes, i.e logger , verifyToken
4. Controllers is where all the functionality of our routes lives. We use the MVC style pattern (not exactly but we have our views/routes, our model under Schema, and our controllers)
5. JWT for user authentication.