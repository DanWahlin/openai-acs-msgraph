const webpack = require('webpack');
require('dotenv').config()

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "AAD_CLIENT_ID": JSON.stringify(process.env.AAD_CLIENT_ID),
            "TEAM_ID": JSON.stringify(process.env.TEAM_ID),
            "CHANNEL_ID": JSON.stringify(process.env.CHANNEL_ID),
            "ACS_PHONE_NUMBER": JSON.stringify(process.env.ACS_PHONE_NUMBER),
            "CUSTOMER_PHONE_NUMBER": JSON.stringify(process.env.CUSTOMER_PHONE_NUMBER),
            "API_BASE_URL": JSON.stringify(process.env.API_BASE_URL)
        })
    ]
}