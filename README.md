# Bot SDK 2

## Test samples

```
BOTFUEL_APP_ID=caa4023f BOTFUEL_APP_KEY=ed02761d20c42480255cb4e2f4b532b4 npm run test-samples
```

## Generate the documentation

The code of the sdk is documented with JSDoc, to generate the doc use the following command :

```
npm run docs
```

## Add/Update headers of js files in the SDK

The script update all js files within a scope, by default the scope is the `src` directory
To header file is `header.txt` under the root directory

To update headers, run:

```
sh scripts/add-header.sh
```

You can pass the scope argument to update one directory, or one js file, for example:

```
sh scripts/add-header.sh src/bot.js
```

## License

See the [LICENSE](LICENSE.md) file.
