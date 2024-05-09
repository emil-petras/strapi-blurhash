# Strapi plugin strapi-blurhash

A plugin for <a href="https://github.com/strapi/strapi">Strapi CMS</a> that generates blurhash for your uploaded images.

## Links

[npm blurhash package](https://www.npmjs.com/package/strapi-blurhash)

[github blurhash source](https://github.com/emil-petras/strapi-blurhash)


## Installation

To install, run:

```bash
npm install strapi-blurhash
```

Open/create file `config/plugins.js`. Enable this plugin by adding:

```js
module.exports = {
    ...
    'strapi-blurhash': {
      enabled: true,
      config: {
        regenerateOnUpdate: true,
        forceRegenerateOnUpdate: false,
      }
    },
  }
```

## How to generate blurhash for an image

In the Strapi Dashboard open Content Manager. Edit one collection/single type. Add or edit a Media field type and save the collection/single type.

## How to get blurhash

Target a Strapi REST API endpoint. For example:

```
localhost:1337/api/products?populate=Image.*
```

The response will be a JSON containing blurhash along with rest of the image data:

```js
{
  "data": [
    {
      "id": 6,
      "attributes": {
        "name": "Test",
        "createdAt": "2022-10-27T14:52:04.393Z",
        "updatedAt": "2022-10-28T09:58:22.238Z",
        "Image": {
          "data": {
            "id": 80,
            "attributes": {
              "name": "image.png",
              "alternativeText": "image.png",
              "caption": "image.png",
              "width": 960,
              "height": 168,
              "formats": {
                ...
              },
              "hash": "image_ed1fbcdba0",
              "ext": ".png",
              "mime": "image/png",
              "size": 4.63,
              "url": "/uploads/image_ed1fbcdba0.png",
              "previewUrl": null,
              "provider": "local",
              "provider_metadata": null,
              "createdAt": "2022-10-28T09:42:02.471Z",
              "updatedAt": "2022-10-28T09:42:02.471Z",
              "blurhash": "U{Nd,T?bof?u_Nxuj[x[objZayoe_Mxuj[x["
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

## Regenerating Existing Content

If you've recently installed this plugin and already have existing media content, you can easily update the blurhash for these items. Use the **Regenerator** plugin to efficiently handle this task:

- [Regenerator Plugin](https://github.com/emil-petras/strapi-regenerator?tab=readme-ov-file)

This additional plugin can automate the process.

## Changelog
All notable changes to this project will be documented in this section.

### [1.2.1]
#### Changed
- now using `sharp` instead of canvas due to issues with .webp images.

### [1.2.2]
#### Added
- `forceRegenerateOnUpdate` configuration option to force the regeneration of blurhash on every update, regardless of the existing blurhash.

### [1.2.3]
#### Fixed
- fixed a bug with the image url

### [1.2.4]
#### Fixed
- fixed a bug with the image url var

### [1.2.5]
#### Changed
- updated the readme file

### [1.2.6]
#### Changed
- updated tags