# FxA Strapi

This repo hosts the Strapi config and content schema for supporting the main FxA monorepo.

Strapi is currently used to host supporting product information for the subscription platform part of FxA.

## Branches

This repo is setup such that there are 3 main branches -- dev, stg, and prod. These each correlate to their associated environment and are deployed on push, rather than on tag.

## Content

Content is stored within our cloud environment. At this time, we do not have a dump publicly available however that may change.


## Commands

You can use the Strapi [Command Line Interface](https://docs.strapi.io/dev-docs/cli) if desired, though not necessary.

### Developing

You can start the application with livereload via `yarn develop`.

[Strapi CLI develop](https://docs.strapi.io/dev-docs/cli#strapi-develop)

### Starting

You can start the application without livereload via `yarn start`.

[Strapi CLI start](https://docs.strapi.io/dev-docs/cli#strapi-start)

### Building

You can build the application via `yarn build`

[Strapi CLI build](https://docs.strapi.io/dev-docs/cli#strapi-build)

