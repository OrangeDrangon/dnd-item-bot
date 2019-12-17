# dnd-item-bot
A Discord Bot for tracking D&amp;D money.

## Aims

This bot aims to make it extremely convienent to track the money of parties through the use of Discord. It will eventually also track the miscellaneous items that no one is wants to add to their character sheet. If I ever gain the motivation to implement that.

## Useage

Using the bot is as simple as adding it to your server using the invite link (coming soon) and running the initialize command.

It is required that you have the `MANAGE_CHANNELS` and `MANAGE_EMOJIS` permissions in order to initialize a new wallet.

The prefix is `!` and is not configurable at this time. The rest of the necessary details for useage should be available with the `!help` command.

## Implementation

This bot was written in `Typescript` with `discord.js` and `discord-akairo` as the main driving libraries. Wallet data is kept in a postgres database and accessed with a custom wrapper around @database/pg.

It was a first attempt at using Akairo so it is not necessarily idiomatic Akairo. I did my best to use the docs to end up with something persentable.

## Development

In order to contribute all you need to do is fork and clone the repo. `docker-compose` should take care of running the database and bot together.

Before you can run the bot you need to create a `.env` file based off of the `.env.sample` present in the repo. All of those variables are required in order to make the bot work.

After you have made your changes feel free to open a pull request for review.

## Thanks

I want to wish a special thanks to the `discord.js` and `discord-akairo` discords' for helping me when I ran into a problem that was not obviously present in the docs.
