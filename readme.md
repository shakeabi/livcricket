# livcricket

> livcricket is a simple CLI made using React-ink for cricket lovers. It includes various features like notifications and customisable refreshTime.


## Install

```
$ git clone https://github.com/shakeabi/livcricket.git
$ cd livcricket
$ npm install
$ Configure the settings.json
$ npm link
```

## Uninstall

```
$ npm unlink - (from project directory)
```

## Settings

```
1. refreshTime: Time period, in seconds, between updates
2. notifications: set it to true for notifications - requires zenity (check using "which notify-send" in terminal)
3. maxCharacters: maximum number of characters to be displayed in the score summary
4. repo_path: set the absolute location of the repo (ex: "~/Downloads/livcricket")
```

## CLI

```
$ livcriket --help

  Usage
    $ livcriket

  Options
    --version

  Examples
    $ livcriket --version
    1.0.0

  Note:
	-> Checkout the settings.json to look into more features of the app.
	-> You need to have notify-send to enable notifications, try 'notify-send "Hey Sexy!" to check if you've notify-send support.
	-> The refreshtime must be given in seconds.
	-> Maxcharacters can be modified if you've smaller or bigger terminals. It'll be reflected in the score display.
	-> Drop a star if you find this project useful (https://github.com/shakeabi/livcricket)
	
	Other:
	-> Made with lots of love by Abishake (https://github.com/shakeabi)
	-> Thanks to AdarshPatel (https://github.com/adarshPatel509)
```
<img src="ss1.png" alt="screenshot"/>
<img src="ss2.png" alt="screenshot"/>
