const webpack = require('webpack');
require('dotenv').config()

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "AAD_CLIENT_ID": JSON.stringify(process.env.AAD_CLIENT_ID),
            "TEAM_ID": JSON.stringify(process.env.TEAM_ID),
            "CHANNEL_ID": JSON.stringify(process.env.CHANNEL_ID)
        })
    ]
}