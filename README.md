# Epiphany Fixes

It's hard for developers to make webpages work for everyone. Let's help them!

## Installation

Run the build script with your an NPM package manager:

```sh
pnpm build
```

You will then get two new files in the `_build` folder; these are the stylesheet and the script files respectively. If your browser has an extension that loads custom CSS and JS then copy/paste the content of these generated files into it. If your browser supports custom user CSS and JS e.g. GNOME Web then simply symlink to these generated files (TBA: detailed guide).
