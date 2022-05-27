/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
var Airtable = require('airtable');

exports.dataEntry = (req, res) => {
 const tag = req.body.fulfillmentInfo.tag;
 const value = req.body.sessionInfo.parameters;
  let text = `Hola ${tag + JSON.stringify(value)}`;
  var base = new Airtable({apiKey: 'key0F7rNFvRKW8w4u'}).base('app2Vcu1BncXGBUpE');
  console.log( JSON.stringify(value))
base('Table 1').create([
  {
    "fields": {
      nombre:value.nombre.original,
      rol:value.rol,
      conjunto:value.conjunto.original,
      conjuntosize:Number(value.conjuntosize), 
      email:value.email, 
      interes:value.interes,
      fecha:value.fecha
      }
  }
], function(err, records) {
  if (err) {
    console.error(err);
    return;
  }
  records.forEach(function (record) {
    console.log(record.getId());
  });
});





/**
 if (tag == 'Nombre del usuario') {
    text = `Hola ${tag + value.person}`;
  } else if (tag === 'get-name') {
    text = 'My name is Flowhook';
  } else {
    text = `There are no fulfillment responses defined for "${tag}"" tag`;
  }
 */
  

  const jsonResponse = {
    fulfillment_response: {
    }
  };

  res.send(jsonResponse);
};
