# Strapi plugin strapi-blurhash

A plugin for <a href="https://github.com/strapi/strapi">Strapi CMS</a> that generates blurhash for your uploaded images

## Installation

To install, run:

```bash
npm install @strapi/strapi-blurhash
```

Open/create file `config/plugins.js`. Enable this plugin by adding:

```js
module.exports = {
    ...
    'strapi-blurhash': {
      enabled: true,
      resolve: './src/plugins/strapi-blurhash/',
    },
  }
```

## How to generate blurhash for an image

In the Strapi Dashboard open Content Manager. Edit one collection/single type. Add or edit a Media field type and save the collection/single type.

## How to get blurhas

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
                "thumbnail": {
                  "name": "thumbnail_image.png",
                  "hash": "thumbnail_image_ed1fbcdba0",
                  "ext": ".png",
                  "mime": "image/png",
                  "path": null,
                  "width": 245,
                  "height": 43,
                  "size": 2.99,
                  "url": "/uploads/thumbnail_image_ed1fbcdba0.png"
                },
                "medium": {
                  "name": "medium_image.png",
                  "hash": "medium_image_ed1fbcdba0",
                  "ext": ".png",
                  "mime": "image/png",
                  "path": null,
                  "width": 750,
                  "height": 131,
                  "size": 15.55,
                  "url": "/uploads/medium_image_ed1fbcdba0.png"
                },
                "small": {
                  "name": "small_image.png",
                  "hash": "small_image_ed1fbcdba0",
                  "ext": ".png",
                  "mime": "image/png",
                  "path": null,
                  "width": 500,
                  "height": 88,
                  "size": 8.48,
                  "url": "/uploads/small_image_ed1fbcdba0.png"
                }
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