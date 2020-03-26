# looking-glass
A desktop application that allows you to see patterns in data.

[![CircleCI](https://circleci.com/gh/kadhirvelm/looking-glass.svg?style=svg)](https://circleci.com/gh/kadhirvelm/looking-glass) [![BCH compliance](https://bettercodehub.com/edge/badge/kadhirvelm/looking-glass?branch=develop)](https://bettercodehub.com/) [![Known Vulnerabilities](https://snyk.io/test/github/kadhirvelm/looking-glass/badge.svg)](https://snyk.io/test/github/kadhirvelm/looking-glass)

## Dev instructions
1. Pull the repo and install the dependencies using `yarn`
2. Build all the packages by running `yarn build`
3. Run `yarn dev` to turn live dev mode on
4. In a separate terminal instance run `yarn start` to open the electron-app
5. Make edits and see them reflected live in the app

Note: whenever you make changes to `application-server` or `application-scripts` you will likely need to restart `yarn start`, the electron instance. It does not pick up live changes from its dependencies. If you're only dev-ing on the frontend, you should see live reloads.
