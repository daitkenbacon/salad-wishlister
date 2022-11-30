# salad-wishlister
    A video game wishlist-maker utilizing the RAWG API.

## local dependencies
### API key for data fetching
    1. visit [rawg.io](https://rawg.io/apidocs) to get RAWG's API key.
    2. create '_salad-config.json_' in src.
    3. give field "**key**" a value of the given API key in the config file.

### Starting development server
    1. cmd '_npm i_' to install dependencies
    2. cmd '_npm start_' to start server
    3. build will be hosted on http://localhost:3000

### Frameworks used
    **Axios** for API requests
    **Framer** for motion animation

## useage
    Games with release dates between the current day and one year from now will be displayed.
    Click on a game to add it to your wishlist.
    Click it again to remove it from your wishlist.
    Uncheck the "show all" checkbox to display only games on your wishlist.