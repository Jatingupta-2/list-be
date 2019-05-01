define({ "api": [
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/items/view/all",
    "title": "api for Items view all.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "listId",
            "description": "<p>listId of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "     \n { error: 'false',\n    message: 'All Items Found',\n    status: 200,\n    data:\n    { listId: '2BmYuDxH3',\n        userId: 'PqUWyXaZ2',\n        listName: 'A new List',\n        item: [] \n    } \n}",
          "type": "object"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\n{\n            \"error\": true,\n            \"message\": \"Failed To Find Item Details\",\n            \"status\": 500,\n            \"data\": null\n           }",
          "type": "json"
        }
      ]
    },
    "filename": "item/item.js",
    "groupTitle": "users",
    "name": "PostApiV1ItemsViewAll"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/items/viewList",
    "title": "api for Viewing List.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "userId",
            "description": "<p>userId of the user. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "     \n { error: 'false',\n    message: 'All Lists',\n    status: 200,\n    data:\n    [ { listId: '2BmYuDxH3',\n        userId: 'PqUWyXaZ2',\n        listName: 'A new List',\n        item: [] },\n        { listId: 'pGwntczXM',\n        userId: 'PqUWyXaZ2',\n        listName: 'A new List',\n        item: [] \n    } ]\n\n}",
          "type": "object"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "\n{\n            \"error\": true,\n            \"message\": \"No List Found\",\n            \"status\": 500,\n            \"data\": null\n           }",
          "type": "json"
        }
      ]
    },
    "filename": "item/item.js",
    "groupTitle": "users",
    "name": "PostApiV1ItemsViewlist"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "post",
    "url": "/api/v1/users/signup",
    "title": "api for adding List.",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstName",
            "description": "<p>userId of the user. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastName",
            "description": "<p>listName of the list. (body params) (required)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "mobileNumber",
            "description": "<p>item of the list. (body params) (required)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{  error: false,\n   message: 'User created',\n   status: 200,\n   data:\n   { listId: {\"\"},\n       userId:{ \"\"},\n       listName:{\"\"},\n       item: [{\"\"}]\n   }",
          "type": "object"
        }
      ]
    },
    "filename": "item/item.js",
    "groupTitle": "users",
    "name": "PostApiV1UsersSignup"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/items/edit",
    "title": "api for items edit.",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "    \n{ error: false,\n   message: 'Edited Successfully',\n   status: 200,\n   data: { n: 1, nModified: 1, ok: 1 } \n}",
          "type": "object"
        }
      ]
    },
    "filename": "item/item.js",
    "groupTitle": "users",
    "name": "PutApiV1ItemsEdit"
  },
  {
    "group": "users",
    "version": "1.0.0",
    "type": "put",
    "url": "/api/v1/items/undo",
    "title": "api for undo.",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "myResponse",
            "description": "<p>shows error status, message, http status code, result.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "     \n { \n    error: false,\n    message: 'Undo Successful',\n    status: 200,\n    data: { n: 1, nModified: 1, ok: 1 \n    } \n}",
          "type": "object"
        }
      ]
    },
    "filename": "item/item.js",
    "groupTitle": "users",
    "name": "PutApiV1ItemsUndo"
  }
] });
