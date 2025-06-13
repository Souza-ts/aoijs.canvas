<p align="center">
  <a href="https://discord.com/invite/HMUfMXDQsV">
    <img width="100" src="https://github.com/aoijs/website/blob/master/assets/images/aoicanvas.png?raw=true" alt="aoijs.canvas">
  </a>
</p>

<h1 align="center">aoijs.canvas</h1>

<div align="center">

[![Discord Server](https://img.shields.io/discord/773352845738115102?color=5865F2&logo=discord&logoColor=white)](https://discord.com/invite/HMUfMXDQsV)
[![NPM Downloads](https://img.shields.io/npm/dt/@aoijs/aoijs.canvas.svg?maxAge=3600)](https://www.npmjs.com/package/aoijs.canvas)
[![NPM Version](https://img.shields.io/npm/v/@aoijs/aoijs.canvas.svg?maxAge=3600)](https://www.npmjs.com/package/aoijs.canvas)

</div>

## About

aoi.canvas is an aoi.js extension that allows you to create and edit images with your aoi.js bot.

## Installation

```sh
npm install aoijs.canvas
```

## Documentation

For detailed documentation, usage examples, and more, please visit the [aoi.canvas documentation](https://aoi.js.org/extensions/aoijs/aoicanvas).

## Setup

```js
const { AoiClient } = require('aoi.js');
const { AoiCanvas } = require('aoijs.canvas');

const client = new AoiClient({
    intents: ['Guilds', 'GuildMessages', 'MessageContent'],
    events: ['onMessage', 'onInteractionCreate'],
    prefix: 'Discord Bot Prefix',
    token: 'Discord Bot Token',
    database: {
        type: 'aoi.db',
        db: require('@akarui/aoi.db'),
        dbType: 'KeyValue',
        tables: ['main'],
        securityKey: 'a-32-characters-long-string-here'
    }
});

const canvas = new AoiCanvas(client);

// Ping Command Example
client.command({
    name: 'ping',
    code: `Pong! $pingms`
});

// House Command Example
client.command({
    name: 'house',
    code: `
        $attachCanvas[mycanvas;house.png]
        
        $stroke[mycanvas;#03a9f4;10]

        $closePath[mycanvas]
        $lineTo[mycanvas;250;140]
        $lineTo[mycanvas;150;60]
        $moveTo[mycanvas;50;140]
        $beginPath[mycanvas]

        $fillRect[mycanvas;#03a9f4;130;190;40;60]
        $strokeRect[mycanvas;#03a9f4;75;140;150;110;10]

        $createCanvas[mycanvas;300;320]
    `
});
```

If you have any questions or need help, ask in the official aoi.js [server](https://discord.com/invite/HMUfMXDQsV).

Enjoy coding with aoi.canvas! ❤