# TGS Rowing Club Crew Creator 2.0
_now using MySQL_

# Table of Contents
- [TGS Rowing Club Crew Creator 2.0](#tgs-rowing-club-crew-creator-20)
- [Table of Contents](#table-of-contents)
- [Running](#running)
	- [MacOS / Linux](#macos--linux)
	- [Windows](#windows)
- [About](#about)

#Requirements
to run this, you require

- MySQL Server on port 3306 (this is the default)
  - This includes the server AND C++ bindings (which're installed by default)
- NodeJS
- npm (comes with NodeJS)
- an internet connection (because this thing as a *few* dependencies)

<br /><br /><br />

# Running
## MacOS / Linux
In MacOS and Linux, the commands are the same, use

```
	npm run unix
```

to do everything, this will
- install all dependencies
- build the front end
- start the server
you can also run the scripts individually

```
	npm run unix:init
```

to install all dependencies, then use

```
	npm run unix:fe:build
```

to build the front end

```
	npm run unix:dev
```

to start the server, this'll also serve the front-end

<br /><br /><br />

## Windows
this is untested but it should work, let me know if it doesnt idk windows its bad

```
	npm run win
```

to do everything, this will
- install all dependencies
- build the front end
- start the server
you can also run the scripts individually

```
	npm run win:init
```

to install dependencies

```
	npm run win:fe:build
```

to build the front end

```
	npm run win:dev
```

to start the server, this'll also serve the front-end

<br /><br /><br />

# About

this is the TGS Rowing Club Crew Creator MySQL port, it is being used as my NCEA 3.3 and 3.4 digital technologies assesment so it's quite basic.

have fun fucking with it, feel free to clone it and make it your own instead

idc...

this is the first time i've ever actually made a full stack application

this thing is worth 14 NCEA Credits for me

hooray