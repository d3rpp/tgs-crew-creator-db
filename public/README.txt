# **Attention Marker**:

if you want to serve this, it can be done with the following method:

There is a Database Schema in `src/api/.dbschema/schema.spl`.

if you have nodejs installed, simply run `setupdb.js` and it will do the whole process for you.
if you dont have node js installed, what kinda dev are you?

## Using a PHP dev server

behind the scenes, PHP is a program that takes a PHP script and spits out HTML, the Apache server just uses it, to start off with, 
use the following script to check php is installed, open a command prompt on windows, or a terminal on MacOS

```
	php -v
```

if it spits out something like this:

```
	PHP 8.0.7 (cli) (built: Jun  4 2021 03:56:55) ( NTS )
	Copyright (c) The PHP Group
	Zend Engine v4.0.7, Copyright (c) Zend Technologies
	with Zend OPcache v8.0.7, Copyright (c), by Zend Technologies
```

then you're all good.

now you need to use your terminal to go to the `dist` directory of this folder, this can be done on windows by opening it on file explorer,
clicking the top bar, and typing `cmd`. from there, you can type 

```
	php -S 0.0.0.0:5500
``` 

> this will launch a PHP server on `localhost:5500`, you can then launch your browser and type `localhost:5500` in order to access the website.

### Note: PHP wont launch

If the version command `php -v` doesn't return the expected results, it meant that your version of xampp didn't install php directly, for this method to work, php is required.

#### On Windows

follow this [https://www.sitepoint.com/how-to-install-php-on-windows/](https://www.sitepoint.com/how-to-install-php-on-windows/)

#### On MacOS

---

## Using XAMPP
This method only works if the contents of dist are in the root of `htdocs`, (i.e. `index.html` is in the first part of `htdocs`). since in most cases this wint be possible, it is best to use the method above.


---

_now onto the readme_

# Takapuna Grammar School Rowing Club Crew Creator

My NCEA Level 3.4 assesment for Level 3 Computer Science in 2021

# Using
in order to open the index.html, open the one in the `dist` directory

# Compiling

whilst this repository can easily run without the need to compile, no changes can be made without recompilation

to compile ensure that you have a recent version of NodeJS and NPM installed

to install all of the required packages, use:
```bash
npm i
```

this will install the typescript compiler and the sass compiler
add a `-g` flag at the end to install this globally.

In order to compile it in watch mode, open a terminal or command prompt and run 
```bash
npm run dev
```

**note**
This compilation process requires:
1. php to be installed, this is used as a web server
2. port 1234 to be open
it will build without these but the watch server requires both of these conditions

this will run the compiler in watch mode, any changes will be reflected immediately

**NOTE:** this will only work for MacOS and Linux, if you use windows, run `./.compile.bat` (untested)

---

# Production

in order to deploy this app to production the code should be served with the `dist` folder as the root directory

you should also set the production server to ignore `dotfiles` as this would expose some private apis and potentially the database schema
