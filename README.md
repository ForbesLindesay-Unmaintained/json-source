json-source
===========

A simple JSON data-source for data-table.

## Usage

To use the json source, you must first initialize it by passing it a reference to the table and a boolean representing whether editing is supported.  The reason for making that an option is that it won't automatically persist the changes to data between page loads.

### Initialize

```javascript
var source = require('json-source')(table, supportsWrite);
```

### Set Data

There are two ways of setting the json data to provide the source for json-source.  You can either do so in the html or the JavaScript.

From HTML:

```html
<html>
  <thead>
    <tr><th>Username</th><th>Real Name</th></tr>
  </thead>
  <tbody>
    <script type="application/json-data">
      [
        {username: "ForbesLindesay", name: "Forbes Lindesay"},
        {username: "substack", name: "James Halliday"},
        {username: "visionmedia", name: "TJ Holowaychuk"}
      ]
    </script>
  </tbody>
</html>
```

From JavaScript:

```javascript
source.setData([
    {username: "ForbesLindesay", name: "Forbes Lindesay"},
    {username: "substack", name: "James Halliday"},
    {username: "visionmedia", name: "TJ Holowaychuk"}
  ]);
```

### Set the ID

If your id property is not `record.id` then you need to overide the default implimentation of `getID`.  Here is what you'd do if you had the data above (where username is the id):

```javascript
source.getID = function (record) {
  return record.user;
};
```

### Register

You must then register the json data-source with a data-table.  To do this, simply use the following code:

```javascript
table.source(source);
```